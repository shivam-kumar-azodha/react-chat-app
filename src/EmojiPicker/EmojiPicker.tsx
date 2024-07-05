import React, { useCallback } from "react";
import EmojiPickerLib, {
  EmojiClickData,
  Theme as LibEmojiTheme,
} from "emoji-picker-react";
import {
  EmojiStyle,
  EmojiTheme,
  IEmojiPickerProps,
  SuggestionMode,
} from "./EmojiPicker.types";

const EmojiPicker: React.FC<IEmojiPickerProps> = ({
  open,
  emojiStyle = EmojiStyle.NATIVE,
  theme = EmojiTheme.LIGHT,
  autoFocusSearch = false,
  searchPlaceholder = "Search",
  suggestedEmojisMode = SuggestionMode.FREQUENT,
  skinTonesDisabled = true,
  searchDisabled = false,
  isForInputBox,
  isForReactions,
  ...restProps
}) => {
  const { inputRef, setInputValue } = isForInputBox || {};

  // DONT CHANGE ANYTHING IN THIS FUNCTION
  const insertEmojiToInput = useCallback(
    (emojiObject: EmojiClickData) => {
      if (inputRef?.current) {
        const { selectionStart, selectionEnd } = inputRef.current;

        // Use a functional update to ensure we're working with the most current state
        setInputValue &&
          setInputValue((currentInputStr: string) => {
            // Insert emoji into current input value at cursor position
            const newInputStr =
              currentInputStr.substring(0, selectionStart as number) +
              emojiObject.emoji +
              currentInputStr.substring(selectionEnd as number);

            // Update cursor position after inserting emoji
            const newCursorPosition =
              (selectionStart as number) + emojiObject.emoji.length;

            // After updating the value, it sets the cursor position immediately after the inserted emoji
            // using setTimeout to ensure the operation occurs after the state update and re-render.
            setTimeout(() => {
              if (inputRef.current) {
                inputRef.current.focus();
                inputRef.current.setSelectionRange(
                  newCursorPosition,
                  newCursorPosition
                );
              }
            }, 0);

            return newInputStr;
          });
      }
    },
    [inputRef, setInputValue]
  );

  return (
    <EmojiPickerLib
      open={open}
      emojiStyle={emojiStyle}
      theme={theme as unknown as LibEmojiTheme}
      suggestedEmojisMode={suggestedEmojisMode}
      autoFocusSearch={autoFocusSearch}
      searchPlaceholder={searchPlaceholder}
      skinTonesDisabled={skinTonesDisabled}
      searchDisabled={searchDisabled}
      onEmojiClick={
        isForInputBox ? insertEmojiToInput : isForReactions?.onEmojiClick
      }
      reactionsDefaultOpen={!!isForReactions}
      allowExpandReactions={isForReactions?.allowExpandReactions}
      lazyLoadEmojis
      {...restProps}
    />
  );
};

export default EmojiPicker;
