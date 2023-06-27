import { useQuery } from "react-query";
import { axios } from "@/lib/axios";
import { sendOverdueTasksNotification } from "@/lib/local-notifications";
import { Task } from "..";
import { Capacitor } from "@capacitor/core";

export const getTasks = () => {
  return axios.get("/tasks");
};

export const useTasks = () => {
  return useQuery({
    refetchOnWindowFocus: Capacitor.isNativePlatform(),
    queryKey: ["tasks"],
    queryFn: () => getTasks(),
    onSuccess: ({ data }) => {
      const tasks: Task[] = data?.tasks;
      sendOverdueTasksNotification(tasks);
    },
  });
};
