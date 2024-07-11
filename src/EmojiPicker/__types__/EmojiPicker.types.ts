import { EmojiClickData } from "emoji-picker-react";
import React from "react";

export enum EmojiStyle {
  NATIVE = "native",
  APPLE = "apple",
  TWITTER = "twitter",
  FACEBOOK = "facebook",
  GOOGLE = "google",
}

export enum SuggestionMode {
  FREQUENT = "frequent",
  RECENT = "recent",
}

export enum EmojiTheme {
  LIGHT = "light",
  DARK = "dark",
  AUTO = "auto",
}

export interface IEmojiPickerBaseProps {
  open: boolean;
  height?: string | number;
  width?: string | number;
  emojiStyle?: EmojiStyle;
  theme?: EmojiTheme;
  autoFocusSearch?: boolean;
  searchPlaceholder?: string;
  suggestedEmojisMode?: SuggestionMode;
  skinTonesDisabled?: boolean;
  searchDisabled?: boolean;
}

export interface IEmojiPickerForInputProps extends IEmojiPickerBaseProps {
  isForInputBox: {
    inputRef: React.RefObject<HTMLTextAreaElement>;
    setInputValue: React.Dispatch<React.SetStateAction<string>>;
  };
  isForReactions?: never; // Ensures this property cannot be set when isForInputBox is present
}

export interface IEmojiPickerForReactionsProps extends IEmojiPickerBaseProps {
  isForReactions: {
    onEmojiClick: (emoji: EmojiClickData, event: MouseEvent) => void;
    allowExpandReactions?: boolean;
    reactions?: string[];
  };
  isForInputBox?: never; // Ensures this property cannot be set when isForReactions is present
}

// Union type of the above two interfaces
export type IEmojiPickerProps =
  | IEmojiPickerForInputProps
  | IEmojiPickerForReactionsProps;
