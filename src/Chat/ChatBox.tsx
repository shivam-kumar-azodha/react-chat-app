import React, { useEffect, useRef, useState } from "react";
import EmojiPicker from "../EmojiPicker";
import { sendMessage, useSubscribeToMessages } from "../services/chatService";
import ChatBubble from "./ChatBubble";
import { IMessageData } from "../types";
import SmileyIcon from "../icons/SmileyIcon";
import SendMessageIcon from "../icons/SendMessageIcon";
import MicIcon from "../icons/MicIcon";

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
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null
  );
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<any>();

  useSubscribeToMessages(receiverId, setMessages);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      const messageData = {
        senderId: currentUser,
        receiverId,
        message,
        type: "text",
      };
      console.log("sending", messageData);
      sendMessage(messageData as IMessageData);
      setMessage("");
    }
  };

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const recorder = new MediaRecorder(stream);
    recorder.ondataavailable = (event) => {
      const audioBlob = event.data;
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        const messageData = {
          senderId: currentUser,
          receiverId,
          message: base64String,
          type: "audio",
        };
        sendMessage(messageData as IMessageData);
      };
      reader.readAsDataURL(audioBlob);
    };
    recorder.start();
    setMediaRecorder(recorder);
    setIsRecording(true);
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setIsRecording(false);
    }
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

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
            type={messageData.type === "audio" ? "audio" : "text"}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSendMessage} className="flex relative gap-3">
        <div className="flex flex-row border border-gray-300 w-full pr-1 rounded-md">
          <input
            ref={inputRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            autoComplete="off"
            className="rounded-md flex-grow mr-2 p-2"
          />
          <button
            type="button"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="mr-4 cursor-pointer"
          >
            <SmileyIcon />
          </button>
          {message ? (
            <button type="submit" className="cursor-pointer">
              <SendMessageIcon />
            </button>
          ) : (
            <button
              type="button"
              onClick={isRecording ? stopRecording : startRecording}
              className="cursor-pointer"
            >
              {isRecording ? "stop" : <MicIcon />}
            </button>
          )}
        </div>
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
      </form>
    </div>
  );
};

export default ChatBox;
