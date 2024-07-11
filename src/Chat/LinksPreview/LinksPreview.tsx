import { LinkPreviewVariant } from "../../types";
import LinkPreview from "./LinkPreview";

const LinksPreview = ({
  links,
  linkPreviewVariant,
}: {
  links: string[];
  linkPreviewVariant?: LinkPreviewVariant;
}) => {
  return (
    <div className="flex items-center gap-x-3 overflow-scroll">
      {links.map((link, index) => (
        <LinkPreview key={index} url={link} variant={linkPreviewVariant} />
      ))}
    </div>
  );
};

export default LinksPreview;
