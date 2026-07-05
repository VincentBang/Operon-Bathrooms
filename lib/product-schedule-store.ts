import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import type { BathroomSchedule, ProductScheduleLeadInput } from "@/lib/product-schedule";

const storePath = path.join(process.cwd(), ".local", "bathroom-product-schedules.json");

export type StoredBathroomProductSchedule = {
  id: string;
  createdAt: string;
  source: "bathroom_product_schedule";
  schedule: BathroomSchedule;
  lead: ProductScheduleLeadInput | null;
};

async function readStore(): Promise<StoredBathroomProductSchedule[]> {
  try {
    const raw = await readFile(storePath, "utf8");
    return JSON.parse(raw) as StoredBathroomProductSchedule[];
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return [];
    }
    throw error;
  }
}

export async function storeBathroomProductSchedule(
  schedule: BathroomSchedule,
  lead: ProductScheduleLeadInput | null
) {
  await mkdir(path.dirname(storePath), { recursive: true });
  const existing = await readStore();
  const record: StoredBathroomProductSchedule = {
    id: `bps_store_${Date.now().toString(36)}`,
    createdAt: new Date().toISOString(),
    source: "bathroom_product_schedule",
    schedule,
    lead
  };

  existing.push(record);
  await writeFile(storePath, `${JSON.stringify(existing, null, 2)}\n`, "utf8");

  return record;
}
