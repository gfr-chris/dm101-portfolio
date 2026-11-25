import type { Metadata } from "next";
import { reflection } from "@/data/portfolio";
import { PageHeader, Card, SectionTitle, Copy } from "@/components/ui/primitives";

export const metadata: Metadata = { title: "Personal Reflection" };

const sections = [
  { title: "My learning journey", body: reflection.journey },
  { title: "Challenges and lessons", body: reflection.challenges },
  { title: "Achievements", body: reflection.achievements },
  { title: "What I want to improve", body: reflection.improvements },
  { title: "What this project taught me about BPM", body: reflection.bpmLearning },
];

export default function ReflectionPage() {
  return (
    <>
      <PageHeader eyebrow="Personal reflection" title="What I have learned" lead="Progress, difficulties and the next areas I want to improve." />
      <div className="space-y-6">
        {sections.map((s) => (
          <Card key={s.title}>
            <SectionTitle>{s.title}</SectionTitle>
            <Copy>{s.body}</Copy>
          </Card>
        ))}
      </div>
    </>
  );
}
