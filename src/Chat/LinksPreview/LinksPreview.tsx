import LinkPreview from "./LinkPreview";

const LinksPreview = ({ links }: { links: string[] }) => {
  return (
    <div className="flex p-2 gap-x-3 items-center overflow-scroll">
      {links.map((link, index) => (
        <LinkPreview key={index} url={link} />
      ))}
    </div>
  );
};

export default LinksPreview;
