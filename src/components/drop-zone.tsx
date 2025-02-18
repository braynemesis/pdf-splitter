import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Card } from "./ui/card";
import { Upload } from "lucide-react";

interface DropZoneProps {
  onFileSelect: (file: File) => void;
}

export function DropZone({ onFileSelect }: DropZoneProps) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles[0]) {
      onFileSelect(acceptedFiles[0]);
    }
  }, [onFileSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
    },
    maxFiles: 1,
  });

  return (
    <Card
      {...getRootProps()}
      className={`p-8 border-2 border-dashed cursor-pointer transition-colors ${
        isDragActive ? "border-primary bg-primary/5" : "border-muted"
      }`}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center gap-4 text-muted-foreground">
        <Upload size={40} />
        <p className="text-center">
          {isDragActive
            ? "Drop the PDF here"
            : "Drag & drop a PDF file here, or click to select"}
        </p>
      </div>
    </Card>
  );
}
