export interface IMessageData {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  attachments?: IAttachment[];
}

export interface IAttachment {
  cloudId: string;
  name: string;
}

export interface IFile {
  name: string;
  type: string;
  url: string;
  size: number;
  isRecording?: boolean;
  file?: Blob;
}

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

export type LinkPreviewVariant = "INLINE" | "FULL";
