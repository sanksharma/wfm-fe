import { Task } from "@/features/tasks";
import { Importance } from "@capacitor-firebase/messaging";
import { Capacitor } from "@capacitor/core";
import {
  LocalNotificationSchema,
  LocalNotifications,
} from "@capacitor/local-notifications";

const TODAY = new Date();
const isNativePlatform = Capacitor.isNativePlatform();

export function registerLocalNotificationChannels() {
  if (!isNativePlatform) {
    return;
  }

  LocalNotifications.createChannel({
    name: "Overdue Tasks",
    id: "1",
    importance: Importance.Max,
  });
}

export function sendOverdueTasksNotification(tasks: Task[]) {
  for (const task of tasks) {
    const dueDate = new Date(task.dueDate);
    const status = task.status.toUpperCase();
    const notifications: LocalNotificationSchema[] = [];

    if (dueDate.getTime() <= TODAY.getTime() && status === "INCOMPLETE") {
      const notification = {
        ...getOverdueTaskNotificationPayload(task),
        channelId: "1",
      };

      if (!isNativePlatform) {
        if (navigator.serviceWorker) {
          navigator.serviceWorker.ready.then((registration) => {
            registration.showNotification(notification.title, {
              body: notification.body,
            });
          });
        }
      } else {
        notifications.push(notification);
      }
    }

    if (isNativePlatform) {
      LocalNotifications.schedule({
        notifications,
      });
    }
  }
}

function getOverdueTaskNotificationPayload(task: Task) {
  return {
    id: task.id,
    title: "Task - Immediate Action Needed",
    body: `@${task.assignee.name}, "${task.desc}" is overdue. Take immediate action`,
  };
}

export function sendTaskStatusChangeNotification(task: Task) {
  const dueDate = new Date(task.dueDate);

  if (task.status === "COMPLETED" && dueDate > TODAY) {
    const notification = {
      channelId: "1",
      id: task.id,
      title: "Task Completed!",
      body: `Task "${task.desc}" is done on time. Good job.`,
    };

    if (isNativePlatform) {
      LocalNotifications.schedule({
        notifications: [notification],
      });
    } else {
      new Notification(notification.title, {
        body: notification.body,
      });
    }
  }
}
