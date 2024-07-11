import React, { useEffect, useState } from "react";
import axios from "axios";
import { LinkPreviewProps, LinkMetadata } from "./__types__/LinksPreview.types";

const LinkPreview: React.FC<LinkPreviewProps> = ({
  url,
  variant = "INLINE",
}) => {
  const [metadata, setMetadata] = useState<LinkMetadata | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Add https:// if URL doesn't start with a protocol
  const validatedUrl =
    url.startsWith("http://") || url.startsWith("https://")
      ? url
      : `https://${url}`;

  useEffect(() => {
    const fetchLinkPreview = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_GET_META_DATA_URL}/?url=${encodeURIComponent(validatedUrl)}`,
        );
        setMetadata(response.data);
      } catch (error) {
        setError("Failed to fetch link preview");
        console.error("Failed to fetch link preview", error);
      }
      setLoading(false);
    };

    fetchLinkPreview();
  }, [validatedUrl]);

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
          href={metadata.url || validatedUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-row rounded-lg bg-white shadow hover:bg-gray-100"
        >
          {metadata.image && (
            <div className="flex w-16 items-center justify-center overflow-hidden">
              <img
                className="h-full w-full rounded-l-md object-cover"
                src={metadata.image}
                alt=""
              />
            </div>
          )}
          <div className="flex flex-col gap-1 px-2 py-1 leading-normal">
            {metadata.title && (
              <h5 className="line-clamp-1 text-xs font-semibold text-gray-900">
                {metadata.title}
              </h5>
            )}
            {metadata.description && (
              <p className="line-clamp-2 flex-grow text-[10px] font-semibold text-gray-700">
                {metadata.description}
              </p>
            )}
            {
              <a
                href={metadata.url || validatedUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="justify-end truncate text-xs text-blue-500"
              >
                {metadata.url || validatedUrl}
              </a>
            }
          </div>
        </a>
      );
    }
    default: {
      return (
        <div
          className="flex cursor-pointer flex-col gap-y-1 rounded-md border bg-white p-1 text-black transition-colors hover:bg-gray-100"
          onClick={() => {
            window.open(metadata.url || validatedUrl, "_blank");
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
            <span className="line-clamp-1 max-w-40 text-sm font-medium">
              {metadata.title}
            </span>
          </div>

          {
            <a
              href={metadata.url || validatedUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="max-w-48 truncate text-sm text-blue-500"
            >
              {metadata.url || validatedUrl}
            </a>
          }
        </div>
      );
    }
  }
};

export default LinkPreview;
