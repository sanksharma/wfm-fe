import { useState } from "react";

export type Status = "COMPLETED" | "INCOMPLETE";

export type StatusInfo = { title: string; bgcolor: string; color: string };

interface Props {
  value: Status;
  onStatusChange: (status: Status) => void;
}

function getStatusInfo(status: Status): StatusInfo {
  switch (status) {
    case "COMPLETED":
      return {
        title: "Completed",
        bgcolor: "bg-green-200",
        color: "text-green-700",
      };
    case "INCOMPLETE":
      return {
        title: "In Progress",
        bgcolor: "bg-orange-200",
        color: "text-orange-700",
      };
  }
}

export function StatusPill({ value, onStatusChange }: Props) {
  const [status, setStatus] = useState(value);
  const { title, bgcolor, color } = getStatusInfo(status);

  function handleStatusChange() {
    let newStatus: Status;

    if (status === "COMPLETED") {
      newStatus = "INCOMPLETE";
    } else {
      newStatus = "COMPLETED";
    }

    setStatus(newStatus);
    onStatusChange(newStatus);
  }

  return (
    <div
      className={`flex justify-center rounded-full w-28 px-4 ${bgcolor} ${color}`}
      onClick={handleStatusChange}
    >
      {title}
    </div>
  );
}
