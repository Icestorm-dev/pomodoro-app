type StoredPushSubscription = {
  endpoint: string;
  keys: {
    auth: string;
    p256dh: string;
  };
};

let subscriptions: Array<StoredPushSubscription> = [];

export const addSubscription = (subscription: StoredPushSubscription): void => {
  const exists = subscriptions.some(
    (item) => item.endpoint === subscription.endpoint
  );
  if (!exists) {
    subscriptions.push(subscription);
  }
};

export const removeSubscription = (endpoint: string): void => {
  subscriptions = subscriptions.filter((item) => item.endpoint !== endpoint);
};

export const getSubscriptions = (): Array<StoredPushSubscription> => subscriptions;
