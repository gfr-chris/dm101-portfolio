import Link from "next/link";
import { notFound } from "next/navigation";
import { requireOwner } from "@/lib/auth";
import { TRANSITIONS } from "@/lib/status";
import { INQUIRY_TYPES } from "@/lib/validation";
import { formatDateTime, formatDuration } from "@/lib/utils";
import type { Inquiry, StatusHistoryEntry } from "@/types";
import { Card } from "@/components/ui/primitives";
import { StatusBadge, TestBadge, isTestRecord } from "@/components/admin/StatusBadge";
import { StatusForm } from "@/components/admin/StatusForm";

type Params = Promise<{ id: string }>;
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export default async function InquiryDetail({ params }: { params: Params }) {
  const { id } = await params;
  if (!UUID.test(id)) notFound();
  const { supabase } = await requireOwner();

  const [inq, hist] = await Promise.all([
    supabase.from("inquiries").select("*").eq("id", id).maybeSingle(),
    supabase.from("inquiry_status_history").select("*").eq("inquiry_id", id).order("created_at", { ascending: true }),
  ]);
  if (!inq.data) notFound();

  const r = inq.data as Inquiry;
  const history = (hist.data ?? []) as StatusHistoryEntry[];
  const typeLabel = INQUIRY_TYPES.find((t) => t.value === r.inquiry_type)?.label ?? r.inquiry_type;
  const responseMs = r.first_response_at ? new Date(r.first_response_at).getTime() - new Date(r.created_at).getTime() : null;
  const closureMs = r.closed_at ? new Date(r.closed_at).getTime() - new Date(r.created_at).getTime() : null;
  const mailto = `mailto:${encodeURIComponent(r.email)}?subject=${encodeURIComponent(`Re: ${r.subject}`)}`;

  return (
    <div className="space-y-6">
      <Link href="/admin/inquiries" className="text-sm text-muted hover:text-fg">← All inquiries</Link>

      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h1 className="flex flex-wrap items-center gap-2 text-2xl font-semibold tracking-tight break-words">
            {r.subject} {isTestRecord(r.subject) && <TestBadge />}
          </h1>
          <p className="mt-1 text-sm text-muted">{typeLabel} · received {formatDateTime(r.created_at)}</p>
        </div>
        <StatusBadge status={r.status} />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_22rem]">
        <div className="space-y-6">
          <Card>
            <dl className="grid gap-4 text-sm sm:grid-cols-2">
              <div><dt className="text-xs uppercase tracking-wider text-muted">Name</dt><dd className="mt-1">{r.name}</dd></div>
              <div><dt className="text-xs uppercase tracking-wider text-muted">Email</dt><dd className="mt-1 break-all"><a className="text-accent hover:underline" href={mailto}>{r.email}</a></dd></div>
              <div><dt className="text-xs uppercase tracking-wider text-muted">Organization</dt><dd className="mt-1">{r.organization ?? "—"}</dd></div>
              <div><dt className="text-xs uppercase tracking-wider text-muted">Consent given</dt><dd className="mt-1">{r.consent ? "Yes" : "No"}</dd></div>
            </dl>
            <h2 className="mb-2 mt-6 text-xs uppercase tracking-wider text-muted">Message</h2>
            {/* Rendered as plain text by React (escaped); whitespace preserved. */}
            <p className="whitespace-pre-wrap break-words leading-relaxed">{r.message}</p>
            <a href={mailto} className="btn btn-ghost mt-6 !text-sm">Reply by email</a>
          </Card>

          <Card>
            <h2 className="mb-4 font-semibold">Status history</h2>
            {history.length === 0 ? (
              <p className="text-sm text-muted">No history recorded.</p>
            ) : (
              <ol className="relative space-y-5 border-l border-line pl-5">
                {history.map((h) => (
                  <li key={h.id} className="relative">
                    <span className="absolute -left-[1.6rem] top-1.5 h-2.5 w-2.5 rounded-full bg-accent" aria-hidden />
                    <p className="flex flex-wrap items-center gap-2 text-sm">
                      {h.previous_status ? <><StatusBadge status={h.previous_status} /> <span className="text-muted">→</span></> : <span className="text-muted">Created as</span>}
                      <StatusBadge status={h.new_status} />
                    </p>
                    <p className="mt-1 text-xs text-muted">{formatDateTime(h.created_at)} · {h.changed_by ? "owner" : "system"}</p>
                    {h.note && <p className="mt-1 text-sm text-fg/90">“{h.note}”</p>}
                  </li>
                ))}
              </ol>
            )}
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <h2 className="mb-4 font-semibold">Update status</h2>
            <StatusForm inquiryId={r.id} options={TRANSITIONS[r.status]} />
          </Card>
          <Card>
            <h2 className="mb-3 font-semibold">Process timing</h2>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between gap-3"><dt className="text-muted">Submitted</dt><dd>{formatDateTime(r.created_at)}</dd></div>
              <div className="flex justify-between gap-3"><dt className="text-muted">First response</dt><dd>{formatDateTime(r.first_response_at)}</dd></div>
              <div className="flex justify-between gap-3"><dt className="text-muted">Response time</dt><dd>{formatDuration(responseMs)}</dd></div>
              <div className="flex justify-between gap-3"><dt className="text-muted">Closed</dt><dd>{formatDateTime(r.closed_at)}</dd></div>
              <div className="flex justify-between gap-3"><dt className="text-muted">Closure time</dt><dd>{formatDuration(closureMs)}</dd></div>
            </dl>
          </Card>
        </div>
      </div>
    </div>
  );
}
