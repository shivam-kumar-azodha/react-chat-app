import React, { useState } from "react";
import clsx from "clsx";
import PlayIcon from "../icons/PlayIcon";
import PauseIcon from "../icons/PauseIcon";
import Waveform from "./Waveform";
import { AudioPlayerProps } from "./__types__/AudioPlayer.types";

const AudioPlayer: React.FC<AudioPlayerProps> = ({
  audioBlob,
  audioUrl,
  playButtonIcon,
  pauseButtonIcon,
  hideWaveForm,
  hideTimer,
  className,
  buttonClassName,
  waveformClassName,
  timerClassName,
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
    <div
      className={clsx(
        "flex h-full w-full flex-row items-center gap-2",
        className,
      )}
    >
      <button
        onClick={handlePlayPause}
        className={clsx("cursor-pointer", buttonClassName)}
      >
        {isPlaying
          ? pauseButtonIcon || <PauseIcon />
          : playButtonIcon || <PlayIcon />}
      </button>
      <div
        className={clsx(
          "h-full flex-grow rounded-md bg-slate-100 p-1",
          { hidden: hideWaveForm },
          waveformClassName,
        )}
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
        <div className={clsx("ml-2 text-sm", timerClassName)}>
          {formatTime(currentTime)} / {formatTime(duration)}
        </div>
      )}
    </div>
  );
};

export default AudioPlayer;
