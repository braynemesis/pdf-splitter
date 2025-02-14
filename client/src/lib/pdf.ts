import { PDFDocument } from "pdf-lib";

export async function splitPDF(file: File, maxSizeMB: number): Promise<Blob[]> {
  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(arrayBuffer);
  const pageCount = pdfDoc.getPageCount();
  
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  const parts: Blob[] = [];
  let currentDoc = await PDFDocument.create();
  let currentSize = 0;

  for (let i = 0; i < pageCount; i++) {
    const [page] = await currentDoc.copyPages(pdfDoc, [i]);
    currentDoc.addPage(page);
    
    const bytes = await currentDoc.save();
    currentSize = bytes.length;

    if (currentSize > maxSizeBytes || i === pageCount - 1) {
      parts.push(new Blob([bytes], { type: "application/pdf" }));
      currentDoc = await PDFDocument.create();
      currentSize = 0;
    }
  }

  return parts;
}
