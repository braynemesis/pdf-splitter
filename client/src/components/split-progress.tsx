import { Progress } from "./ui/progress";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";

interface SplitProgressProps {
  progress: number;
}

export function SplitProgress({ progress }: SplitProgressProps) {
  const { toast } = useToast();

  useEffect(() => {
    const { dismiss } = toast({
      title: "Splitting PDF",
      description: (
        <Progress
          value={progress}
          className="w-[200px] mt-2"
        />
      ),
      duration: progress === 100 ? 2000 : Infinity,
    });

    return () => dismiss();
  }, [progress, toast]);

  return null;
}
