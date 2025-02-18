import { useState } from "react";
import { DropZone } from "@/components/drop-zone";
import { PDFPreview } from "@/components/pdf-preview";
import { SizeSelector } from "@/components/size-selector";
import { SplitProgress } from "@/components/split-progress";
import { Button } from "@/components/ui/button";
import { splitPDF } from "@/lib/pdf";
import { getSplitPDF, storeSplitPDF } from "@/lib/storage";
import { Download } from "lucide-react";
import { nanoid } from "nanoid";
import JSZip from "jszip";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [maxSize, setMaxSize] = useState(20);
  const [progress, setProgress] = useState(0);
  const [splitting, setSplitting] = useState(false);
  const [parts, setParts] = useState<string[]>([]);

  async function handleSplit() {
    if (!file) return;
    
    setSplitting(true);
    setProgress(0);
    setParts([]);

    try {
      const splitParts = await splitPDF(file, maxSize);
      const partIds: string[] = [];

      for (let i = 0; i < splitParts.length; i++) {
        const id = nanoid();
        await storeSplitPDF(id, splitParts[i]);
        partIds.push(id);
        setProgress(((i + 1) / splitParts.length) * 100);
      }

      setParts(partIds);
    
    } finally {
      setSplitting(false);
    }
  }

  async function downloadFile(id: string, index: number) {
    const file = await getSplitPDF(id);
    if (file) {
      const url = URL.createObjectURL(file);
      const a = document.createElement('a');
      a.href = url;
      a.download = `split-file-part-${index + 1}.pdf`;
      a.click();
    }
  }
  
  async function downloadAllFilesAsZip() {
    const uuid = nanoid();
    const files = await Promise.all(parts.map(async (id) => {
      return await getSplitPDF(id);
    }));
    const zip = new JSZip();
    files.forEach((file, index) => {
      zip.file(`split-file-part-${index + 1}.pdf`, file);
    });
    const content = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(content);
    const a = document.createElement('a');
    a.href = url;
    a.download = `split-file-${uuid}.zip`;
    a.click();
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-primary to-primary/60 text-transparent bg-clip-text">
        PDF Splitter
      </h1>

      <div className="space-y-8">
        <DropZone onFileSelect={setFile} />
        
        {file && (
          <>
            <div className="flex items-center gap-4">
              <SizeSelector value={maxSize} onChange={setMaxSize} />
              <Button
                onClick={handleSplit}
                disabled={splitting}
              >
                Split PDF
              </Button>
            </div>

            <PDFPreview file={file} />

            {splitting && <SplitProgress progress={progress} />}

            {parts.length > 0 && (
              <div className="space-y-2">
                <h2 className="text-lg font-semibold">Split Files</h2>
                <div className="grid gap-2">
                  {parts.map((id, index) => (
                    <Button
                      key={id}
                      variant="outline"
                      className="w-full"
                      onClick={() => {
                        downloadFile(id, index);
                      }}
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Part {index + 1}
                    </Button>
                  ))}
                </div>
              </div>
            )}
            {
              parts.length > 0 && (
                <div className="space-y-2">
                  <h2 className="text-lg font-semibold">Split Files</h2>
                  <div className="grid gap-2">
                    <Button variant="outline" className="w-full" onClick={() => {
                      downloadAllFilesAsZip();
                    }}>
                      Download All
                    </Button>
                  </div>
                </div>
              )
            }
          </>
        )}
      </div>
    </div>
  );
}
