import { Spinner, Status, StatusPill } from "@/components/elements";
import { Button } from "@/components/elements/Button";
import { Task, useTasks } from "@/features/tasks";
import { useGetTaskNotification } from "@/features/tasks/api/getTaskNotification";
import { useUpdateTask } from "@/features/tasks/api/updateTask";
import { useCamera } from "@capacitor-community/camera-react";
import { Camera, CameraResultType } from "@capacitor/camera";
import { Capacitor } from "@capacitor/core";
import { useCallback, useEffect, useRef, useState } from "react";

function Toggle({
  taskDesc,
  onChange,
}: {
  taskDesc?: string;
  onChange?: () => void;
}) {
  const [enabled, setEnabled] = useState(false);
  const getTaskNotification = useGetTaskNotification();

  const subscriptionRaw = localStorage.getItem("subcriptionObj");
  if (!subscriptionRaw) {
    return null;
  }

  const subscription = JSON.parse(subscriptionRaw);

  return (
    <div className="relative flex flex-col items-center justify-center overflow-hidden">
      <div className="flex">
        <label className="inline-flex relative items-center mr-5 cursor-pointer">
          <input
            type="checkbox"
            className="sr-only peer"
            checked={enabled}
            readOnly
          />

          <div
            onClick={() => {
              setEnabled(!enabled);

              if (onChange) {
                onChange();
                return;
              }

              getTaskNotification.mutate({
                data: {
                  subscription,
                  taskDesc: taskDesc ?? "",
                  checked: enabled,
                },
              });
            }}
            className="w-11 h-6 bg-gray-200 rounded-full peer  peer-focus:ring-green-300  peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"
          ></div>
        </label>
      </div>
    </div>
  );
}

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

  const [openCamera, toggleCamera] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  async function getVideo() {
    const video = videoRef.current;

    if (
      video &&
      navigator.mediaDevices &&
      navigator.mediaDevices.getUserMedia
    ) {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 600 }, height: { ideal: 400 } },
      });

      mediaStreamRef.current = mediaStream;

      video.srcObject = mediaStream;
      video.onloadedmetadata = () => {
        video.play();
      };
    }
  }

  function stopCamera() {
    if (videoRef.current?.srcObject) {
      videoRef.current.srcObject = null;
    }

    const mediaStream = mediaStreamRef.current;

    if (mediaStream) {
      mediaStream.getVideoTracks().forEach((track) => {
        track.stop();
      });
    }
  }

  const handleCameraToggle = () => {
    toggleCamera((prev) => {
      if (prev) {
        stopCamera();
      }

      return !prev;
    });
  };

  useEffect(() => {
    if (openCamera) getVideo();
    else stopCamera();
  }, [openCamera, videoRef]);

  const label = { inputProps: { "aria-label": "Color switch demo" } };

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
                <th scope="col" className="px-6 py-4 font-light">
                  Is Work Done?
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
                  <td>
                    <Toggle taskDesc={task.desc} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="camera flex justify-center items-center p-4">
          <p className="mr-4">Camera On/OFF</p>
          <Toggle onChange={handleCameraToggle} {...label} />
          {openCamera ? <video id="videoElement" ref={videoRef}></video> : null}
        </div>
      </div>
    </div>
  );
}

export default Tasks;
