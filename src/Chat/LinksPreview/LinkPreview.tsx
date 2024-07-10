import React, { useEffect, useState } from "react";
import axios from "axios";

interface LinkPreviewProps {
  url: string;
}

interface LinkMetadata {
  title: string;
  description: string;
  image: string;
  url: string;
}

const LinkPreview: React.FC<LinkPreviewProps> = ({ url }) => {
  const [metadata, setMetadata] = useState<LinkMetadata | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLinkPreview = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(
          `https://api.linkpreview.net/?key=${
            import.meta.env.VITE_APP_LINK_PREVIEW_API_KEY
          }&q=${encodeURIComponent(url)}`
        );
        setMetadata(response.data);
      } catch (error) {
        setError("No link Preview");
        console.error("Failed to fetch link preview", error);
      }
      setLoading(false);
    };

    fetchLinkPreview();
  }, [url]);

  if (loading) {
    return <div className="text-sm text-gray-500">Loading...</div>;
  }

  if (error) {
    return <div className="text-sm text-red-500">{error}</div>;
  }

  if (!metadata) {
    return null;
  }

  return (
    <div className="flex flex-col border p-1 gap-y-1">
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

      <a
        href={metadata.url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-500 max-w-40 truncate text-sm"
      >
        {metadata.url}
      </a>
    </div>
  );
};

export default LinkPreview;
