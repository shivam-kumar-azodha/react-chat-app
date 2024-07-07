import React from "react";

type ChatBubbleProps = {
  message: string;
  isSent: boolean;
};

const containsOnlyEmojis = (message: string) =>
  message.match(/^(?:\p{Emoji_Presentation}|\p{Extended_Pictographic})+$/u);

const ChatBubble: React.FC<ChatBubbleProps> = ({ message, isSent }) => {
  const isOnlyEmoji = containsOnlyEmojis(message);
  return (
    <div className={`flex ${isSent ? "justify-end" : "justify-start"} mb-2`}>
      <div
        className={`max-w-xs md:max-w-md lg:max-w-lg rounded-lg text-white ${
          isOnlyEmoji
            ? "text-4xl" // Class to make emojis bigger
            : isSent
            ? "bg-blue-500 px-4 py-2"
            : "bg-gray-300 text-black px-4 py-2"
        }`}
      >
        {message}
      </div>
    </div>
  );
};

export default ChatBubble;
