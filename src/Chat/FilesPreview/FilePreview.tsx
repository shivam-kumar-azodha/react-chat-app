import React from "react";
import AudioPlayer from "../../AudioPlayer/AudioPlayer";
import PdfIcon from "../../icons/pdfIcon";
import { FilePreviewProps, FileType } from "./__types__/FilesPreview.types";
import ImagePreview from "./ImagePreview";

const getFormattedFileSize = (size: number) => {
  const i = size === 0 ? 0 : Math.floor(Math.log(size) / Math.log(1024));
  return `${Number((size / Math.pow(1024, i)).toFixed(2))} ${["B", "KB", "MB", "GB", "TB"][i]}`;
};

const FilePreview: React.FC<FilePreviewProps> = ({ file }) => {
  const getFileType = (type: string): FileType | null => {
    if (type.startsWith(FileType.IMAGE)) return FileType.IMAGE;
    if (type.startsWith(FileType.AUDIO)) return FileType.AUDIO;
    if (type.startsWith(FileType.VIDEO)) return FileType.VIDEO;
    if (type === FileType.PDF) return FileType.PDF;
    return null;
  };

  const fileType = getFileType(file.type);

  switch (fileType) {
    case FileType.IMAGE:
      return (
        <div className="flex gap-2">
          <ImagePreview file={file} />
          <div className="flex flex-col justify-center">
            <span className="line-clamp-1 max-w-48 text-sm font-medium">
              {file.name}
            </span>
            <span className="text-xs text-gray-500">
              Image {getFormattedFileSize(file.size)}
            </span>
          </div>
        </div>
      );

    case FileType.AUDIO:
      if (file.isRecording)
        return (
          <div className="flex">
            <div className="flex w-60 items-center justify-center">
              <AudioPlayer audioUrl={file.url} />
            </div>
          </div>
        );
      return (
        <div className="flex gap-2">
          <div className="flex items-center justify-center">
            <AudioPlayer audioUrl={file.url} hideWaveForm hideTimer />
          </div>
          <div className="flex flex-col justify-center">
            <span className="line-clamp-1 max-w-48 text-sm font-medium">
              {file.name}
            </span>
            <span className="text-xs text-gray-500">
              Audio {getFormattedFileSize(file.size)}
            </span>
          </div>
        </div>
      );

    case FileType.VIDEO:
      return (
        <div className="flex gap-2">
          <div className="flex items-center justify-center">
            <p>V Icon</p>
          </div>
          <div className="flex flex-col justify-center">
            <span className="line-clamp-1 max-w-48 text-sm font-medium">
              {file.name}
            </span>
            <span className="text-xs text-gray-500">
              Video {getFormattedFileSize(file.size)}
            </span>
          </div>
        </div>
      );

    case FileType.PDF:
      return (
        <div className="flex gap-2">
          <div className="flex items-center justify-center">
            <PdfIcon />
          </div>
          <div className="flex flex-col justify-center">
            <span className="line-clamp-1 max-w-48 text-sm font-medium">
              {file.name}
            </span>
            <span className="text-xs text-gray-500">
              PDF {getFormattedFileSize(file.size)}
            </span>
          </div>
        </div>
      );

    default:
      return <p>File type not supported for preview</p>;
  }
};

export default FilePreview;
