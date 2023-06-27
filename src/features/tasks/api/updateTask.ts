import { axios } from "@/lib/axios";
import { sendTaskStatusChangeNotification } from "@/lib/local-notifications";
import { useMutation } from "react-query";

export type UpdateTaskDTO = {
  data: {
    taskId: number;
  };
};

export const updateTask = ({ data }: UpdateTaskDTO) => {
  return axios.put("/tasks", data);
};

export const useUpdateTask = () => {
  return useMutation({
    onSuccess: ({ data }) => {
      const { task } = data;
      sendTaskStatusChangeNotification(task);
    },
    mutationFn: updateTask,
  });
};
