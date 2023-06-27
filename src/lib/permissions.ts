import { LocalNotifications } from "@capacitor/local-notifications";

export async function getNotificationsPermission() {
  const permissionStatus = await LocalNotifications.checkPermissions();

  if (permissionStatus.display === "granted") {
    return;
  }

  LocalNotifications.requestPermissions().then((permissionStatus) => {
    if (permissionStatus.display === "denied") {
      alert(
        "You denied the permission, go to settings and enable notifications."
      );
    } else if (permissionStatus.display !== "granted") {
      alert(
        "You need to give permission to have notifications. Restart app to get the prompt again."
      );
    }
  });

  LocalNotifications.requestPermissions;
}
