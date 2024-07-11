import React from "react";
import clsx from "clsx";
import {
  FilesPreviewProps,
  FilePreviewData,
} from "./__types__/FilesPreview.types";
import FilePreview from "./FilePreview";
import CrossWithBlueCircleIcon from "../icons/CrossWithBlueCircleIcon";

const FilesPreview: React.FC<FilesPreviewProps> = ({
  files,
  setFiles,
  className,
  fileWrapperClassName,
}) => {
  return (
    <div
      className={clsx(
        "flex items-center gap-x-3 overflow-scroll p-2",
        className,
      )}
    >
      {files.map((file: FilePreviewData, index: number) => (
        <div
          key={index}
          className={clsx(
            "relative min-w-fit rounded border p-2",
            fileWrapperClassName,
          )}
        >
          {setFiles && (
            <div
              className="absolute right-0 top-0 z-10 -mr-2 -mt-2 cursor-pointer"
              onClick={() => {
                setFiles((prevFiles: FilePreviewData[]) =>
                  prevFiles.filter((_, i) => i !== index),
                );
              }}
            >
              <CrossWithBlueCircleIcon />
            </div>
          )}
          <FilePreview file={file} />
        </div>
      ))}
    </div>
  );
};

export default FilesPreview;
