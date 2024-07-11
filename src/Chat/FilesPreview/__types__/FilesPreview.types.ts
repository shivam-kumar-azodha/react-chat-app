export interface FilePreviewData {
  name: string;
  type: string;
  url: string;
  size: number;
  cloudId?: string;
  isRecording?: boolean;
  file?: any;
}

export enum FileType {
  IMAGE = "image/",
  AUDIO = "audio/",
  VIDEO = "video/",
  PDF = "application/pdf",
}

export interface FilesPreviewProps {
  files: FilePreviewData[];
  setFiles?: React.Dispatch<React.SetStateAction<FilePreviewData[]>>;
  className?: string;
  fileWrapperClassName?: string;
}

export interface FilePreviewProps {
  file: FilePreviewData;
}
