import React from "react";
import AudioPlayer from "../AudioPlayer/AudioPlayer";
import PlayIconWhite from "../icons/PlayIconWhite";
import PauseIconWhite from "../icons/PauseIconWhite";
import { FileTypeExtenions, FileTypes, IAttachment } from "../types";
import PDFPreview from "./PDFPreview";

type ChatBubbleProps = {
  message: string;
  attachments?: IAttachment[];
  isSent: boolean;
};

const containsOnlyEmojis = (message: string) =>
  message.match(/^(?:\p{Emoji_Presentation}|\p{Extended_Pictographic})+$/u);

const getFileTypeByExtension = (name: string) => {
  const extension = name.split(".").pop();
  if (!extension) return undefined;
  for (const [fileType, extensions] of Object.entries(FileTypeExtenions)) {
    if (extensions.includes(extension)) return fileType;
  }
};

const renderAttachments = (attachments: IAttachment[]) => {
  return attachments.map((attachment) => {
    switch (getFileTypeByExtension(attachment.name)) {
      case FileTypes.Audio:
        return (
          <div className="w-80 h-10">
            <AudioPlayer
              audioBlob={attachment.cloudId}
              playButtonIcon={<PlayIconWhite />}
              pauseButtonIcon={<PauseIconWhite />}
            />
          </div>
        );
      case FileTypes.Image:
        return (
          <img
            src={attachment.cloudId as unknown as string}
            alt={attachment.name}
            className="rounded-md h-30"
            draggable={false}
          />
        );
      case FileTypes.PDF:
        return <PDFPreview file={attachment} />;
      default:
        return null;
    }
  });
};

const ChatBubble: React.FC<ChatBubbleProps> = ({
  message,
  attachments,
  isSent,
}) => {
  const isOnlyEmoji = containsOnlyEmojis(message) && attachments?.length === 0;

  return (
    <div className={`flex ${isSent ? "justify-end" : "justify-start"} mb-2`}>
      <div
        className={`max-w-xs md:max-w-md lg:max-w-lg rounded-lg text-white ${
          isOnlyEmoji
            ? "text-4xl"
            : isSent
            ? "bg-blue-500 px-4 py-2"
            : "bg-gray-300 text-black px-4 py-2"
        }`}
      >
        <div className="mb-2">
          {attachments?.length === 1 && renderAttachments(attachments)}
        </div>
        {message}
      </div>
    </div>
  );
};

export default ChatBubble;
