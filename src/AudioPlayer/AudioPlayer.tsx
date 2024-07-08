import React, { useState } from "react";
import PlayIcon from "../icons/PlayIcon";
import Waveform from "./WaveForm";
import PauseIcon from "../icons/PauseIcon";

interface AudioPlayerProps {
  audioBlob: string;
  playButtonIcon?: React.ReactNode;
  pauseButtonIcon?: React.ReactNode;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({
  audioBlob,
  playButtonIcon,
  pauseButtonIcon,
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
    <div className="flex flex-row w-full items-center gap-2">
      <button onClick={handlePlayPause} className="cursor-pointer">
        {isPlaying
          ? pauseButtonIcon || <PauseIcon />
          : playButtonIcon || <PlayIcon />}
      </button>
      <div className="flex-grow bg-slate-100 rounded-md p-1">
        <Waveform
          audioBlob={audioBlob}
          isPlaying={isPlaying}
          onReady={setDuration}
          onAudioProcess={setCurrentTime}
          onFinish={() => setIsPlaying(false)}
        />
      </div>
      <div className="text-sm ml-2">
        {formatTime(currentTime)} / {formatTime(duration)}
      </div>
    </div>
  );
};

export default AudioPlayer;
