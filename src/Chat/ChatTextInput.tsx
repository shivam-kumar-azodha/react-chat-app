import clsx from "clsx";
import React, { useCallback } from "react";
import TextareaAutosize from "react-textarea-autosize";

interface InputTextAreaProps {
  inputRef: React.RefObject<HTMLTextAreaElement>;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  minRows?: number;
  maxRows?: number;
  className?: string;
  placeholder?: string;
}

const ChatTextInput: React.FC<InputTextAreaProps> = ({
  inputRef,
  value,
  onChange,
  onKeyDown,
  minRows = 1,
  maxRows = 5,
  className,
  placeholder = "Type a message",
}) => {
  const handleChange = useCallback(onChange, [onChange]);
  const handleKeyDown = useCallback(onKeyDown, [onKeyDown]);

  return (
    <TextareaAutosize
      ref={inputRef}
      value={value}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      autoComplete="off"
      minRows={minRows}
      maxRows={maxRows}
      className={clsx("flex-grow resize-none focus:outline-none", className)}
      placeholder={placeholder}
    />
  );
};

export default ChatTextInput;
