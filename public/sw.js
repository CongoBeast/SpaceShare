// importScripts("https://cdn.pushalert.co/sw-84608.js");

self.addEventListener('push', function(event) {
  const options = {
    body: event.data ? event.data.text() : 'New message received!',
    icon: '/icon-192x192.png', // Add your app icon
    badge: '/badge-72x72.png', // Add your badge icon
    tag: 'message-notification',
    data: {
      url: '/chat' // Where to redirect when notification is clicked
    }
  };

  event.waitUntil(
    self.registration.showNotification('SpaceShare - New Message', options)
  );
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  event.waitUntil(
    clients.openWindow(event.notification.data.url)
  );
});
