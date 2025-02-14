import { z } from "zod";

export const UsageLogSchema = z.object({
  timestamp: z.string(),
  originalSize: z.number(),
  targetSize: z.number(),
  parts: z.number(),
  filename: z.string()
});

export type UsageLog = z.infer<typeof UsageLogSchema>;
