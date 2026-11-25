import type { Metadata } from "next";
import { profile } from "@/data/portfolio";
import { PageHeader, Card, SectionTitle, Tag, Copy } from "@/components/ui/primitives";

export const metadata: Metadata = { title: "About" };

export default function AboutPage() {
  return (
    <>
      <PageHeader eyebrow="Basic information" title="About me" lead={profile.intro} />
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <SectionTitle>Education</SectionTitle>
          <ul className="space-y-4">
            {profile.education.map((e) => (
              <li key={e.school}>
                <p className="font-medium">{e.school}</p>
                <p className="text-sm text-muted">{e.detail}</p>
                <Copy className="text-sm">{e.period}</Copy>
              </li>
            ))}
          </ul>
        </Card>
        <Card>
          <SectionTitle>Interests</SectionTitle>
          <div className="flex flex-wrap gap-2">
            {profile.interests.map((i) => (
              <Tag key={i}>{i}</Tag>
            ))}
          </div>
        </Card>
        <Card className="md:col-span-2">
          <SectionTitle>Professional direction</SectionTitle>
          <Copy>{profile.direction}</Copy>
        </Card>
      </div>
    </>
  );
}
