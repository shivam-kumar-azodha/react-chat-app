import React, { useRef, useState } from "react";
import EmojiPicker from "../EmojiPicker";
import {
  IMessageData,
  sendMessage,
  useSubscribeToMessages,
} from "../services/chatService";
import ChatBubble from "./ChatBubble";

interface ChatBoxProps {
  loggedInUser: string;
  receiverId: string;
}

const ChatBox: React.FC<ChatBoxProps> = ({
  loggedInUser: currentUser,
  receiverId,
}) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<IMessageData[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useSubscribeToMessages(receiverId, setMessages);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      const messageData = {
        senderId: currentUser,
        receiverId,
        message,
      };
      sendMessage(messageData);
      setMessage("");
    }
  };

  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  if (!receiverId)
    return (
      <div className="flex w-full h-full justify-center items-center">
        Select a chat
      </div>
    );

  const filteredMessages = messages.filter((msg) => {
    return (
      (msg.senderId === currentUser && msg.receiverId === receiverId) ||
      (msg.senderId === receiverId && msg.receiverId === currentUser)
    );
  });

  return (
    <div className="h-full p-4 flex flex-col w-full">
      <h1 className="text-lg font-bold mb-4">Chat with {receiverId}</h1>
      <div className="flex-grow overflow-y-scroll border p-4 mb-4">
        {filteredMessages.map((messageData: IMessageData) => (
          <ChatBubble
            key={messageData.id}
            message={messageData.message}
            isSent={messageData.senderId === currentUser}
          />
        ))}
      </div>
      <form onSubmit={handleSendMessage} className="flex relative">
        <input
          ref={inputRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          autoComplete="off"
          className="border border-gray-300 rounded-md p-2 flex-grow mr-2"
        />
        <button
          type="button"
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          className="mr-2"
        >
          😀
        </button>
        <div
          className={`z-10 absolute h-96 w-80 bottom-full mb-2 right-10 ${
            showEmojiPicker ? "block" : "hidden"
          }`}
        >
          <EmojiPicker
            open={showEmojiPicker}
            isForInputBox={{ inputRef, setInputValue: setMessage }}
          />
        </div>
        <button type="submit" className="bg-blue-500 text-white p-2 rounded-md">
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatBox;
