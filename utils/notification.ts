export const isNotificationSupported = (): boolean =>
  typeof window !== 'undefined' && 'Notification' in window;

export const getNotificationPermission = (): NotificationPermission =>
  isNotificationSupported() ? Notification.permission : 'denied';

export const requestNotificationPermission = async (): Promise<NotificationPermission> => {
  if (!isNotificationSupported()) {
    return 'denied';
  }

  try {
    const permission = await Notification.requestPermission();
    return permission;
  } catch {
    return 'denied';
  }
};

export const isServiceWorkerSupported = (): boolean =>
  typeof window !== 'undefined' && 'serviceWorker' in navigator;

export const registerServiceWorker = async (): Promise<void> => {
  if (!isServiceWorkerSupported()) {
    return;
  }

  try {
    const registration = await navigator.serviceWorker.register(
      '/sw.js',
      { scope: '/' }
    );
    // eslint-disable-next-line no-console
    console.log('Service Worker registered:', registration);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Service Worker registration failed:', error);
  }
};

export const subscribeToPushNotifications = async (): Promise<PushSubscription | null> => {
  if (!isServiceWorkerSupported()) {
    return null;
  }

  try {
    const registration = await navigator.serviceWorker.ready;

    // Проверяем, уже ли есть подписка
    const existingSubscription = await registration.pushManager.getSubscription();
    if (existingSubscription) {
      return existingSubscription;
    }

    // Создаём новую подписку
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(
        process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || ''
      ),
    });

    return subscription;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Push subscription failed:', error);
    return null;
  }
};

export const unsubscribeFromPushNotifications = async (): Promise<boolean> => {
  if (!isServiceWorkerSupported()) {
    return false;
  }

  try {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();

    if (subscription) {
      await subscription.unsubscribe();
      return true;
    }
    return false;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Unsubscribe failed:', error);
    return false;
  }
};

// Вспомогательная функция для преобразования VAPID ключа
const urlBase64ToUint8Array = (base64String: string): Uint8Array => {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }

  return outputArray;
};

export const sendTimerCompleteNotification = (): void => {
  if (!isNotificationSupported()) {
    return;
  }

  if (Notification.permission !== 'granted') {
    return;
  }

  try {
    new Notification('Pomodoro завершен!', {
      body: 'Перерыв начался. Отличная работа! ⏰',
      icon: '/assets/logo.svg',
      tag: 'pomodoro-notification',
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Не удалось показать уведомление:', error);
  }
};

