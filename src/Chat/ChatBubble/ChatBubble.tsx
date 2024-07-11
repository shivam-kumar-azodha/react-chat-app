import React from "react";

import PlayIconWhite from "../../icons/PlayIconWhite";
import PauseIconWhite from "../../icons/PauseIconWhite";
import PDFPreview from "../../FilesPreview/PDFPreview";
import LinksPreview from "../../LinksPreview/LinksPreview";
import AudioPlayer from "../../AudioPlayer/AudioPlayer";
import {
  ChatBubbleProps,
  containsOnlyEmojis,
  getFileTypeByExtension,
} from "./__types__/ChatBubble.types";
import { FileTypes, IAttachment } from "../../types";

const renderAttachments = (attachments: IAttachment[]) => {
  return attachments.map((attachment) => {
    switch (getFileTypeByExtension(attachment.name)) {
      case FileTypes.Audio:
        return (
          <div className="h-10 w-80" key={attachment.cloudId}>
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
            key={attachment.cloudId}
            src={attachment.cloudId as unknown as string}
            alt={attachment.name}
            className="h-30 rounded-md"
            draggable={false}
          />
        );
      case FileTypes.PDF:
        return <PDFPreview key={attachment.cloudId} file={attachment} />;
      default:
        return null;
    }
  });
};

const ChatBubble: React.FC<ChatBubbleProps> = ({
  message,
  attachments,
  isSent,
  linksInMessage,
}) => {
  let parsedMessage: string;
  try {
    parsedMessage = JSON.parse(message);
  } catch (error) {
    console.error("Failed to parse message:", error);
    parsedMessage = message;
  }

  const isOnlyEmoji =
    containsOnlyEmojis(parsedMessage) && attachments?.length === 0;

  return (
    // TODO: Handle overflow better
    <div
      className={`flex ${isSent ? "justify-end" : "justify-start"} mb-2 overflow-x-clip`}
    >
      <div
        className={`max-w-xs rounded-lg text-white md:max-w-md lg:max-w-lg ${
          isOnlyEmoji
            ? "text-4xl"
            : isSent
              ? "bg-blue-500 px-4 py-2 text-base"
              : "bg-gray-300 px-4 py-2 text-base text-black"
        }`}
      >
        <div className="mb-2">
          {attachments?.length === 1 && renderAttachments(attachments)}
        </div>
        <pre className="font-sans">{parsedMessage}</pre>
        {!!linksInMessage?.length && (
          <LinksPreview
            links={linksInMessage}
            linkPreviewVariant={linksInMessage.length > 1 ? "INLINE" : "FULL"}
          />
        )}
      </div>
    </div>
  );
};

export default ChatBubble;
