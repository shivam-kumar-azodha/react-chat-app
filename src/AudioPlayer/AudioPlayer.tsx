import React from "react";

interface AudioPlayerProps {
  audioBlob: string;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ audioBlob }) => {
  return (
    <audio controls>
      <source src={audioBlob} type="audio/webm" />
      Your browser does not support the audio element.
    </audio>
  );
};

export default AudioPlayer;
