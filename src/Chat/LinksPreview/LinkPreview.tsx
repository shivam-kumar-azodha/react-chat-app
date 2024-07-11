import React, { useEffect, useState } from "react";
import axios from "axios";
import { LinkPreviewVariant } from "../../types";

interface LinkPreviewProps {
  url: string;
  variant?: LinkPreviewVariant;
}

interface LinkMetadata {
  title: string;
  description: string;
  image: string;
  url: string;
}

const LinkPreview: React.FC<LinkPreviewProps> = ({
  url,
  variant = "INLINE",
}) => {
  const [metadata, setMetadata] = useState<LinkMetadata | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Add https:// if URL doesn't start with a protocol
  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    url = `https://${url}`;
  }

  useEffect(() => {
    const fetchLinkPreview = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_GET_META_DATA_URL}/?url=${encodeURIComponent(
            url
          )}`
        );
        console.log(response);
        setMetadata(response.data);
      } catch (error) {
        setError("Failed to fetch link preview");
        console.error("Failed to fetch link preview", error);
      }
      setLoading(false);
    };

    fetchLinkPreview();
  }, [url]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!metadata || !Object.values(metadata).some(Boolean)) {
    return null;
  }

  switch (variant) {
    case "FULL": {
      return (
        <a
          href="#"
          className="flex flex-row bg-white rounded-lg shadow hover:bg-gray-100 "
        >
          {metadata.image && (
            <div className="flex justify-center items-center overflow-hidden w-16">
              <img
                className="w-full h-full object-cover rounded-l-md"
                src={metadata.image}
                alt=""
              />
            </div>
          )}
          <div className="flex flex-col py-1 px-2 leading-normal gap-1">
            {metadata.title && (
              <h5 className="text-xs font-semibold text-gray-900 line-clamp-1">
                {metadata.title}
              </h5>
            )}
            {metadata.description && (
              <p className="font-semibold flex-grow text-[10px] text-gray-700 line-clamp-2">
                {metadata.description}
              </p>
            )}
            {
              <a
                href={metadata.url || url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 text-xs truncate justify-end"
              >
                {metadata.url || url}
              </a>
            }
          </div>
        </a>
      );
    }
    default: {
      return (
        <div
          className="flex flex-col border rounded-md p-1 gap-y-1 cursor-pointer bg-white text-black hover:bg-gray-100 transition-colors"
          onClick={() => {
            window.open(metadata.url || url, "_blank");
          }}
        >
          <div className="flex items-center gap-2">
            {metadata.image && (
              <img
                src={metadata.image}
                alt={metadata.title}
                className="h-6 w-6 rounded-md"
              />
            )}
            <span className="text-sm font-medium line-clamp-1 max-w-40">
              {metadata.title}
            </span>
          </div>

          {
            <a
              href={metadata.url || url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 max-w-48 truncate text-sm"
            >
              {metadata.url || url}
            </a>
          }
        </div>
      );
    }
  }
};

export default LinkPreview;
