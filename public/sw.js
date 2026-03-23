/* eslint-disable no-restricted-globals */

// Обработка push-уведомлений даже когда приложение не активно
self.addEventListener('push', (event) => {
  const data = event.data?.json() ?? {};
  const title = data.title || 'Pomodoro завершен!';
  const options = {
    body: data.body || 'Перерыв начался. Отличная работа! ⏰',
    icon: '/assets/logo.svg',
    badge: '/assets/logo.svg',
    tag: 'pomodoro-notification',
    requireInteraction: false,
    actions: [
      {
        action: 'open',
        title: 'Открыть приложение',
      },
      {
        action: 'close',
        title: 'Закрыть',
      },
    ],
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

// Обработка клика по уведомлению
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'close') {
    return;
  }

  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((clientList) => {
      // Если окно уже открыто, фокусируемся на нём
      if (clientList.length > 0) {
        return clientList[0].focus();
      }
      // Если нет, открываем новое
      return clients.openWindow('/');
    })
  );
});

// Обработка отправки уведомления
self.addEventListener('notificationclose', (event) => {
  event.notification.close();
});

// Поддержка фонового обновления
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-notification') {
    event.waitUntil(
      fetch('/api/sync-notification')
        .then((response) => response.json())
        .catch(() => {
          // Игнорируем ошибки, если сервер недоступен
        })
    );
  }
});
