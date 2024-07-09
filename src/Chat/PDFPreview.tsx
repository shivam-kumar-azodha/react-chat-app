import CloudDownloadIcon from "../icons/CloudDownloadIcon";
import PdfIcon from "../icons/pdfIcon";
import { IAttachment } from "../types";

const PDFPreview = ({ file }: { file: IAttachment }) => {
  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = file.cloudId;
    link.download = file.name;
    link.click();
  };

  return (
    <div className="flex flex-col items-start rounded-lg border-2 border-slate-600">
      <div>
        <div className="relative overflow-hidden rounded-t-lg h-40">
          <iframe
            src={file.cloudId}
            className="absolute w-full h-full scale-110 pointer-events-none"
          />
        </div>
        <div
          className="flex gap-2 bg-slate-600 p-2 items-center cursor-pointer"
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
