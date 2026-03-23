import type { NextApiRequest, NextApiResponse } from 'next';
import webpush from 'web-push';
import { getSubscriptions, removeSubscription } from '../../utils/pushSubscriptions';

webpush.setVapidDetails(
  'mailto:example@example.com',
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || '',
  process.env.VAPID_PRIVATE_KEY || ''
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { title, body } = req.body;

  if (!title || !body) {
    return res.status(400).json({ error: 'Missing title or body' });
  }

  const payload = JSON.stringify({
    title,
    body,
  });

  const subscriptions = getSubscriptions();

  const results = await Promise.all(
    subscriptions.map(async (subscription) => {
      try {
        await webpush.sendNotification(subscription as any, payload);
        return { endpoint: subscription.endpoint, success: true };
      } catch (error: any) {
        if (error.statusCode === 410 || error.statusCode === 404) {
          // Subscription is no longer valid, remove it
          removeSubscription(subscription.endpoint);
        }
        return { endpoint: subscription.endpoint, success: false, error: error.message };
      }
    })
  );

  return res.status(200).json({ success: true, results });
}
