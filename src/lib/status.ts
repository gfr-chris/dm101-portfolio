import type { InquiryStatus } from "@/types";

export const STATUSES: InquiryStatus[] = ["New", "In Review", "Responded", "Closed"];

/** Allowed next status for each status (mirrors public.change_inquiry_status in schema.sql). */
export const TRANSITIONS: Record<InquiryStatus, InquiryStatus[]> = {
  New: ["In Review"],
  "In Review": ["Responded", "Closed"],
  Responded: ["Closed"],
  Closed: [],
};

export const STATUS_MEANING: Record<InquiryStatus, string> = {
  New: "Inquiry passed validation and has been stored.",
  "In Review": "Owner is assessing the request.",
  Responded: "Owner has sent a response.",
  Closed: "No further action is currently required.",
};

export const OPEN_STATUSES: InquiryStatus[] = ["New", "In Review"];

export function isStatus(value: unknown): value is InquiryStatus {
  return typeof value === "string" && (STATUSES as string[]).includes(value);
}

export function canTransition(from: InquiryStatus, to: InquiryStatus): boolean {
  return TRANSITIONS[from].includes(to);
}
