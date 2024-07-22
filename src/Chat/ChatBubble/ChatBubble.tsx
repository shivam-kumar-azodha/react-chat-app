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
import { convertToUserMMHH, parseMessageWithLinks } from "../../helpers";
import FilesPreview from "../../FilesPreview/FilesPreview";
import { FilePreviewData } from "../../FilesPreview/__types__/FilesPreview.types";
import SentChatArrowIcon from "../../icons/SentChatArrowIcon";
import RecievedChatArrowIcon from "../../icons/RecievedChatArrowIcon";

const renderAttachments = (attachments: IAttachment[]) => {
  if (!attachments.length) return null;

  if (attachments.length === 1) {
    const attachment = attachments[0];
    const fileType = getFileTypeByExtension(attachment.name);
    switch (fileType) {
      case FileTypes.Audio:
        return (
          <div className="h-10 w-80">
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
            src={attachment.cloudId}
            alt={attachment.name}
            className="h-30 rounded-md"
            draggable={false}
          />
        );
      case FileTypes.PDF:
        return <PDFPreview file={attachment} />;
      default:
        return null;
    }
  } else {
    return (
      <FilesPreview
        files={attachments as FilePreviewData[]}
        className="flex-wrap gap-2"
      />
    );
  }
};

const ChatBubble: React.FC<ChatBubbleProps> = ({
  message,
  attachments,
  isSent,
  linksInMessage,
  createdAt,
  senderId,
}) => {
  let parsedMessage: string;
  try {
    parsedMessage = JSON.parse(message);
  } catch (error) {
    console.error("Failed to parse message:", error);
    parsedMessage = message;
  }

  const parsedMessageWithLinks = parseMessageWithLinks(parsedMessage);
  const isOnlyEmoji =
    containsOnlyEmojis(parsedMessage) && attachments?.length === 0;

  const commonMessageContent = (
    <>
      {!!attachments?.length && (
        <div className="mb-2">{renderAttachments(attachments)}</div>
      )}
      <pre
        className="whitespace-pre-wrap break-words font-sans"
        dangerouslySetInnerHTML={{ __html: parsedMessageWithLinks }}
      />
      {!!linksInMessage?.length && (
        <LinksPreview
          links={linksInMessage}
          linkPreviewVariant={linksInMessage.length > 1 ? "INLINE" : "FULL"}
        />
      )}
    </>
  );

  const sentMessageStyle = `max-w-xs rounded-b-lg rounded-tl-lg bg-[#3537E8] px-4 py-2 text-white md:max-w-md lg:max-w-lg ${
    isOnlyEmoji ? "text-4xl" : "text-base"
  }`;

  const receivedMessageStyle = `flex max-w-xs flex-col justify-start rounded-b-lg rounded-tr-lg bg-[#EFEFEF99] px-4 py-2 text-black md:max-w-md lg:max-w-lg ${
    isOnlyEmoji ? "text-4xl" : "text-base"
  }`;

  return isSent ? (
    <div className="mb-2 flex justify-end">
      <div className={sentMessageStyle}>
        {commonMessageContent}
        <p className="text-right text-xs text-white">
          {convertToUserMMHH(createdAt)}
        </p>
      </div>
      <div className="-ml-1">
        <SentChatArrowIcon />
      </div>
    </div>
  ) : (
    <div className="mb-2 flex">
      <div>
        <RecievedChatArrowIcon />
      </div>
      <div className={receivedMessageStyle}>
        <div className="text-xs text-[#0F3070]">{senderId}</div>
        {commonMessageContent}
        <p className="mt-1 text-right text-xs text-gray-700">
          {convertToUserMMHH(createdAt)}
        </p>
      </div>
    </div>
  );
};

export default ChatBubble;
