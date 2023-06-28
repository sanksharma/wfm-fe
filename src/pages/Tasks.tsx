import { Spinner, Status, StatusPill } from "@/components/elements";
import { Button } from "@/components/elements/Button";
import { Task, useTasks } from "@/features/tasks";
import { useUpdateTask } from "@/features/tasks/api/updateTask";
import { useCamera } from "@capacitor-community/camera-react";
import { Camera, CameraResultType } from "@capacitor/camera";
import { Capacitor } from "@capacitor/core";
import { useCallback } from "react";

function Tasks() {
  const { data, refetch, isLoading, isFetching } = useTasks();
  const updateTask = useUpdateTask();
  const { getPhoto } = useCamera();

  const triggerCamera = useCallback(
    async function triggerCamera() {
      const permissionStatus = await Camera.checkPermissions();

      if (permissionStatus.camera !== "granted") {
        const permissionStatus = await Camera.requestPermissions({
          permissions: ["camera"],
        });
        if (permissionStatus.camera !== "granted") {
          return;
        }
      }

      getPhoto({
        quality: 100,
        allowEditing: false,
        resultType: CameraResultType.Base64,
      }).then(console.log);
    },
    [getPhoto]
  );

  const tasks: Task[] = data?.data.tasks ?? [];

  if (isLoading) {
    return (
      <div className="bg-gray-100 flex justify-center items-center w-full h-screen">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen max-w-full bg-gray-100 p-4">
      <div className="bg-white rounded-md shadow-md p-4">
        <div className="flex justify-between">
          <h1 className="text-xl font-medium">My Tasks</h1>
          {!Capacitor.isNativePlatform() ? (
            <Button onClick={() => refetch()}>
              {isFetching ? "Fetching..." : "Refetch"}
            </Button>
          ) : (
            <Button onClick={triggerCamera}>Open Camera</Button>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="mt-8 table-fixed text-left text-sm font-light">
            <thead className="bg-slate-50 uppercase">
              <tr>
                <th scope="col" className="px-6 py-4 font-light">
                  Task Description
                </th>
                <th scope="col" className="px-6 py-4 font-light">
                  Due Date
                </th>
                <th scope="col" className="px-6 py-4 font-light">
                  Assignee
                </th>
                <th scope="col" className="px-6 py-4 font-light">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task) => (
                <tr className="border-b" key={task.id}>
                  <td className="px-6 py-4">{task.desc}</td>
                  <td className="px-6 py-4">{task.dueDate}</td>
                  <td className="px-6 py-4">{task.assignee.name}</td>
                  <td>
                    <StatusPill
                      value={task.status.toUpperCase() as Status}
                      onStatusChange={() =>
                        updateTask.mutate({ data: { taskId: task.id } })
                      }
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Tasks;
