import {
  BathroomDesignDraft,
  bathroomDesignDraftSchema,
  safeParseBathroomDesignDraft
} from "@/lib/bathroom-design/schema";

export const DESIGN_DRAFT_STORAGE_KEY = "operon:bathroom-design:draft:v0.4";

const FORBIDDEN_SAVED_KEYS =
  /image|photoData|blob|base64|dataUrl|file|supplier(?:Cost|[\s_-]?cost)|labou?r(?:Rate|[\s_-]?rate)|rate(?:Card|[\s_-]?card)|margin/i;

export function sanitiseDesignDraftForStorage(draft: BathroomDesignDraft) {
  const parsed = bathroomDesignDraftSchema.parse(draft);
  const json = JSON.stringify(parsed);
  if (FORBIDDEN_SAVED_KEYS.test(json)) {
    throw new Error("Design draft contains forbidden persisted fields.");
  }
  return parsed;
}

export function writeLocalDesignDraft(draft: BathroomDesignDraft, storage: Pick<Storage, "setItem">) {
  storage.setItem(DESIGN_DRAFT_STORAGE_KEY, JSON.stringify(sanitiseDesignDraftForStorage(draft)));
}

export function readLocalDesignDraft(storage: Pick<Storage, "getItem">) {
  const raw = storage.getItem(DESIGN_DRAFT_STORAGE_KEY);
  if (!raw) return null;
  try {
    const parsed = safeParseBathroomDesignDraft(JSON.parse(raw));
    return parsed.success ? parsed.data : null;
  } catch {
    return null;
  }
}

export function designDraftContainsForbiddenPersistence(value: unknown) {
  return FORBIDDEN_SAVED_KEYS.test(JSON.stringify(value));
}
