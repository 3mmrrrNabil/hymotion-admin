/* HyMotion admin: shows the push notifications the server sends (new clients…). */
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (event) => event.waitUntil(self.clients.claim()));

self.addEventListener('push', (event) => {
  let d = {};
  try {
    const j = event.data ? event.data.json() : {};
    d = j.data || j;
  } catch (_) {
    d = { body: event.data ? event.data.text() : '' };
  }
  event.waitUntil(
    self.registration.showNotification(d.title || 'HyMotion', {
      body: d.body || '',
      tag: d.tag || 'hymotion-admin',
      icon: 'favicon.ico',
      dir: 'rtl',
      lang: 'ar',
      data: { link: d.link || '' },
    }),
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const base = self.registration.scope;
  const link = (event.notification.data && event.notification.data.link) || '';
  const url = base + (link ? '#/' + link : '');
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((list) => {
      for (const c of list) {
        if (c.url.startsWith(base)) {
          if ('navigate' in c) c.navigate(url).catch(() => {});
          return c.focus();
        }
      }
      return self.clients.openWindow(url);
    }),
  );
});
