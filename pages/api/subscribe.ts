import type { NextApiRequest, NextApiResponse } from 'next';
import { addSubscription } from '../../utils/pushSubscriptions';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const subscription = req.body;

  if (!subscription?.endpoint || !subscription?.keys) {
    return res.status(400).json({ error: 'Invalid subscription payload' });
  }

  addSubscription(subscription);
  return res.status(201).json({ success: true });
}
