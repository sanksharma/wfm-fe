import { axios } from "@/lib/axios";
import { useMutation } from "react-query";

export const getTaskNotification = ({ data }) => {
  return axios.post("/tasks/notify", data);
};

export const useGetTaskNotification = () => {
  return useMutation({
    mutationFn: getTaskNotification,
  });
};
