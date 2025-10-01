// importScripts("https://cdn.pushalert.co/sw-84608.js");

// self.addEventListener('push', function(event) {
//   const options = {
//     body: event.data ? event.data.text() : 'New message received!',
//     icon: '/icon-192x192.png', // Add your app icon
//     badge: '/badge-72x72.png', // Add your badge icon
//     tag: 'message-notification',
//     data: {
//       url: '/chat' // Where to redirect when notification is clicked
//     }
//   };

//   event.waitUntil(
//     self.registration.showNotification('SpaceShare - New Message', options)
//   );
// });

// self.addEventListener('notificationclick', function(event) {
//   event.notification.close();
//   event.waitUntil(
//     clients.openWindow(event.notification.data.url)
//   );
// });
self.addEventListener('push', function(event) {
  let data = {};
  
  if (event.data) {
    try {
      data = event.data.json();
    } catch (e) {
      data = { body: event.data.text() };
    }
  }

  const options = {
    body: data.body || 'New message received!',
    icon: data.icon || '/icon-192x192.png',
    badge: data.badge || '/badge-72x72.png',
    // IMPORTANT: Use unique tag or timestamp to show multiple notifications
    tag: data.tag || `notification-${Date.now()}`, // Unique tag for each notification
    requireInteraction: false, // Allow auto-dismiss
    renotify: true, // Show notification even if tag exists
    vibrate: [200, 100, 200], // Vibration pattern for mobile
    data: data.data || {
      url: '/chat'
    },
    actions: [ // Add action buttons (mobile support varies)
      {
        action: 'open',
        title: 'Open Chat'
      },
      {
        action: 'close',
        title: 'Dismiss'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification(data.title || 'SpaceShare - New Message', options)
  );
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  
  if (event.action === 'close') {
    return;
  }
  
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then(function(clientList) {
        // If app is already open, focus it
        for (let i = 0; i < clientList.length; i++) {
          let client = clientList[i];
          if ('focus' in client) {
            return client.focus();
          }
        }
        // Otherwise open new window
        if (clients.openWindow) {
          return clients.openWindow(event.notification.data.url || '/chat');
        }
      })
  );
});
