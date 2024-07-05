import React, { useState, useRef } from "react";
import EmojiPicker from "./EmojiPicker";

const App: React.FC = () => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [inputStr, setInputStr] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Function to handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputStr(e.target.value);
  };

  return (
    <>
      <input
        ref={inputRef}
        value={inputStr}
        onChange={handleInputChange}
        className="border border-gray-300 rounded-md p-2 w-1/3"
      />
      <button onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
        Hit Me!
      </button>
      <div className="z-10 absolute">
        <EmojiPicker
          open={showEmojiPicker}
          isForInputBox={{ inputRef, setInputValue: setInputStr }}
        />
      </div>
      <p>
        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Id eligendi
        eius quia molestias asperiores ipsa enim architecto atque ut, sequi
        ullam voluptatem excepturi facilis neque impedit aliquid nobis
        praesentium in.
      </p>
    </>
  );
};

export default App;
