import React, { useState, useEffect } from "react";
import { FilePreviewData } from "./__types__/FilesPreview.types";
import clsx from "clsx";

interface ImagePreviewProps {
  file: FilePreviewData;
  imageClassName?: string;
}

const ImagePreview: React.FC<ImagePreviewProps> = ({
  file,
  imageClassName,
}) => {
  const [imageSrc, setImageSrc] = useState<string>("");

  useEffect(() => {
    if (file.url) {
      setImageSrc(file.url);
    } else if (file.cloudId) {
      setImageSrc(file.cloudId);
    } else if (file.file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageSrc(reader.result as string);
      };
      reader.readAsDataURL(file.file);
    }
  }, [file]);

  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    console.error("Error loading image:", e);
    e.currentTarget.src = "path_to_placeholder_image";
  };

  return (
    <img
      src={imageSrc}
      alt={file.name}
      className={clsx("h-16 w-16 rounded-md object-cover", imageClassName)}
      onError={handleError}
    />
  );
};

export default ImagePreview;
