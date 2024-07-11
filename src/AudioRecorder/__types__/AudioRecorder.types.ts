import React from "react";

export interface AudioRecorderProps {
  isRecording: boolean;
  onStopRecording: (data: Blob) => void;
  confirmIcon?: React.ReactNode;
  className?: string;
  timerClassName?: string;
  buttonClassName?: string;
}
