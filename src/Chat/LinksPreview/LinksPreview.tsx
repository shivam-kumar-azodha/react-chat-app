import React from "react";
import clsx from "clsx";
import { LinksPreviewProps } from "./__types__/LinksPreview.types";
import LinkPreview from "./LinkPreview";

const LinksPreview: React.FC<LinksPreviewProps> = ({
  links,
  linkPreviewVariant,
  className,
}) => {
  return (
    <div
      className={clsx("flex items-center gap-x-3 overflow-scroll", className)}
    >
      {links.map((link, index) => (
        <LinkPreview key={index} url={link} variant={linkPreviewVariant} />
      ))}
    </div>
  );
};

export default LinksPreview;
