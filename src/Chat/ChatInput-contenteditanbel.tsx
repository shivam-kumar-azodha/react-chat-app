import React, { useEffect, useRef } from "react";

interface ChatTextInputProps {
  value: string;
  onChange: (value: string) => void;
}

const ChatTextInput: React.FC<ChatTextInputProps> = ({ value, onChange }) => {
  const inputRef = useRef<HTMLDivElement>(null);

  const handleInput = () => {
    if (inputRef.current) {
      onChange(inputRef.current.innerHTML);
    }
  };

  useEffect(() => {
    const linkifyText = (text: string) => {
      const urlRegex =
        /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gi;
      return text.replace(
        urlRegex,
        (url) =>
          `<a href="${url}" target="_blank" style="color: blue;">${url}</a>`
      );
    };

    if (inputRef.current) {
      inputRef.current.innerHTML = linkifyText(value);
    }
  }, [value]);

  return (
    <div
      ref={inputRef}
      contentEditable
      onInput={handleInput}
      className="rounded-md w-full focus:outline-none p-2"
      style={{
        minHeight: "50px",
        border: "1px solid #ccc",
        whiteSpace: "pre-wrap",
        wordWrap: "break-word",
      }}
      // placeholder="Type a message"
    />
  );
};

export default ChatTextInput;
