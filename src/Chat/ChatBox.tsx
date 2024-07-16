import React, { useEffect, useRef, useState } from "react";
import EmojiPicker from "../EmojiPicker";
import { sendMessage, useSubscribeToMessages } from "../services/chatService";
import ChatBubble from "./ChatBubble/ChatBubble";
import { IAttachment, IFile, IMessageData } from "../types";
import SmileyIcon from "../icons/SmileyIcon";
import SendMessageIcon from "../icons/SendMessageIcon";
import MicIcon from "../icons/MicIcon";
import AudioRecorder from "../AudioRecorder/AudioRecorder";
import CancelIcon from "../icons/CancelIcon";
import AttachementIcon from "../icons/AttachementIcon";
import FilesPreview from "../FilesPreview/FilesPreview";
import { v4 as uuid } from "uuid";
import { convertBlobToBase64, getLinksIntoArray } from "../helpers";
import ChatTextInput from "./ChatTextInput";
import LinksPreview from "../LinksPreview/LinksPreview";

interface ChatBoxProps {
  loggedInUser: string;
  receiverId: string;
}

const ChatBox: React.FC<ChatBoxProps> = ({
  loggedInUser: currentUser,
  receiverId,
}) => {
  const [message, setMessage] = useState("");
  const [linksWithinInput, setLinksWithinInput] = useState<string[]>([]);
  const [messages, setMessages] = useState<IMessageData[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<any[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<any>();

  useEffect(() => {
    const debounceDelay = 500;
    const timer = setTimeout(() => {
      const links = getLinksIntoArray(message);
      setLinksWithinInput(links);
    }, debounceDelay);

    return () => clearTimeout(timer);
  }, [message]);

  useSubscribeToMessages(receiverId, setMessages);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    const messageId = uuid();

    const attachments: IAttachment[] = await Promise.all(
      selectedFiles.map(async (file: IFile) => {
        return {
          cloudId: await convertBlobToBase64(file.file as Blob),
          name: file.name,
        };
      }),
    );

    if (message.trim() || attachments.length) {
      const messageData = {
        id: messageId,
        senderId: currentUser,
        receiverId,
        content: JSON.stringify(message),
        attachments,
        createdAt: new Date().toISOString(),
      };
      sendMessage(messageData);
      setMessage("");
      setSelectedFiles([]);
      setShowEmojiPicker(false);
    }
  };

  const handleAudioRecording = (recordedFile: Blob) => {
    setIsRecording(false);
    setSelectedFiles((prevFiles) => [
      {
        name: "Unnamed_Recording.webm", // as recorded audio is always webm
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
      <div className="flex h-full w-full items-center justify-center">
        Select a chat
      </div>
    );

  const filteredMessages = messages.filter((msg) => {
    return (
      (msg.senderId === currentUser && msg.receiverId === receiverId) ||
      (msg.senderId === receiverId && msg.receiverId === currentUser)
    );
  });

  // UNCOMMENT TO ALLOW SAME FILE UPLOAD
  // const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   const files = Array.from(event.target.files || []);
  //   const newFilePreviews = files.map((file) => {
  //     const url = URL.createObjectURL(file as Blob);
  //     return { name: file.name, type: file.type, url, size: file.size, file };
  //   });
  //   setSelectedFiles((prevPreviews) => [...prevPreviews, ...newFilePreviews]);
  // };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);

    // Filter out duplicates by checking unique properties
    const uniqueFiles = files.filter((file) => {
      return !selectedFiles.some(
        (existingFile) =>
          file.name === existingFile.name && file.size === existingFile.size,
      );
    });

    const newFilePreviews = uniqueFiles.map((file) => {
      const url = URL.createObjectURL(file as Blob);
      return { name: file.name, type: file.type, url, size: file.size, file };
    });

    setSelectedFiles((prevPreviews) => [...prevPreviews, ...newFilePreviews]);

    // Alert user about duplicates
    const duplicateFiles = files.filter((file) => !uniqueFiles.includes(file));
    if (duplicateFiles.length > 0) {
      alert(
        `Duplicate files (${duplicateFiles
          .map((file) => file.name)
          .join(", ")}) were not added.`,
      );
    }

    // Clear input field to allow re-uploading same files
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragging(false);
    const files = Array.from(event.dataTransfer.files);
    const newFilePreviews = files.map((file) => {
      const url = URL.createObjectURL(file as Blob);
      return { name: file.name, type: file.type, url, size: file.size, file };
    });
    setSelectedFiles((prevPreviews) => [...prevPreviews, ...newFilePreviews]);
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const showAttachmentButton = !(
    isRecording || selectedFiles.some((file) => file.isRecording)
  );

  const handleInputBoxKeyDown = (
    e: React.KeyboardEvent<HTMLTextAreaElement>,
  ) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  return (
    <div
      className="relative flex h-full w-full flex-col p-4"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      {isDragging && (
        <div className="absolute inset-0 z-10 flex items-center justify-center border-4 border-dashed border-gray-300 bg-white bg-opacity-80">
          <span className="text-lg text-gray-500">Drop files here</span>
        </div>
      )}
      <h1 className="mb-4 text-lg font-bold">Chat with {receiverId}</h1>
      <div className="mb-4 flex-grow overflow-y-scroll border p-4">
        {filteredMessages.map((messageData: IMessageData) => (
          <ChatBubble
            key={messageData.id}
            message={messageData.content}
            attachments={messageData?.attachments}
            isSent={messageData.senderId === currentUser}
            createdAt={messageData.createdAt || ""}
            linksInMessage={getLinksIntoArray(messageData.content)}
            senderId={messageData.senderId}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="flex flex-col gap-2 border px-3 py-2">
        {!!selectedFiles?.length && (
          <FilesPreview files={selectedFiles} setFiles={setSelectedFiles} />
        )}

        <form onSubmit={handleSendMessage} className="relative flex gap-3">
          <div className="flex w-full flex-row items-end rounded-md pr-1">
            {showAttachmentButton && (
              <button
                type="button"
                className="relative mr-2 cursor-pointer"
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

            <ChatTextInput
              inputRef={inputRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleInputBoxKeyDown}
              maxRows={3}
            />

            <button
              type="button"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="mr-4 cursor-pointer"
            >
              <SmileyIcon />
            </button>
            {isRecording && (
              <div className="absolute bottom-10 right-0 w-80">
                <AudioRecorder
                  isRecording={isRecording}
                  onStopRecording={handleAudioRecording}
                  className="rounded-lg border-2 border-[#424BF9] bg-white p-2"
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
            className={`absolute bottom-full right-10 z-10 mb-2 h-96 w-80 ${
              showEmojiPicker ? "block" : "hidden"
            }`}
          >
            <EmojiPicker
              open={showEmojiPicker}
              isForInputBox={{ inputRef, setInputValue: setMessage }}
            />
          </div>
        </form>

        {!!linksWithinInput.length && <LinksPreview links={linksWithinInput} />}
      </div>
    </div>
  );
};

export default ChatBox;
