import React, { useEffect, useRef } from "react";
import WaveSurfer from "wavesurfer.js";

interface WaveformProps {
  audioBlob?: string;
  audioUrl?: string;
  onReady: (duration: number) => void;
  onAudioProcess: (currentTime: number) => void;
  onFinish: () => void;
  isPlaying: boolean;
}

const Waveform: React.FC<WaveformProps> = ({
  audioBlob,
  audioUrl,
  onReady,
  onAudioProcess,
  onFinish,
  isPlaying,
}) => {
  const waveformRef = useRef<HTMLDivElement>(null);
  const wavesurfer = useRef<WaveSurfer | null>(null);

  useEffect(() => {
    if (waveformRef.current) {
      wavesurfer.current = WaveSurfer.create({
        container: waveformRef.current,
        waveColor: "#ddd",
        progressColor: "#424BF9",
        cursorColor: "#424BF9",
        barWidth: 2,
        barRadius: 3,
        barGap: 3,
        height: "auto",
      });

      wavesurfer.current.load(audioBlob || audioUrl || "");

      wavesurfer.current.on("ready", () => {
        onReady(wavesurfer.current?.getDuration() || 0);
      });

      wavesurfer.current.on("audioprocess", () => {
        onAudioProcess(wavesurfer.current?.getCurrentTime() || 0);
      });

      wavesurfer.current.on("finish", () => {
        onFinish();
      });

      return () => {
        wavesurfer.current?.destroy();
      };
    }
  }, [audioBlob]);

  useEffect(() => {
    if (wavesurfer.current) {
      if (isPlaying) {
        wavesurfer.current.play();
      } else {
        wavesurfer.current.pause();
      }
    }
  }, [isPlaying]);

  return <div ref={waveformRef} className="w-full h-full" />;
};

export default Waveform;
