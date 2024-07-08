const AudioPlayer = ({ audioBlob }: { audioBlob: any }) => {
  return (
    <div className="flex items-center justify-between border">
      <audio controls src={URL.createObjectURL(audioBlob)}></audio>
    </div>
  );
};

export default AudioPlayer;
