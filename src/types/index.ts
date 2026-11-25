export type InquiryStatus = "New" | "In Review" | "Responded" | "Closed";
export type InquiryType = "project" | "internship" | "collaboration" | "general";

export interface Inquiry {
  id: string;
  name: string;
  email: string;
  organization: string | null;
  inquiry_type: InquiryType;
  subject: string;
  message: string;
  status: InquiryStatus;
  consent: boolean;
  created_at: string;
  updated_at: string;
  first_response_at: string | null;
  closed_at: string | null;
}

export interface StatusHistoryEntry {
  id: string;
  inquiry_id: string;
  previous_status: InquiryStatus | null;
  new_status: InquiryStatus;
  changed_by: string | null;
  note: string | null;
  created_at: string;
}
