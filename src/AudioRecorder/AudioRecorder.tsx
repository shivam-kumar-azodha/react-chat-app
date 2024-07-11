import React, { useEffect, useState, useRef } from "react";
import clsx from "clsx";
import TickIcon from "../icons/TickIcon";
import { AudioRecorderProps } from "./__types__/AudioRecorder.types";

const AudioRecorder: React.FC<AudioRecorderProps> = ({
  isRecording,
  onStopRecording,
  confirmIcon,
  className,
  timerClassName,
  buttonClassName,
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
    recorder.ondataavailable = (event) => {
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
    <div
      className={clsx("flex w-full items-center justify-between", className)}
    >
      <div
        className={clsx(
          "flex flex-grow rounded-md bg-gray-100 p-2 text-sm",
          // @TODO: move timer classname to appropriate place once live waveform is enabled
          timerClassName,
        )}
      >
        <span className="flex-grow">Recording...</span>
        <span>{formatTime(elapsedTime)}</span>
      </div>
      <button
        onClick={stopRecording}
        className={clsx("ml-2 p-2", buttonClassName)}
      >
        {confirmIcon || <TickIcon />}
      </button>
    </div>
  );
};

export default AudioRecorder;
