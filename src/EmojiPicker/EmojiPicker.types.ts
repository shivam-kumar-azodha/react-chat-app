import { EmojiClickData } from "emoji-picker-react";

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

export interface IEmojiPickerProps {
  open: boolean;
  emojiStyle?: EmojiStyle;
  theme?: EmojiTheme;
  autoFocusSearch?: boolean;
  searchPlaceholder?: string;
  suggestedEmojisMode?: SuggestionMode;
  skinTonesDisabled?: boolean;
  searchDisabled?: boolean;
  onEmojiClick?: (emoji: EmojiClickData, event: MouseEvent) => void;
  inputRef?: React.RefObject<HTMLInputElement>;
  setInputValue?: React.Dispatch<React.SetStateAction<string>>;
  isForInputBox?: {
    inputRef: React.RefObject<HTMLInputElement>;
    setInputValue: React.Dispatch<React.SetStateAction<string>>;
  };
  isForReactions?: {
    onEmojiClick: (emoji: EmojiClickData, event: MouseEvent) => void;
    allowExpandReactions?: boolean;
  };
}
