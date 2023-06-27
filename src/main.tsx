import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { registerLocalNotificationChannels } from "./lib/local-notifications.ts";
import { registerPushNotificationChannels } from "./lib/push-notifications.ts";
import { getNotificationsPermission } from "./lib/permissions.ts";

registerLocalNotificationChannels();
registerPushNotificationChannels();
getNotificationsPermission();

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
