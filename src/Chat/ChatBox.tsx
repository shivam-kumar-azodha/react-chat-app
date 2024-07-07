import React, { useEffect, useRef, useState } from "react";
import EmojiPicker from "../EmojiPicker";
import { sendMessage, useSubscribeToMessages } from "../services/chatService";
import ChatBubble from "./ChatBubble";
import { IMessageData } from "../types";

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
            className="mr-4"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9 18C4.0293 18 0 13.9707 0 9C0 4.0293 4.0293 0 9 0C13.9707 0 18 4.0293 18 9C18 13.9707 13.9707 18 9 18ZM5.4 9.9C5.4 10.8548 5.77928 11.7705 6.45442 12.4456C7.12955 13.1207 8.04522 13.5 9 13.5C9.95478 13.5 10.8705 13.1207 11.5456 12.4456C12.2207 11.7705 12.6 10.8548 12.6 9.9H5.4ZM5.4 8.1C5.75804 8.1 6.10142 7.95777 6.35459 7.70459C6.60777 7.45142 6.75 7.10804 6.75 6.75C6.75 6.39196 6.60777 6.04858 6.35459 5.79541C6.10142 5.54223 5.75804 5.4 5.4 5.4C5.04196 5.4 4.69858 5.54223 4.44541 5.79541C4.19223 6.04858 4.05 6.39196 4.05 6.75C4.05 7.10804 4.19223 7.45142 4.44541 7.70459C4.69858 7.95777 5.04196 8.1 5.4 8.1ZM12.6 8.1C12.958 8.1 13.3014 7.95777 13.5546 7.70459C13.8078 7.45142 13.95 7.10804 13.95 6.75C13.95 6.39196 13.8078 6.04858 13.5546 5.79541C13.3014 5.54223 12.958 5.4 12.6 5.4C12.242 5.4 11.8986 5.54223 11.6454 5.79541C11.3922 6.04858 11.25 6.39196 11.25 6.75C11.25 7.10804 11.3922 7.45142 11.6454 7.70459C11.8986 7.95777 12.242 8.1 12.6 8.1Z"
                fill="#AFAFAF"
              />
            </svg>
          </button>
          {message ? (
            <button type="submit">
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M0.917969 18.1282L19.8338 10.0207L0.917969 1.91406L0.927135 8.5074L12.2796 10.0207L0.927135 11.5349L0.917969 18.1282Z"
                  fill="#424BF9"
                />
              </svg>
            </button>
          ) : (
            <button
              type="button"
              onClick={isRecording ? stopRecording : startRecording}
            >
              {isRecording ? (
                /* Stop Recording SVG */
                "stop"
              ) : (
                /* Start Recording SVG */
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M7 4C7 2.34315 8.34315 1 10 1C11.6569 1 13 2.34315 13 4V8C13 9.65685 11.6569 11 10 11C8.34315 11 7 9.65685 7 8V4Z"
                    fill="#424BF9"
                  />
                  <path
                    d="M11 14.9291C14.3923 14.4439 17 11.5265 17 8C17 7.44772 16.5523 7 16 7C15.4477 7 15 7.44772 15 8C15 10.7614 12.7614 13 10 13C7.23858 13 5 10.7614 5 8C5 7.44772 4.55228 7 4 7C3.44772 7 3 7.44772 3 8C3 11.5265 5.60771 14.4439 9 14.9291V17H6C5.44772 17 5 17.4477 5 18C5 18.5523 5.44772 19 6 19H14C14.5523 19 15 18.5523 15 18C15 17.4477 14.5523 17 14 17H11V14.9291Z"
                    fill="#424BF9"
                  />
                </svg>
              )}
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
