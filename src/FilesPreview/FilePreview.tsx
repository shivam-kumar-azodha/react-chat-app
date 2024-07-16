import React from "react";

import { FilePreviewProps } from "./__types__/FilesPreview.types";
import ImagePreview from "./ImagePreview";
import AudioPlayer from "../AudioPlayer/AudioPlayer";
import PdfIcon from "../icons/pdfIcon";
import { FileTypes } from "../types";
import { getFileTypeByExtension } from "../Chat/ChatBubble/__types__/ChatBubble.types";

const getFormattedFileSize = (size: number) => {
  const i = size === 0 ? 0 : Math.floor(Math.log(size) / Math.log(1024));
  return `${Number((size / Math.pow(1024, i)).toFixed(2))} ${["B", "KB", "MB", "GB", "TB"][i]}`;
};

const FilePreview: React.FC<FilePreviewProps> = ({ file }) => {
  const fileType = getFileTypeByExtension(file.name);

  switch (fileType) {
    case FileTypes.Image:
      return (
        <div className="flex gap-2">
          <ImagePreview file={file} />
          <div className="flex flex-col justify-center">
            <span className="line-clamp-1 max-w-48 text-sm font-medium text-black">
              {file.name}
            </span>
            {file?.size && (
              <span className="text-xs text-gray-500">
                Image {getFormattedFileSize(file.size)}
              </span>
            )}
          </div>
        </div>
      );

    case FileTypes.Audio:
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

    case FileTypes.Video:
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

    case FileTypes.PDF:
      return (
        <div className="flex gap-2">
          <div className="flex items-center justify-center">
            <PdfIcon />
          </div>
          <div className="flex flex-col justify-center">
            <span className="line-clamp-1 max-w-48 text-sm font-medium text-black">
              {file.name}
            </span>
            {file.size && (
              <span className="text-xs text-gray-500">
                PDF {getFormattedFileSize(file.size)}
              </span>
            )}
          </div>
        </div>
      );

    default:
      return <p>File type not supported for preview</p>;
  }
};

export default FilePreview;
