import React from "react";

type ChatBubbleProps = {
  message: string | ArrayBuffer | null;
  isSent: boolean;
  type: string;
};

const containsOnlyEmojis = (message: string) =>
  message.match(/^(?:\p{Emoji_Presentation}|\p{Extended_Pictographic})+$/u);

const ChatBubble: React.FC<ChatBubbleProps> = ({ message, isSent, type }) => {
  const isOnlyEmoji =
    typeof message === "string" ? containsOnlyEmojis(message) : false;
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
        {type === "audio" ? (
          <audio controls src={message as string} />
        ) : (
          (message as string)
        )}
      </div>
    </div>
  );
};

export default ChatBubble;
