import { openDB } from "idb";

const DB_NAME = "pdf-splitter";
const STORE_NAME = "split-files";

export async function initDB() {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      db.createObjectStore(STORE_NAME);
    },
  });
}

export async function storeSplitPDF(id: string, blob: Blob) {
  const db = await initDB();
  await db.put(STORE_NAME, blob, id);
}

export async function getSplitPDF(id: string) {
  const db = await initDB();
  return db.get(STORE_NAME, id);
}