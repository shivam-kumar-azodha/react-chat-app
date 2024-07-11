export interface WaveformProps {
  audioBlob?: string;
  audioUrl?: string;
  onReady: (duration: number) => void;
  onAudioProcess: (currentTime: number) => void;
  onFinish: () => void;
  isPlaying: boolean;
  className?: string;
}
