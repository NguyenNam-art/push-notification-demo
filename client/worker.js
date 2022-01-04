console.log("Service Worker Loaded...");
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

self.addEventListener('push', event => {
  const data = event.data.json()
  console.log('New notification', data)
  const options = {
    data: data.url,
    body: 'Simple piece of body text'
  }
  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
})

self.addEventListener('notificationclick', function(event) {
  const clickedNotification = event.notification;
  clickedNotification.close();
  console.log('[Service Worker] Notification click Received. event:%s', event.notification);
  event.notification.close();
  if (self.clients.openWindow && event.notification.data) {
      event.waitUntil(self.clients.openWindow(event.notification.data));
  }
});
