import { FileTypes } from "../../types";

export interface FilePreviewData {
  name: string;
  type: string;
  url: string;
  size: number;
  cloudId?: string;
  isRecording?: boolean;
  file?: any;
}

export const FileTypeStartsWithMap = {
  [FileTypes.Image]: ["image/", "application/image"],
  [FileTypes.Audio]: ["audio/", "application/audio"],
  [FileTypes.Video]: ["video/", "application/video"],
  [FileTypes.PDF]: "application/pdf",
};

export interface FilesPreviewProps {
  files: FilePreviewData[];
  setFiles?: React.Dispatch<React.SetStateAction<FilePreviewData[]>>;
  className?: string;
  fileWrapperClassName?: string;
}

export interface FilePreviewProps {
  file: FilePreviewData;
}
