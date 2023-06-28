export default function swDev() {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker
      .register(`/serviceWorker.js`)
      .then((registerationObj) => {
        return registerationObj.pushManager
          .getSubscription()
          .then((subcriptionObj) => {
            if (!subcriptionObj) {
              Notification.requestPermission()
                .then(async (permission) => {
                  if (permission === "granted") {
                    const sub = await registerationObj.pushManager.subscribe({
                      userVisibleOnly: true,
                      applicationServerKey:
                        "BBZ-_LjVst1ZWLQQYIdLGBs4Ez_ApbNCQnOanFDBoT1AbJhYq7RovyWoo4BcJe8PCcswcCjwLckJ_1JSza-Ebfc",
                    });
                    localStorage.setItem("subcriptionObj", JSON.stringify(sub));
                    return sub;
                  }
                })
                .catch((error) => {
                  console.error("Error requesting permission:", error);
                });
            } else {
              localStorage.setItem(
                "subcriptionObj",
                JSON.stringify(subcriptionObj)
              );
            }
          });
      });
  }
}
