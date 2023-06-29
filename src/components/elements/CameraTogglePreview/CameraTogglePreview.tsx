import { useEffect, useRef, useState } from "react";
import { Toggle } from "..";

export function CameraTogglePreview() {
  const [openCamera, toggleCamera] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  function handleCameraToggle() {
    toggleCamera((prev) => {
      if (prev) {
        stopCamera();
      }

      return !prev;
    });
  }

  async function getVideo() {
    const video = videoRef.current;

    if (
      video &&
      navigator.mediaDevices &&
      navigator.mediaDevices.getUserMedia
    ) {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: 600 }, height: { ideal: 400 } },
        });

        mediaStreamRef.current = mediaStream;

        video.srcObject = mediaStream;
        video.onloadedmetadata = () => {
          video.play();
        };
      } catch (error) {
        console.error("error", error);
      }
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

  useEffect(() => {
    if (openCamera) getVideo();
    else stopCamera();
  }, [openCamera, videoRef]);

  return (
    <div className="camera flex justify-center items-center p-4">
      <p className="mr-4">Camera On/OFF</p>
      <Toggle onChange={handleCameraToggle} />
      {openCamera ? <video id="videoElement" ref={videoRef}></video> : null}
    </div>
  );
}
