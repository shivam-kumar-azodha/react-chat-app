import React from "react";

type ChatBubbleProps = {
  message: string;
  isSent: boolean;
};

const ChatBubble: React.FC<ChatBubbleProps> = ({ message, isSent }) => {
  return (
    <div className={`flex ${isSent ? "justify-end" : "justify-start"} mb-4`}>
      <div
        className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-2 rounded-lg text-white ${
          isSent ? "bg-blue-500" : "bg-gray-300 text-black"
        }`}
      >
        {message}
      </div>
    </div>
  );
};

export default ChatBubble;
