import React, { useEffect, useRef, useState } from "react";
import EmojiPicker from "../EmojiPicker";
import { sendMessage, useSubscribeToMessages } from "../services/chatService";
import ChatBubble from "./ChatBubble";
import { IMessageData } from "../types";
import SmileyIcon from "../icons/SmileyIcon";
import SendMessageIcon from "../icons/SendMessageIcon";
import MicIcon from "../icons/MicIcon";
import AudioRecorder from "../AudioRecorder/AudioRecorder";
import CancelIcon from "../icons/CancelIcon";
import AttachementIcon from "../icons/AttachementIcon";
import FilesPreview from "./SelectedFiles/FilesPreview";

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
  const [selectedFiles, setSelectedFiles] = useState<any[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<any>();

  useSubscribeToMessages(receiverId, setMessages);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      const messageData: IMessageData = {
        senderId: currentUser,
        receiverId,
        message: message,
        type: "text",
      };
      sendMessage(messageData);
      setMessage("");
      setShowEmojiPicker(false);
    }
  };

  const handleAudioRecording = (recordedFile: Blob) => {
    setIsRecording(false);
    setSelectedFiles((prevFiles) => [
      {
        name: "Unnamed Recording",
        type: recordedFile.type,
        url: URL.createObjectURL(recordedFile),
        size: recordedFile.size,
        file: recordedFile,
        isRecording: true,
      },
      ...prevFiles,
    ]);
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

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const newFilePreviews = files.map((file) => {
      const url = URL.createObjectURL(file as Blob);
      return { name: file.name, type: file.type, url, size: file.size, file };
    });
    setSelectedFiles((prevPreviews) => [...prevPreviews, ...newFilePreviews]);
  };

  const showAttachmentButton = !(
    isRecording || selectedFiles.some((file) => file.isRecording)
  );

  return (
    <div className="h-full p-4 flex flex-col w-full relative">
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
      <div className="border flex flex-col px-3 py-2 gap-2">
        {!!selectedFiles?.length && (
          <FilesPreview files={selectedFiles} setFiles={setSelectedFiles} />
        )}

        <form onSubmit={handleSendMessage} className="flex relative gap-3">
          <div className="flex flex-row w-full pr-1 rounded-md">
            {showAttachmentButton && (
              <button
                type="button"
                className="cursor-pointer relative mr-2"
                onClick={() => {
                  fileInputRef.current?.click();
                }}
              >
                <input
                  id="file-input"
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*,audio/*,video/*,.pdf"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <AttachementIcon />
              </button>
            )}

            <input
              ref={inputRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              autoComplete="off"
              className="rounded-md flex-grow mr-2 p-2 focus:outline-none"
              placeholder="Type a message"
            />
            <button
              type="button"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="mr-4 cursor-pointer"
            >
              <SmileyIcon />
            </button>
            {isRecording && (
              <div className="w-80 absolute bottom-10 right-0">
                <AudioRecorder
                  isRecording={isRecording}
                  onStopRecording={handleAudioRecording}
                  className="rounded-lg border-2 p-2 bg-white border-[#424BF9]"
                />
              </div>
            )}
            {message || !!selectedFiles?.length ? (
              <button type="submit" className="cursor-pointer">
                <SendMessageIcon />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setIsRecording(!isRecording)}
                className="cursor-pointer"
              >
                {isRecording ? <CancelIcon /> : <MicIcon />}
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
    </div>
  );
};

export default ChatBox;
