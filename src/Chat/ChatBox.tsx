import React, { useEffect, useRef, useState } from "react";
import EmojiPicker from "../EmojiPicker";
import { sendMessage, useSubscribeToMessages } from "../services/chatService";
import ChatBubble from "./ChatBubble";
import { IMessageData } from "../types";
import SmileyIcon from "../icons/SmileyIcon";
import SendMessageIcon from "../icons/SendMessageIcon";
import MicIcon from "../icons/MicIcon";
import AudioPlayer from "../AudioPlayer/AudioPlayer";
import CrossWithBlueCircleIcon from "../icons/CrossWithBlueCircleIcon";
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
  const [audioBlob, setAudioBlob] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<any>();

  useSubscribeToMessages(receiverId, setMessages);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() || audioBlob) {
      const messageData: IMessageData = {
        senderId: currentUser,
        receiverId,
        message: audioBlob || message,
        type: audioBlob ? "audio" : "text",
      };
      sendMessage(messageData);
      setMessage("");
      setAudioBlob(null);
      setShowEmojiPicker(false);
    }
  };

  const handleStopRecording = (base64Audio: string | null) => {
    setIsRecording(false);
    setAudioBlob(base64Audio);
  };

  const handleAudioRecordingUrl = (recordedFile: Blob) => {
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
      <div className="border flex flex-col p-3 gap-2">
        {!!selectedFiles?.length && (
          <FilesPreview files={selectedFiles} setFiles={setSelectedFiles} />
        )}

        {audioBlob && (
          <div className="rounded-md relative w-80 border p-2">
            <div
              className="top-0 right-0 absolute z-10 cursor-pointer -mr-2 -mt-2"
              onClick={() => {
                setAudioBlob(null);
              }}
            >
              <CrossWithBlueCircleIcon />
            </div>
            <AudioPlayer audioBlob={audioBlob} />
          </div>
        )}
        <form onSubmit={handleSendMessage} className="flex relative gap-3">
          <div className="flex flex-row w-full pr-1 rounded-md">
            {
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
            }
            <input
              ref={inputRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              autoComplete="off"
              className="rounded-md flex-grow mr-2 p-2"
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
                  onStopRecording={handleStopRecording}
                  onStopRecordingUrl={handleAudioRecordingUrl}
                  className="rounded-lg border-2 p-2 bg-white border-[#424BF9]"
                />
              </div>
            )}
            {message || audioBlob ? (
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
