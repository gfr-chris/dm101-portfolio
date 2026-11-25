"use client";

import { useActionState } from "react";
import { Loader2 } from "lucide-react";
import { updateInquiryStatus, type StatusUpdateState } from "@/app/actions/update-inquiry-status";
import type { InquiryStatus } from "@/types";

const initial: StatusUpdateState = { status: "idle" };

export function StatusForm({ inquiryId, options }: { inquiryId: string; options: InquiryStatus[] }) {
  const [state, action, pending] = useActionState(updateInquiryStatus, initial);

  if (options.length === 0) {
    return <p className="text-sm text-muted">This inquiry is closed. No further status changes are available.</p>;
  }

  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="inquiryId" value={inquiryId} />

      <fieldset>
        <legend className="mb-2 text-sm font-medium">Move to</legend>
        <div className="flex flex-wrap gap-3">
          {options.map((o, i) => (
            <label key={o} className="flex cursor-pointer items-center gap-2 rounded-lg border border-line bg-surface-2 px-3 py-2 text-sm has-checked:border-accent has-checked:text-accent">
              <input type="radio" name="newStatus" value={o} defaultChecked={i === 0} className="accent-[var(--color-accent)]" />
              {o}
            </label>
          ))}
        </div>
      </fieldset>

      <div>
        <label htmlFor="note" className="mb-1.5 block text-sm font-medium">
          Internal note <span className="text-muted">(optional)</span>
        </label>
        <textarea id="note" name="note" rows={3} maxLength={500} className="field resize-y" placeholder="Visible only to you; stored in the status history." />
      </div>

      {state.status !== "idle" && state.message && (
        <p role={state.status === "error" ? "alert" : "status"} className={state.status === "error" ? "text-sm text-danger" : "text-sm text-accent"}>
          {state.message}
        </p>
      )}

      <button type="submit" className="btn btn-primary" disabled={pending}>
        {pending ? <><Loader2 size={16} className="animate-spin" /> Saving…</> : "Update status"}
      </button>
    </form>
  );
}
