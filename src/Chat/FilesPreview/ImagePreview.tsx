import { useState, useEffect } from "react";

const ImagePreview = ({ file }: any) => {
  const [imageSrc, setImageSrc] = useState<any>("");

  useEffect(() => {
    if (file.url) {
      // If the file object has a URL (user-uploaded file), use it directly
      setImageSrc(file.url);
    } else if (file.cloudId) {
      // If the file object has a cloudId (file from API), use it directly
      setImageSrc(file.cloudId);
    } else if (file.file) {
      // If the file object has a File (user-uploaded file), convert it to a base64 data URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageSrc(reader.result);
      };
      reader.readAsDataURL(file.file);
    }
  }, [file]);

  const handleError = (e: any) => {
    console.error("Error loading image:", e);
    // Provide a fallback URL or some placeholder if the image fails to load
    e.target.src = "path_to_placeholder_image";
  };

  return (
    <img
      src={imageSrc}
      alt={file.name}
      className="w-16 h-16 object-cover rounded-md"
      onError={handleError}
    />
  );
};

export default ImagePreview;
