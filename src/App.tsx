import Chat from "./Chat/Chat";
import AudioRecorderExample from "./components/audio-recorder-example";
import EmojiPickerExample from "./components/emoji-picker-example";

const App: React.FC = () => {
  return (
    <div className="grid grid-cols-3">
      <div className="border min-h-60 p-4">
        <EmojiPickerExample />
      </div>
      <div className="border min-h-60 p-4">
        <AudioRecorderExample />
      </div>
      <div className="border min-h-60 p-4 row-span-3">
        <Chat />
      </div>
    </div>
  );
};

export default App;
