import type { Metadata } from "next";
import { goals } from "@/data/portfolio";
import { PageHeader, Card, SectionTitle, Copy } from "@/components/ui/primitives";

export const metadata: Metadata = { title: "Goals in Life" };

const groups = [
  { title: "Short-term", subtitle: "Next 6–12 months", items: goals.shortTerm },
  { title: "Medium-term", subtitle: "Next 2–4 years", items: goals.mediumTerm },
  { title: "Long-term", subtitle: "5–10 years", items: goals.longTerm },
];

export default function GoalsPage() {
  return (
    <>
      <PageHeader eyebrow="Goals in life" title="Where I am heading" lead="Academic, career and personal goals, from near-term to long-term." />
      <div className="grid gap-6 md:grid-cols-3">
        {groups.map((g) => (
          <Card key={g.title}>
            <SectionTitle>{g.title}</SectionTitle>
            <p className="-mt-3 mb-4 font-mono text-xs text-muted">{g.subtitle}</p>
            <ul className="space-y-3">
              {g.items.map((item, i) => (
                <li key={i} className="flex gap-3">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden />
                  <Copy className="text-sm">{item}</Copy>
                </li>
              ))}
            </ul>
          </Card>
        ))}
      </div>
    </>
  );
}
