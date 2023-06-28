this.addEventListener("push", (e) => {
  this.registration.showNotification(
    JSON.parse(e.data.text()).notification.body,
    {}
  );
});

this.addEventListener("notificationclick", (e) => {
  e.waitUntil(
    clients.matchAll({ type: "window" }).then((clientsArr) => {
      console.log("clientsArr", clientsArr);

      // If a Window tab matching the targeted URL already exists, focus that;
      const hadWindowToFocus = clientsArr.some((windowClient) => {
        return windowClient.url === e.notification.data.url
          ? (windowClient.focus(), true)
          : false;
      });
      // Otherwise, open a new tab to the applicable URL and focus it.
      if (!hadWindowToFocus)
        clients
          .openWindow(e.notification.data.url)
          .then((windowClient) => (windowClient ? windowClient.focus() : null));
    })
  );
});
