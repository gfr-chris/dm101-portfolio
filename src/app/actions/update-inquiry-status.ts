"use server";

import { revalidatePath } from "next/cache";
import { requireOwner } from "@/lib/auth";
import { statusChangeSchema } from "@/lib/validation";

export interface StatusUpdateState {
  status: "idle" | "success" | "error";
  message?: string;
}

export async function updateInquiryStatus(
  _prev: StatusUpdateState,
  formData: FormData,
): Promise<StatusUpdateState> {
  const { supabase } = await requireOwner();

  const parsed = statusChangeSchema.safeParse({
    inquiryId: formData.get("inquiryId"),
    newStatus: formData.get("newStatus"),
    note: (formData.get("note") as string | null) ?? undefined,
  });
  if (!parsed.success) {
    return { status: "error", message: parsed.error.issues[0]?.message ?? "Invalid request." };
  }

  // Atomic + validated in the database (see change_inquiry_status in supabase/schema.sql).
  const { error } = await supabase.rpc("change_inquiry_status", {
    p_inquiry_id: parsed.data.inquiryId,
    p_new_status: parsed.data.newStatus,
    p_note: parsed.data.note,
  });

  if (error) {
    return { status: "error", message: error.message };
  }

  revalidatePath("/admin");
  revalidatePath("/admin/inquiries");
  revalidatePath(`/admin/inquiries/${parsed.data.inquiryId}`);
  return { status: "success", message: `Status changed to “${parsed.data.newStatus}”.` };
}
