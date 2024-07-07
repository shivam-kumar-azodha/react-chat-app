import { useState } from "react";
import ChatBox from "./Chat/ChatBox";
import GlobalChat from "./GlobalChat/GlobalChat";
import AudioRecorderExample from "./components/audio-recorder-example";
import EmojiPickerExample from "./components/emoji-picker-example";

const App: React.FC = () => {
  const [loggedInUser, setLoggedInUser] = useState("Alice");
  return (
    // DoropDOwn to select loggedin User
    <div className="grid grid-cols-2">
      <div className="border min-h-60 p-4">
        <EmojiPickerExample />
      </div>
      <div className="border min-h-60 p-4">
        <AudioRecorderExample />
      </div>
      {/* <div className="border min-h-60 p-4 row-span-2">
        <ChatBox loggedInUser="Alice" receiverId="Bob" />
      </div> */}
      <div className="h-96 col-span-2">
        <h1>{loggedInUser}</h1>
        <select onChange={(e) => setLoggedInUser(e.target.value)}>
          <option value="Alice">Alice</option>
          <option value="Bob">Bob</option>
          <option value="Charlie">Charlie</option>
        </select>
        <GlobalChat loggedInUser={loggedInUser} />
      </div>
    </div>
  );
};

export default App;
