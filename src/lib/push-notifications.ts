import { FirebaseMessaging, Importance } from "@capacitor-firebase/messaging";
import { Capacitor } from "@capacitor/core";
import { axios } from "./axios";

const isNativePlatform = Capacitor.isNativePlatform();

export async function registerPushNotificationChannels() {
  if (!isNativePlatform) {
    return;
  }

  FirebaseMessaging.createChannel({
    name: "Push Notifications",
    id: "2",
    importance: Importance.Max,
  });

  const { token } = await FirebaseMessaging.getToken();

  axios.post("/tokens", {
    token,
  });
}
