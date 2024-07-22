import CloudDownloadIcon from "../icons/CloudDownloadIcon";
import PdfIcon from "../icons/pdfIcon";
import { IAttachment } from "../types";

const PDFPreview = ({ file }: { file: IAttachment }) => {
  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = file.cloudId;
    link.download = file.name;
    link.click();
    link.remove();
  };

  // @TODO: Create variants

  return (
    <div className="flex w-fit flex-col items-start rounded-lg border-2 border-slate-600">
      <div>
        <div className="relative h-40 overflow-hidden rounded-t-lg">
          <iframe
            src={file.cloudId}
            className="pointer-events-none absolute h-full w-full scale-110"
          />
        </div>
        <div
          className="flex cursor-pointer items-center gap-2 bg-slate-600 p-2"
          onClick={handleDownload}
        >
          <PdfIcon />
          <span className="flex-grow">{file.name}</span>
          <CloudDownloadIcon />
        </div>
      </div>
    </div>
  );
};

export default PDFPreview;
