import { axios } from "@/lib/axios";
import { useMutation } from "react-query";

type GetTaskNotificationDTO = {
  data: {
    subscription: string;
    taskDesc: string;
    checked: boolean;
  };
};

export const getTaskNotification = ({ data }: GetTaskNotificationDTO) => {
  return axios.post("/tasks/notify", data);
};

export const useGetTaskNotification = () => {
  return useMutation({
    mutationFn: getTaskNotification,
  });
};
