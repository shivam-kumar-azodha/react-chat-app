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

const renderAttachments = (attachments: IAttachment[]) => {
  if (!attachments.length) return null;
  if (attachments.length === 1) {
    const attachment = attachments[0];
    switch (getFileTypeByExtension(attachment.name)) {
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
            src={attachment.cloudId as unknown as string}
            alt={attachment.name}
            className="h-30 rounded-md"
            draggable={false}
          />
        );
      case FileTypes.PDF:
        return <PDFPreview file={attachment} />;
      default:
        return;
    }
  } else {
    // return attachments.map((attachment) => {
    //   switch (getFileTypeByExtension(attachment.name)) {
    //     case FileTypes.Audio:
    //       return (
    //         <div className="h-10 w-80" key={attachment.cloudId}>
    //           <AudioPlayer
    //             audioBlob={attachment.cloudId}
    //             playButtonIcon={<PlayIconWhite />}
    //             pauseButtonIcon={<PauseIconWhite />}
    //           />
    //         </div>
    //       );
    //     case FileTypes.Image:
    //       return (
    //         <img
    //           key={attachment.cloudId}
    //           src={attachment.cloudId as unknown as string}
    //           alt={attachment.name}
    //           className="h-30 rounded-md"
    //           draggable={false}
    //         />
    //       );
    //     case FileTypes.PDF:
    //       return <PDFPreview key={attachment.cloudId} file={attachment} />;
    //     default:
    //       return null;
    //   }
    // });
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

  return isSent ? (
    <div className={`mb-2 flex justify-end`}>
      <div
        className={`max-w-xs rounded-lg bg-blue-700 px-4 py-2 text-white md:max-w-md lg:max-w-lg ${
          isOnlyEmoji ? "text-4xl" : "text-base"
        }`}
      >
        {!!attachments?.length && (
          <div className="mb-2">{renderAttachments(attachments)}</div>
        )}
        <pre
          className="sent-message-text whitespace-pre-wrap break-words font-sans"
          dangerouslySetInnerHTML={{ __html: parsedMessageWithLinks }}
        />

        {!!linksInMessage?.length && (
          <LinksPreview
            links={linksInMessage}
            linkPreviewVariant={linksInMessage.length > 1 ? "INLINE" : "FULL"}
          />
        )}
        <p className="text-right text-xs text-white">
          {convertToUserMMHH(createdAt)}
        </p>
      </div>
    </div>
  ) : (
    <div className="mb-2 flex">
      <div
        className={`flex max-w-xs flex-col justify-start rounded-lg bg-gray-300 px-4 py-2 text-black md:max-w-md lg:max-w-lg`}
      >
        <div className="text-xs text-[#0F3070]">{senderId}</div>
        {!!attachments?.length && (
          <div className="mb-2">{renderAttachments(attachments)}</div>
        )}
        <pre
          className="recieved-message-text whitespace-pre-wrap break-words font-sans"
          dangerouslySetInnerHTML={{ __html: parsedMessageWithLinks }}
        />
        {!!linksInMessage?.length && (
          <LinksPreview
            links={linksInMessage}
            linkPreviewVariant={linksInMessage.length > 1 ? "INLINE" : "FULL"}
          />
        )}
        <p className="text-right text-xs text-gray-700">
          {convertToUserMMHH(createdAt)}
        </p>
      </div>
    </div>
  );
};

export default ChatBubble;
