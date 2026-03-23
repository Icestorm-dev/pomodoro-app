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
    });
  } catch (error) {
    // Игнорируем ошибки, если Notification API недоступен
    // или если браузер не позволяет показывать уведомление.
    // eslint-disable-next-line no-console
    console.error('Не удалось показать уведомление:', error);
  }
};
