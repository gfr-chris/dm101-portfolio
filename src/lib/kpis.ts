import type { Inquiry, InquiryStatus } from "@/types";
import { OPEN_STATUSES, STATUSES } from "@/lib/status";

export interface DurationStats {
  /** number of records the statistic is based on */
  n: number;
  averageMs: number | null;
  medianMs: number | null;
}

export interface Kpis {
  volume: number;
  response: DurationStats;
  closure: DurationStats;
  distribution: Record<InquiryStatus, number>;
}

function stats(durations: number[]): DurationStats {
  const valid = durations.filter((d) => Number.isFinite(d) && d >= 0).sort((a, b) => a - b);
  if (valid.length === 0) return { n: 0, averageMs: null, medianMs: null };
  const sum = valid.reduce((a, b) => a + b, 0);
  const mid = Math.floor(valid.length / 2);
  const median = valid.length % 2 === 0 ? (valid[mid - 1] + valid[mid]) / 2 : valid[mid];
  return { n: valid.length, averageMs: sum / valid.length, medianMs: median };
}

/**
 * KPIs for inquiries *received in the selected range* (rows are expected to be pre-filtered by created_at).
 * - response time = first_response_at − created_at (only records that have a response)
 * - closure time  = closed_at − created_at        (only closed records)
 */
export function computeKpis(rows: Inquiry[]): Kpis {
  const distribution = Object.fromEntries(STATUSES.map((s) => [s, 0])) as Record<InquiryStatus, number>;
  const response: number[] = [];
  const closure: number[] = [];

  for (const r of rows) {
    distribution[r.status] += 1;
    const created = new Date(r.created_at).getTime();
    if (r.first_response_at) response.push(new Date(r.first_response_at).getTime() - created);
    if (r.closed_at) closure.push(new Date(r.closed_at).getTime() - created);
  }

  return { volume: rows.length, response: stats(response), closure: stats(closure), distribution };
}

/** Open workload is a *current* measure, so it is computed over all records, not the date range. */
export function countOpen(statusCounts: Record<InquiryStatus, number>): number {
  return OPEN_STATUSES.reduce((sum, s) => sum + (statusCounts[s] ?? 0), 0);
}
