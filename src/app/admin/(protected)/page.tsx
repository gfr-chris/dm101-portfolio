import Link from "next/link";
import { requireOwner } from "@/lib/auth";
import { computeKpis, countOpen } from "@/lib/kpis";
import { STATUSES } from "@/lib/status";
import { formatDate, formatDateTime, formatDuration, toDateInput } from "@/lib/utils";
import type { Inquiry, InquiryStatus } from "@/types";
import { Card } from "@/components/ui/primitives";
import { StatusBadge, TestBadge, isTestRecord } from "@/components/admin/StatusBadge";

const DAY = 24 * 60 * 60 * 1000;
const ROW_LIMIT = 1000;
const SMALL_SAMPLE = 10;

type SP = Promise<{ from?: string; to?: string }>;

function parseDate(v: string | undefined, fallback: Date): Date {
  if (v && /^\d{4}-\d{2}-\d{2}$/.test(v)) {
    const d = new Date(`${v}T00:00:00+08:00`); // Asia/Manila
    if (!Number.isNaN(d.getTime())) return d;
  }
  return fallback;
}

function Kpi({ label, value, hint }: { label: string; value: string; hint: string }) {
  return (
    <Card className="!p-4">
      <p className="text-xs uppercase tracking-wider text-muted">{label}</p>
      <p className="mt-2 text-3xl font-semibold tracking-tight text-accent">{value}</p>
      <p className="mt-1.5 text-xs leading-relaxed text-muted">{hint}</p>
    </Card>
  );
}

export default async function AdminDashboard({ searchParams }: { searchParams: SP }) {
  const { supabase } = await requireOwner();
  const sp = await searchParams;

  const now = new Date();
  const to = parseDate(sp.to, new Date(toDateInput(now) + "T00:00:00+08:00"));
  const from = parseDate(sp.from, new Date(to.getTime() - 29 * DAY));
  const toExclusive = new Date(to.getTime() + DAY);

  const [rangeRes, statusRes, recentRes] = await Promise.all([
    supabase
      .from("inquiries")
      .select("*")
      .gte("created_at", from.toISOString())
      .lt("created_at", toExclusive.toISOString())
      .order("created_at", { ascending: false })
      .limit(ROW_LIMIT),
    supabase.from("inquiries").select("status"),
    supabase.from("inquiries").select("*").order("created_at", { ascending: false }).limit(5),
  ]);

  const loadError = rangeRes.error ?? statusRes.error ?? recentRes.error;
  const rows = (rangeRes.data ?? []) as Inquiry[];
  const kpis = computeKpis(rows);

  const allCounts = Object.fromEntries(STATUSES.map((s) => [s, 0])) as Record<InquiryStatus, number>;
  for (const r of statusRes.data ?? []) allCounts[r.status as InquiryStatus] += 1;
  const open = countOpen(allCounts);
  const totalAll = Object.values(allCounts).reduce((a, b) => a + b, 0);
  const testInRange = rows.filter((r) => isTestRecord(r.subject)).length;
  const recent = (recentRes.data ?? []) as Inquiry[];
  const maxBar = Math.max(1, ...Object.values(kpis.distribution));

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
          <p className="mt-1 text-sm text-muted">
            Reporting period: <strong className="text-fg">{formatDate(from.toISOString())}</strong> to{" "}
            <strong className="text-fg">{formatDate(to.toISOString())}</strong> (Asia/Manila)
          </p>
        </div>
        <form method="get" className="flex flex-wrap items-end gap-3">
          <label className="text-xs text-muted">
            From
            <input type="date" name="from" defaultValue={toDateInput(from)} className="field mt-1 !w-auto !py-1.5" />
          </label>
          <label className="text-xs text-muted">
            To
            <input type="date" name="to" defaultValue={toDateInput(to)} className="field mt-1 !w-auto !py-1.5" />
          </label>
          <button type="submit" className="btn btn-ghost !py-1.5">Apply</button>
        </form>
      </div>

      {loadError && (
        <p role="alert" className="rounded-lg border border-danger/40 bg-danger/10 p-3 text-sm text-danger">
          Could not load inquiries: {loadError.message}. Check that supabase/schema.sql has been run and that your account has the owner role.
        </p>
      )}

      {kpis.volume < SMALL_SAMPLE && !loadError && (
        <p className="rounded-lg border border-warn/30 bg-warn/5 p-3 text-sm text-warn/90">
          Small dataset: only {kpis.volume} inquir{kpis.volume === 1 ? "y" : "ies"} in this period. Averages and medians
          are shown for demonstration and should not be treated as reliable trends.
          {testInRange > 0 && ` ${testInRange} of them ${testInRange === 1 ? "is a" : "are"} labelled [TEST].`}
        </p>
      )}

      <section aria-label="Key performance indicators" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Kpi label="Inquiry volume" value={String(kpis.volume)} hint="Valid inquiries received in the selected period." />
        <Kpi label="Open inquiries" value={String(open)} hint={`New + In Review, across all ${totalAll} records (current workload).`} />
        <Kpi
          label="Response time"
          value={formatDuration(kpis.response.medianMs)}
          hint={kpis.response.n ? `Median of ${kpis.response.n} responded · average ${formatDuration(kpis.response.averageMs)}` : "No responded inquiries in this period yet."}
        />
        <Kpi
          label="Closure time"
          value={formatDuration(kpis.closure.medianMs)}
          hint={kpis.closure.n ? `Median of ${kpis.closure.n} closed · average ${formatDuration(kpis.closure.averageMs)}` : "No closed inquiries in this period yet."}
        />
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <h2 className="mb-4 font-semibold">Status distribution <span className="font-normal text-muted">(inquiries in period)</span></h2>
          <ul className="space-y-3">
            {STATUSES.map((s) => (
              <li key={s} className="grid grid-cols-[6.5rem_1fr_2rem] items-center gap-3 text-sm">
                <StatusBadge status={s} />
                <div className="h-2 overflow-hidden rounded-full bg-surface-2">
                  <div className="h-full rounded-full bg-linear-to-r from-accent to-accent-2" style={{ width: `${(kpis.distribution[s] / maxBar) * 100}%` }} />
                </div>
                <span className="text-right tabular-nums">{kpis.distribution[s]}</span>
              </li>
            ))}
          </ul>
        </Card>

        <Card>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold">Most recent</h2>
            <Link href="/admin/inquiries" className="text-sm text-accent hover:underline">View all →</Link>
          </div>
          {recent.length === 0 ? (
            <p className="text-sm text-muted">No inquiries yet. Submit one from the public Contact page to test the flow.</p>
          ) : (
            <ul className="divide-y divide-line">
              {recent.map((r) => (
                <li key={r.id}>
                  <Link href={`/admin/inquiries/${r.id}`} className="flex items-center justify-between gap-3 py-2.5 hover:text-accent">
                    <span className="min-w-0">
                      <span className="flex items-center gap-2 truncate text-sm font-medium">
                        {r.subject} {isTestRecord(r.subject) && <TestBadge />}
                      </span>
                      <span className="block truncate text-xs text-muted">{r.name} · {formatDateTime(r.created_at)}</span>
                    </span>
                    <StatusBadge status={r.status} />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      {rows.length >= ROW_LIMIT && (
        <p className="text-xs text-muted">Showing KPIs for the most recent {ROW_LIMIT} inquiries in this period.</p>
      )}
    </div>
  );
}
