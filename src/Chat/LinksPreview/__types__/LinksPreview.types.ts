export type LinkPreviewVariant = "INLINE" | "FULL";

export interface LinkMetadata {
  title: string;
  description: string;
  image: string;
  url: string;
}

export interface LinkPreviewProps {
  url: string;
  variant?: LinkPreviewVariant;
}

export interface LinksPreviewProps {
  links: string[];
  linkPreviewVariant?: LinkPreviewVariant;
  className?: string;
}
