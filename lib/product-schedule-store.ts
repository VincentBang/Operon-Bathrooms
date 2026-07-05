import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import type { BathroomSchedule, ProductScheduleLeadInput } from "@/lib/product-schedule";
import type { ProductScheduleInput } from "@/lib/product-schedule";

const storePath =
  process.env.NETLIFY || process.env.AWS_LAMBDA_FUNCTION_NAME
    ? path.join("/tmp", "bathroom-product-schedules.json")
    : path.join(process.cwd(), ".local", "bathroom-product-schedules.json");

export type StoredBathroomProductSchedule = {
  id: string;
  createdAt: string;
  updatedAt?: string;
  source: "bathroom_product_schedule";
  schedule: BathroomSchedule;
  lead: ProductScheduleLeadInput | null;
  input?: ProductScheduleInput;
  adminStatus?: "new" | "reviewed" | "contacted" | "follow_up_needed" | "closed";
  followUpStatus?: "not_started" | "requested" | "in_progress" | "completed" | "not_required";
  internalNotes?: string;
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
  lead: ProductScheduleLeadInput | null,
  input?: ProductScheduleInput
) {
  await mkdir(path.dirname(storePath), { recursive: true });
  const existing = await readStore();
  const createdAt = new Date().toISOString();
  const record: StoredBathroomProductSchedule = {
    id: `bps_store_${Date.now().toString(36)}`,
    createdAt,
    updatedAt: createdAt,
    source: "bathroom_product_schedule",
    schedule,
    lead,
    input,
    adminStatus: "new",
    followUpStatus: "not_started",
    internalNotes: ""
  };

  existing.push(record);
  await writeFile(storePath, `${JSON.stringify(existing, null, 2)}\n`, "utf8");

  return record;
}

export async function listBathroomProductSchedules() {
  const records = await readStore();
  return records.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function updateBathroomProductScheduleRecord(
  recordId: string,
  patch: Pick<StoredBathroomProductSchedule, "adminStatus" | "followUpStatus" | "internalNotes">
) {
  const records = await readStore();
  const index = records.findIndex((record) => record.id === recordId);
  if (index === -1) return null;
  const cleanPatch = Object.fromEntries(
    Object.entries(patch).filter(([, value]) => value !== undefined)
  ) as Partial<StoredBathroomProductSchedule>;
  records[index] = {
    ...records[index],
    ...cleanPatch,
    updatedAt: new Date().toISOString()
  };
  await mkdir(path.dirname(storePath), { recursive: true });
  await writeFile(storePath, `${JSON.stringify(records, null, 2)}\n`, "utf8");
  return records[index];
}
