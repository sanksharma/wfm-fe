export type Task = {
  id: number;
  desc: string;
  dueDate: string;
  assignee: {
    name: string;
  };
  status: string;
};
