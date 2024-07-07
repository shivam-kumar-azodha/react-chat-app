import React, { useRef, useState } from "react";
import EmojiPicker from "../EmojiPicker";

const EmojiPickerExample = () => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Function to handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  return (
    <div className="relative">
      <input
        ref={inputRef}
        value={inputValue}
        onChange={handleInputChange}
        className="border border-gray-300 rounded-md w-80 p-2 mr-2"
      />
      {showEmojiPicker && (
        <div className="z-10 absolute h-96 w-96">
          <EmojiPicker
            open={showEmojiPicker}
            isForInputBox={{ inputRef, setInputValue }}
          />
        </div>
      )}
      <button onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
        Click me
      </button>
    </div>
  );
};

export default EmojiPickerExample;
