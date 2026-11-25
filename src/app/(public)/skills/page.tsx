import type { Metadata } from "next";
import { technicalSkills, toolSkills, softSkills, type Proficiency } from "@/data/portfolio";
import { PageHeader, Card, SectionTitle, Copy } from "@/components/ui/primitives";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Skills & Competencies" };

const levelStyle: Record<Proficiency, { label: string; bars: number }> = {
  beginner: { label: "Beginner — currently learning", bars: 1 },
  developing: { label: "Developing", bars: 2 },
  familiar: { label: "Familiar", bars: 3 },
  comfortable: { label: "Comfortable", bars: 4 },
};

function Level({ level }: { level: Proficiency }) {
  const { label, bars } = levelStyle[level];
  return (
    <div className="flex items-center gap-2" title={label}>
      <div className="flex gap-1" aria-hidden>
        {[1, 2, 3, 4].map((n) => (
          <span key={n} className={cn("h-1.5 w-6 rounded-full", n <= bars ? "bg-accent" : "bg-line")} />
        ))}
      </div>
      <span className="text-xs text-muted">{label}</span>
    </div>
  );
}

export default function SkillsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Skills & competencies"
        title="What I work with"
        lead="Proficiency labels are intentionally honest: what I am comfortable with is kept separate from what I am still learning."
      />
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="md:col-span-2">
          <SectionTitle>Technical skills</SectionTitle>
          <ul className="grid gap-x-8 gap-y-5 sm:grid-cols-2">
            {technicalSkills.map((s) => (
              <li key={s.name}>
                <p className="font-medium">{s.name}</p>
                <Level level={s.level} />
                {s.note && <p className="mt-1 text-sm text-muted">{s.note}</p>}
              </li>
            ))}
          </ul>
        </Card>

        <Card>
          <SectionTitle>Tools</SectionTitle>
          <ul className="space-y-2">
            {toolSkills.map((t, i) => (
              <li key={i}>
                <Copy>{t}</Copy>
              </li>
            ))}
          </ul>
        </Card>

        <Card>
          <SectionTitle>Interpersonal competencies</SectionTitle>
          <ul className="space-y-4">
            {softSkills.map((s, i) => (
              <li key={i}>
                <Copy className="font-medium">{s.name}</Copy>
                <Copy className="text-sm text-muted">{s.example}</Copy>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </>
  );
}
