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
    null,
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
    <div className={`flex w-full items-center justify-between ${className}`}>
      <div className="flex flex-grow rounded-md bg-gray-100 p-2 text-sm">
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
