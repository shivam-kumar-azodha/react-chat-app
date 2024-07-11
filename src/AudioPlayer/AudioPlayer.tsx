import React, { useState } from "react";
import PlayIcon from "../icons/PlayIcon";

import PauseIcon from "../icons/PauseIcon";
import Waveform from "./Waveform";

interface AudioPlayerProps {
  audioBlob?: string;
  audioUrl?: string;
  playButtonIcon?: React.ReactNode;
  pauseButtonIcon?: React.ReactNode;
  hideWaveForm?: boolean;
  hideTimer?: boolean;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({
  audioBlob,
  audioUrl,
  playButtonIcon,
  pauseButtonIcon,
  hideWaveForm,
  hideTimer,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  return (
    <div className="flex h-full w-full flex-row items-center gap-2">
      <button onClick={handlePlayPause} className="cursor-pointer">
        {isPlaying
          ? pauseButtonIcon || <PauseIcon />
          : playButtonIcon || <PlayIcon />}
      </button>
      <div
        className={`h-full flex-grow rounded-md bg-slate-100 p-1 ${
          hideWaveForm ? "hidden" : ""
        }`}
      >
        <Waveform
          audioBlob={audioBlob || ""}
          audioUrl={audioUrl || ""}
          isPlaying={isPlaying}
          onReady={setDuration}
          onAudioProcess={setCurrentTime}
          onFinish={() => setIsPlaying(false)}
        />
      </div>
      {!hideTimer && (
        <div className="ml-2 text-sm">
          {formatTime(currentTime)} / {formatTime(duration)}
        </div>
      )}
    </div>
  );
};

export default AudioPlayer;
