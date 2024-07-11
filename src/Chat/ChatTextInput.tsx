import React from "react";
import TextareaAutosize from "react-textarea-autosize";

interface InputTextAreaProps {
  inputRef: React.RefObject<HTMLTextAreaElement>;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  minRows?: number;
  maxRows?: number;
}

const ChatTextInput: React.FC<InputTextAreaProps> = ({
  inputRef,
  value,
  onChange,
  onKeyDown,
  minRows = 1,
  maxRows = 5,
}) => {
  return (
    <TextareaAutosize
      ref={inputRef}
      value={value}
      onChange={onChange}
      onKeyDown={onKeyDown}
      autoComplete="off"
      minRows={minRows}
      maxRows={maxRows}
      className="flex-grow resize-none focus:outline-none"
      placeholder="Type a message"
    />
  );
};

export default ChatTextInput;
