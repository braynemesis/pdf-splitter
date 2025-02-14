import { Document, Page, pdfjs } from "react-pdf";
import { Card } from "./ui/card";
import { Skeleton } from "./ui/skeleton";

// Configure pdf.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

interface PDFPreviewProps {
  file: File | null;
}

export function PDFPreview({ file }: PDFPreviewProps) {
  if (!file) return null;

  return (
    <Card className="p-4 mt-4 max-h-[600px] overflow-auto">
      <Document
        file={file}
        loading={<Skeleton className="w-full h-[600px]" />}
        error={<div className="text-destructive">Failed to load PDF. Please make sure you uploaded a valid PDF file.</div>}
      >
        <Page pageNumber={1} width={600} />
      </Document>
    </Card>
  );
}