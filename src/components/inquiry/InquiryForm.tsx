"use client";

import { useActionState } from "react";
import { CheckCircle2, Loader2, AlertCircle } from "lucide-react";
import { submitInquiry, type InquiryFormState } from "@/app/actions/submit-inquiry";
import { INQUIRY_TYPES, LIMITS } from "@/lib/validation";

const initial: InquiryFormState = { status: "idle" };

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} role="alert" className="mt-1.5 text-sm text-danger">
      {message}
    </p>
  );
}

export function InquiryForm() {
  const [state, formAction, pending] = useActionState(submitInquiry, initial);
  const err = state.fieldErrors ?? {};
  const v = state.values ?? {};

  if (state.status === "success") {
    return (
      <div role="status" className="rounded-xl border border-accent/40 bg-accent/10 p-6">
        <div className="flex items-start gap-3">
          <CheckCircle2 className="mt-0.5 shrink-0 text-accent" />
          <div>
            <h2 className="text-lg font-semibold">Inquiry received</h2>
            <p className="mt-1 text-fg/90">
              Thank you — your message has been recorded with the status <strong>New</strong>. I will review it and
              reply to the email address you provided. I can’t promise an immediate response, but your inquiry is
              now tracked.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form action={formAction} noValidate className="space-y-5" aria-describedby={state.status === "error" ? "form-error" : undefined}>
      {state.status === "error" && state.message && (
        <div id="form-error" role="alert" className="flex items-start gap-3 rounded-lg border border-danger/40 bg-danger/10 p-4 text-sm">
          <AlertCircle size={18} className="mt-0.5 shrink-0 text-danger" />
          <p>{state.message}</p>
        </div>
      )}

      <div>
        <label htmlFor="inquiry_type" className="mb-1.5 block text-sm font-medium">
          Inquiry type <span className="text-danger">*</span>
        </label>
        <select
          id="inquiry_type"
          name="inquiry_type"
          className="field"
          defaultValue={v.inquiry_type ?? ""}
          aria-invalid={!!err.inquiry_type}
          aria-describedby={err.inquiry_type ? "e-type" : undefined}
          key={`type-${v.inquiry_type ?? ""}`}
        >
          <option value="" disabled>
            Select a type…
          </option>
          {INQUIRY_TYPES.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
        <FieldError id="e-type" message={err.inquiry_type} />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="mb-1.5 block text-sm font-medium">
            Your name <span className="text-danger">*</span>
          </label>
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            maxLength={LIMITS.name.max}
            className="field"
            defaultValue={v.name ?? ""}
            key={`name-${v.name ?? ""}`}
            aria-invalid={!!err.name}
            aria-describedby={err.name ? "e-name" : undefined}
          />
          <FieldError id="e-name" message={err.name} />
        </div>
        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm font-medium">
            Email <span className="text-danger">*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            className="field"
            defaultValue={v.email ?? ""}
            key={`email-${v.email ?? ""}`}
            aria-invalid={!!err.email}
            aria-describedby={err.email ? "e-email" : undefined}
          />
          <FieldError id="e-email" message={err.email} />
        </div>
      </div>

      <div>
        <label htmlFor="organization" className="mb-1.5 block text-sm font-medium">
          Organization <span className="text-muted">(optional)</span>
        </label>
        <input
          id="organization"
          name="organization"
          type="text"
          autoComplete="organization"
          maxLength={LIMITS.organization.max}
          className="field"
          defaultValue={v.organization ?? ""}
          key={`org-${v.organization ?? ""}`}
          aria-invalid={!!err.organization}
        />
        <FieldError id="e-org" message={err.organization} />
      </div>

      <div>
        <label htmlFor="subject" className="mb-1.5 block text-sm font-medium">
          Subject <span className="text-danger">*</span>
        </label>
        <input
          id="subject"
          name="subject"
          type="text"
          maxLength={LIMITS.subject.max}
          className="field"
          defaultValue={v.subject ?? ""}
          key={`subject-${v.subject ?? ""}`}
          aria-invalid={!!err.subject}
          aria-describedby={err.subject ? "e-subject" : undefined}
        />
        <FieldError id="e-subject" message={err.subject} />
      </div>

      <div>
        <label htmlFor="message" className="mb-1.5 block text-sm font-medium">
          Message <span className="text-danger">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          rows={6}
          maxLength={LIMITS.message.max}
          className="field resize-y"
          placeholder="What would you like to discuss? Include any context, timeline or links that help."
          defaultValue={v.message ?? ""}
          key={`message-${v.message ?? ""}`}
          aria-invalid={!!err.message}
          aria-describedby={err.message ? "e-message" : "h-message"}
        />
        <p id="h-message" className="mt-1.5 text-xs text-muted">
          {LIMITS.message.min}–{LIMITS.message.max} characters.
        </p>
        <FieldError id="e-message" message={err.message} />
      </div>

      {/* Spam trap — hidden from people and assistive tech; bots tend to fill it. */}
      <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="website">Leave this field empty</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div>
        <label className="flex items-start gap-3 text-sm">
          <input
            type="checkbox"
            name="consent"
            className="mt-0.5 h-4 w-4 shrink-0 accent-[var(--color-accent)]"
            aria-invalid={!!err.consent}
            aria-describedby={err.consent ? "e-consent" : "h-consent"}
          />
          <span id="h-consent" className="text-fg/90">
            I agree that my name, email and message are stored only so the site owner can respond to this inquiry.
            They are not published or shared.
          </span>
        </label>
        <FieldError id="e-consent" message={err.consent} />
      </div>

      <button type="submit" className="btn btn-primary" disabled={pending}>
        {pending ? (
          <>
            <Loader2 size={16} className="animate-spin" /> Sending…
          </>
        ) : (
          "Send inquiry"
        )}
      </button>
    </form>
  );
}
