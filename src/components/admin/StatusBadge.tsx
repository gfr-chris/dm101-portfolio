import type { InquiryStatus } from "@/types";
import { cn } from "@/lib/utils";

const styles: Record<InquiryStatus, string> = {
  New: "border-accent-2/40 bg-accent-2/10 text-accent-2",
  "In Review": "border-warn/40 bg-warn/10 text-warn",
  Responded: "border-indigo/40 bg-indigo/10 text-indigo",
  Closed: "border-line bg-surface-2 text-muted",
};

export function StatusBadge({ status }: { status: InquiryStatus }) {
  return (
    <span className={cn("inline-block whitespace-nowrap rounded-full border px-2.5 py-0.5 text-xs font-medium", styles[status])}>
      {status}
    </span>
  );
}

export function TestBadge() {
  return (
    <span className="inline-block rounded-md border border-warn/40 bg-warn/10 px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-warn">
      test
    </span>
  );
}

/** Convention from the plan: test records are labelled by a "[TEST]" subject prefix. */
export function isTestRecord(subject: string): boolean {
  return /^\s*\[test\]/i.test(subject);
}
