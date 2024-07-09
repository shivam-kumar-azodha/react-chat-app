import React, { useEffect, useState, useRef } from "react";
import TickIcon from "../icons/TickIcon";

interface AudioRecorderProps {
  isRecording: boolean;
  onStopRecording: (data: any) => void;
  confirmIcon?: React.ReactNode;
  className?: string;
}

const AudioRecorder: React.FC<AudioRecorderProps> = ({
  isRecording,
  onStopRecording,
  confirmIcon,
  className,
}) => {
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null
  );
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRecording) {
      startRecording();
    } else {
      stopRecording();
    }

    return () => clearInterval(timerRef.current!);
  }, [isRecording]);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const recorder = new MediaRecorder(stream);
    recorder.ondataavailable = async (event) => {
      // const base64Audio = await convertBlobToBase64(event.data);
      onStopRecording(event.data);
    };
    recorder.start();
    setMediaRecorder(recorder);
    setStartTime(Date.now());
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setElapsedTime(0);
      setStartTime(null);
      clearInterval(timerRef.current!);
    }
  };

  // const convertBlobToBase64 = (blob: Blob): Promise<string> => {
  //   return new Promise((resolve, reject) => {
  //     const reader = new FileReader();
  //     reader.onloadend = () => {
  //       const base64String = reader.result as string;
  //       resolve(base64String);
  //     };
  //     reader.onerror = reject;
  //     reader.readAsDataURL(blob);
  //   });
  // };

  useEffect(() => {
    if (isRecording && startTime) {
      timerRef.current = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
    } else {
      clearInterval(timerRef.current!);
    }

    return () => clearInterval(timerRef.current!);
  }, [isRecording, startTime]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  return (
    <div className={`flex items-center justify-between w-full ${className}`}>
      <div className="flex-grow flex bg-gray-100 rounded-md p-2 text-sm">
        <span className="flex-grow">Recording...</span>
        <span className="">{formatTime(elapsedTime)}</span>
      </div>
      <button onClick={stopRecording} className="ml-2 p-2">
        {confirmIcon || <TickIcon />}
      </button>
    </div>
  );
};

export default AudioRecorder;
