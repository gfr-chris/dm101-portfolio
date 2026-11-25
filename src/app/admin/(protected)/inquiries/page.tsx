import Link from "next/link";
import { requireOwner } from "@/lib/auth";
import { STATUSES, isStatus } from "@/lib/status";
import { INQUIRY_TYPES } from "@/lib/validation";
import { formatDateTime } from "@/lib/utils";
import type { Inquiry } from "@/types";
import { StatusBadge, TestBadge, isTestRecord } from "@/components/admin/StatusBadge";

type SP = Promise<{ q?: string; status?: string; type?: string }>;
const LIMIT = 200;

export default async function InquiriesPage({ searchParams }: { searchParams: SP }) {
  const { supabase } = await requireOwner();
  const sp = await searchParams;

  const status = sp.status && isStatus(sp.status) ? sp.status : "";
  const type = INQUIRY_TYPES.find((t) => t.value === sp.type)?.value ?? "";
  // strip characters that have meaning inside PostgREST filter syntax / LIKE patterns
  const q = (sp.q ?? "").replace(/[%,()*\\]/g, " ").trim().slice(0, 80);

  let query = supabase.from("inquiries").select("*").order("created_at", { ascending: false }).limit(LIMIT);
  if (status) query = query.eq("status", status);
  if (type) query = query.eq("inquiry_type", type);
  if (q) query = query.or(`name.ilike.%${q}%,email.ilike.%${q}%,subject.ilike.%${q}%`);

  const { data, error } = await query;
  const rows = (data ?? []) as Inquiry[];
  const typeLabel = (v: string) => INQUIRY_TYPES.find((t) => t.value === v)?.label ?? v;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Inquiries</h1>
        <p className="mt-1 text-sm text-muted">Search and filter every inquiry received through the website.</p>
      </div>

      <form method="get" className="grid gap-3 sm:grid-cols-[1fr_auto_auto_auto]">
        <input type="search" name="q" defaultValue={q} placeholder="Search name, email or subject…" className="field" aria-label="Search inquiries" />
        <select name="status" defaultValue={status} className="field sm:!w-40" aria-label="Filter by status">
          <option value="">All statuses</option>
          {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <select name="type" defaultValue={type} className="field sm:!w-48" aria-label="Filter by type">
          <option value="">All types</option>
          {INQUIRY_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
        </select>
        <button type="submit" className="btn btn-ghost">Filter</button>
      </form>

      {error && <p role="alert" className="rounded-lg border border-danger/40 bg-danger/10 p-3 text-sm text-danger">Could not load inquiries: {error.message}</p>}

      <div className="overflow-x-auto rounded-xl border border-line">
        <table className="w-full min-w-[40rem] text-left text-sm">
          <thead className="bg-surface text-xs uppercase tracking-wider text-muted">
            <tr>
              <th className="px-4 py-3 font-medium">Received</th>
              <th className="px-4 py-3 font-medium">From</th>
              <th className="px-4 py-3 font-medium">Subject</th>
              <th className="px-4 py-3 font-medium">Type</th>
              <th className="px-4 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {rows.length === 0 && (
              <tr><td colSpan={5} className="px-4 py-10 text-center text-muted">No inquiries match.</td></tr>
            )}
            {rows.map((r) => (
              <tr key={r.id} className="hover:bg-surface/60">
                <td className="whitespace-nowrap px-4 py-3 text-muted">{formatDateTime(r.created_at)}</td>
                <td className="px-4 py-3"><span className="block font-medium">{r.name}</span><span className="text-xs text-muted">{r.email}</span></td>
                <td className="px-4 py-3">
                  <Link href={`/admin/inquiries/${r.id}`} className="flex items-center gap-2 font-medium text-accent hover:underline">
                    {r.subject} {isTestRecord(r.subject) && <TestBadge />}
                  </Link>
                </td>
                <td className="px-4 py-3 text-muted">{typeLabel(r.inquiry_type)}</td>
                <td className="px-4 py-3"><StatusBadge status={r.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {rows.length >= LIMIT && <p className="text-xs text-muted">Showing the {LIMIT} most recent matches — narrow the filters to see others.</p>}
    </div>
  );
}
