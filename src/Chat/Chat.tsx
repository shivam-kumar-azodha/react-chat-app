import { useRef, useState } from "react";
import EmojiPicker from "../EmojiPicker";
import {
  IMessageData,
  sendMessage,
  useSubscribeToMessages,
} from "../services/chatService";

function Chat() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<IMessageData[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const senderId = "user1";
  const receiverId = "user2";

  useSubscribeToMessages(setMessages);

  const handleSendMessage = (e: any) => {
    e.preventDefault();
    const messageData = {
      senderId,
      receiverId,
      message,
    };
    sendMessage(messageData);
    setMessage("");
  };

  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  return (
    <div>
      <h1 className="font-medium text-lg">Chat</h1>
      <div id="messages">
        {messages.map((messageData: IMessageData, index: number) => (
          <div key={index}>{messageData.message}</div>
        ))}
      </div>
      <form onSubmit={handleSendMessage}>
        <input
          ref={inputRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          autoComplete="off"
          className="border border-gray-300 rounded-md w-80 p-2 mr-2"
        />
        <button
          type="button"
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
        >
          Click me
        </button>
        <div className="z-10 absolute h-96 w-96">
          <EmojiPicker
            open={showEmojiPicker}
            isForInputBox={{ inputRef, setInputValue: setMessage }}
          />
        </div>
        <button type="submit">Send</button>
      </form>
    </div>
  );
}

export default Chat;
