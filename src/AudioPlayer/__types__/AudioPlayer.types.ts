import React from "react";

export interface AudioPlayerProps {
  audioBlob?: string;
  audioUrl?: string;
  playButtonIcon?: React.ReactNode;
  pauseButtonIcon?: React.ReactNode;
  hideWaveForm?: boolean;
  hideTimer?: boolean;
  className?: string;
  buttonClassName?: string;
  waveformClassName?: string;
  timerClassName?: string;
}
