import type { Express } from "express";
import { createServer, type Server } from "http";
import fs from "fs/promises";
import path from "path";
import { UsageLogSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  const logPath = path.join(process.cwd(), "usage-logs.json");

  // Initialize log file if it doesn't exist
  try {
    await fs.access(logPath);
  } catch {
    await fs.writeFile(logPath, "[]");
  }

  app.post("/api/logs", async (req, res) => {
    const logEntry = UsageLogSchema.parse(req.body);
    
    const logs = JSON.parse(await fs.readFile(logPath, "utf-8"));
    logs.push(logEntry);
    await fs.writeFile(logPath, JSON.stringify(logs, null, 2));
    
    res.json({ success: true });
  });

  return createServer(app);
}
