"use server";

import { createServiceClient } from "@/lib/supabase/admin";
import { inquirySchema } from "@/lib/validation";

export interface InquiryFormState {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: Partial<Record<string, string>>;
  values?: Record<string, string>;
}

const MAX_PER_EMAIL_PER_HOUR = 3;
const MAX_TOTAL_PER_HOUR = 40;

function str(formData: FormData, key: string): string {
  const v = formData.get(key);
  return typeof v === "string" ? v : "";
}

export async function submitInquiry(_prev: InquiryFormState, formData: FormData): Promise<InquiryFormState> {
  // Spam trap: real visitors never see or fill this field. Pretend success so bots learn nothing.
  if (str(formData, "website") !== "") return { status: "success" };

  const values = {
    name: str(formData, "name"),
    email: str(formData, "email"),
    organization: str(formData, "organization"),
    inquiry_type: str(formData, "inquiry_type"),
    subject: str(formData, "subject"),
    message: str(formData, "message"),
  };

  const parsed = inquirySchema.safeParse({ ...values, consent: formData.get("consent") === "on" });

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? "form");
      if (!fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return { status: "error", message: "Please fix the highlighted fields and try again.", fieldErrors, values };
  }

  const db = createServiceClient();
  if (!db) {
    return {
      status: "error",
      message: "The inquiry system is not available right now. Please try again later.",
      values,
    };
  }

  // Basic rate limiting backed by stored records (survives serverless cold starts).
  const since = new Date(Date.now() - 60 * 60 * 1000).toISOString();
  const [perEmail, total] = await Promise.all([
    db.from("inquiries").select("id", { count: "exact", head: true }).eq("email", parsed.data.email).gte("created_at", since),
    db.from("inquiries").select("id", { count: "exact", head: true }).gte("created_at", since),
  ]);
  if (
    (perEmail.count ?? 0) >= MAX_PER_EMAIL_PER_HOUR ||
    (total.count ?? 0) >= MAX_TOTAL_PER_HOUR
  ) {
    return {
      status: "error",
      message: "Too many inquiries were received recently. Please wait a while and try again.",
      values,
    };
  }

  const { data: inserted, error } = await db
    .from("inquiries")
    .insert({
      name: parsed.data.name,
      email: parsed.data.email,
      organization: parsed.data.organization,
      inquiry_type: parsed.data.inquiry_type,
      subject: parsed.data.subject,
      message: parsed.data.message,
      consent: true,
      status: "New",
    })
    .select("id")
    .single();

  if (error || !inserted) {
    console.error("submitInquiry insert failed:", error?.message);
    return { status: "error", message: "Something went wrong while saving your inquiry. Please try again.", values };
  }

  // Initial history entry (system-generated) so the process trail starts at submission.
  const { error: historyError } = await db.from("inquiry_status_history").insert({
    inquiry_id: inserted.id,
    previous_status: null,
    new_status: "New",
    changed_by: null,
    note: "Submitted via website form",
  });
  if (historyError) console.error("submitInquiry history insert failed:", historyError.message);

  return { status: "success" };
}
