import ChatBox from "./Chat/ChatBox";
import GlobalChat from "./GlobalChat/GlobalChat";
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
      <div className="border min-h-60 p-4 row-span-2">
        <ChatBox loggedInUser="Alice" receiverId="Bob" />
      </div>
      <div className="h-96 col-span-2">
        <GlobalChat loggedInUser="Alice" />
      </div>
    </div>
  );
};

export default App;
