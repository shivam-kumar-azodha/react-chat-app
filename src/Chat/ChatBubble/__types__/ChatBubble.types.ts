import { IAttachment } from "../../../types";

export type ChatBubbleProps = {
  message: string;
  attachments?: IAttachment[];
  isSent: boolean;
  linksInMessage?: string[];
};

export enum FileTypes {
  Audio = "audio",
  Video = "video",
  Image = "image",
  PDF = "pdf",
}

export const FileTypeExtensions = {
  [FileTypes.Audio]: ["mp3", "wav", "ogg", "webm"],
  [FileTypes.Video]: ["mp4", "mov", "avi"],
  [FileTypes.Image]: ["jpg", "jpeg", "png"],
  [FileTypes.PDF]: ["pdf"],
};

export const containsOnlyEmojis = (message: string) =>
  message.match(/^(?:\p{Emoji_Presentation}|\p{Extended_Pictographic})+$/u);

export const getFileTypeByExtension = (name: string) => {
  const extension = name.split(".").pop();
  if (!extension) return undefined;
  for (const [fileType, extensions] of Object.entries(FileTypeExtensions)) {
    if (extensions.includes(extension)) return fileType;
  }
};
