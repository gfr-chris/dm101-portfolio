import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { requireOwner } from "@/lib/auth";
import { STATUSES, TRANSITIONS, STATUS_MEANING } from "@/lib/status";
import { asIsSteps, toBeSteps, bpmConcepts, processElements, kpiDefinitions } from "@/data/process";
import { Card } from "@/components/ui/primitives";
import { StatusBadge } from "@/components/admin/StatusBadge";
import Link from "next/link";

export const metadata: Metadata = { title: "BPM Process & Analysis" };

const ProcessFlow = dynamic(() => import("@/components/process/ProcessFlow").then((m) => m.ProcessFlow), {
  loading: () => <div className="grid h-[470px] place-items-center rounded-xl border border-line text-sm text-muted">Loading process diagram…</div>,
});

function Table({ head, rows }: { head: string[]; rows: React.ReactNode[][] }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-line">
      <table className="w-full min-w-[32rem] text-left text-sm">
        <thead className="bg-surface-2 text-xs uppercase tracking-wider text-muted">
          <tr>{head.map((h) => <th key={h} className="px-4 py-2.5 font-medium">{h}</th>)}</tr>
        </thead>
        <tbody className="divide-y divide-line">
          {rows.map((r, i) => (
            <tr key={i}>{r.map((c, j) => <td key={j} className="px-4 py-2.5 align-top">{c}</td>)}</tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default async function ProcessPage() {
  await requireOwner();
  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">BPM process &amp; analysis</h1>
        <p className="mt-1 max-w-3xl text-muted">
          The business process behind this portfolio: a visitor discovers the site, evaluates the owner, submits an inquiry and
          receives confirmation; the owner reviews and manages it. Measured results are on the{" "}
          <Link href="/admin" className="text-accent hover:underline">dashboard</Link>.
        </p>
      </div>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Process models</h2>
        <ProcessFlow />
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">As-Is process <span className="font-normal text-muted">— informal contact (illustrative baseline)</span></h2>
        <Table head={["Step", "Current activity", "Possible problem"]} rows={asIsSteps.map((s) => [s.step, s.activity, <span key="p" className="text-danger/90">{s.problem}</span>])} />
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">To-Be process <span className="font-normal text-muted">— structured website workflow</span></h2>
        <Table head={["Step", "Activity / rule", "Role", "System result"]} rows={toBeSteps.map((s) => [s.step, s.activity, s.role, s.result])} />
        <Card className="border-accent/30 bg-accent/5 !p-4 text-sm">
          <strong className="text-accent">Expected improvement.</strong> The To-Be workflow does not promise an immediate response. It improves completeness,
          traceability, organization and the ability to measure the process.
        </Card>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Process elements</h2>
        <Table head={["Element", "In this process"]} rows={processElements.map((p) => [<strong key="e">{p.element}</strong>, p.detail])} />
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Inquiry status lifecycle</h2>
        <Table
          head={["Status", "Meaning", "Allowed next status"]}
          rows={STATUSES.map((s) => [
            <StatusBadge key={s} status={s} />,
            STATUS_MEANING[s],
            TRANSITIONS[s].length ? TRANSITIONS[s].join(" or ") : <span key="n" className="text-muted">None (terminal)</span>,
          ])}
        />
        <p className="text-sm text-muted">Transitions are enforced in the database; every change writes a history entry (previous status, new status, who, when, optional note).</p>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Key performance indicators</h2>
        <Table head={["KPI", "Definition / calculation", "What it tells the owner"]} rows={kpiDefinitions.map((k) => [<strong key="k">{k.kpi}</strong>, k.definition, k.tells])} />
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">BPM concepts applied</h2>
        <Table head={["Concept", "How this project demonstrates it"]} rows={bpmConcepts.map((c) => [<strong key="c">{c.concept}</strong>, c.how])} />
      </section>
    </div>
  );
}
