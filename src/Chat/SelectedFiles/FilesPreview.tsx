import { useEffect } from "react";
import CrossWithBlueCircleIcon from "../../icons/CrossWithBlueCircleIcon";
import AudioPlayer from "../../AudioPlayer/AudioPlayer";
import PdfIcon from "../../icons/pdfIcon";

interface FilePreview {
  name: string;
  type: string;
  url: string;
  size: number;
  isRecording?: boolean;
}

enum FileType {
  IMAGE = "image/",
  AUDIO = "audio/",
  VIDEO = "video/",
  PDF = "application/pdf",
}

const getFormattedFileSize = (size: number) => {
  const i = size === 0 ? 0 : Math.floor(Math.log(size) / Math.log(1024));
  return `${Number((size / Math.pow(1024, i)).toFixed(2))} ${
    ["B", "KB", "MB", "GB", "TB"][i]
  }`;
};

const FilesPreview = ({ files, setFiles }: any) => {
  const renderPreview = (file: FilePreview) => {
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
            <img
              src={file.url}
              alt={file.name}
              className="rounded-md h-10 w-10"
            />
            <div className="flex flex-col justify-center">
              <span className="text-sm font-medium line-clamp-1 max-w-48">
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
              <div className="flex items-center justify-center w-60">
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
              <span className="text-sm font-medium line-clamp-1 max-w-48">
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
              <span className="text-sm font-medium line-clamp-1 max-w-48">
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
              <span className="text-sm font-medium line-clamp-1 max-w-48">
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

  return (
    <div className="flex p-2 gap-x-3 items-center overflow-scroll">
      {files.map((file: any, index: any) => (
        <div key={index} className="border p-2 rounded relative min-w-fit">
          <div
            className="top-0 right-0 absolute z-10 cursor-pointer -mr-2 -mt-2"
            onClick={() => {
              setFiles((prevFiles: any) =>
                prevFiles.filter((_: any, i: any) => i !== index)
              );
            }}
          >
            <CrossWithBlueCircleIcon />
          </div>
          {renderPreview(file)}
        </div>
      ))}
    </div>
  );
};

export default FilesPreview;
