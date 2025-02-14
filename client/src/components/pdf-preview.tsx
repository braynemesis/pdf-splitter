import { Document, Page } from "react-pdf";
import { Card } from "./ui/card";
import { Skeleton } from "./ui/skeleton";

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
        error={<div className="text-destructive">Failed to load PDF</div>}
      >
        <Page pageNumber={1} width={600} />
      </Document>
    </Card>
  );
}
