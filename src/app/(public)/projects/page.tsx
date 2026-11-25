import type { Metadata } from "next";
import { ExternalLink } from "lucide-react";
import { projects } from "@/data/portfolio";
import { PageHeader, Card, Tag, Copy } from "@/components/ui/primitives";

export const metadata: Metadata = { title: "Projects" };

export default function ProjectsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Projects & experience"
        title="Things I have built"
        lead="Each entry states the problem, my role and what I personally contributed."
      />
      <div className="space-y-6">
        {projects.map((p) => (
          <Card key={p.slug} className="space-y-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="text-xl font-semibold leading-snug">{p.title}</h2>
                <p className="mt-1 text-sm text-muted">{p.kind}</p>
              </div>
              <div className="flex gap-2">
                {p.repoUrl && (
                  <a className="btn btn-ghost !px-3 !py-1.5 !text-sm" href={p.repoUrl} target="_blank" rel="noopener noreferrer">
                    Repository <ExternalLink size={14} />
                  </a>
                )}
                {p.demoUrl && (
                  <a className="btn btn-ghost !px-3 !py-1.5 !text-sm" href={p.demoUrl} target="_blank" rel="noopener noreferrer">
                    Demo <ExternalLink size={14} />
                  </a>
                )}
              </div>
            </div>

            {p.image && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={p.image} alt={`Screenshot of ${p.title}`} className="w-full rounded-lg border border-line" loading="lazy" />
            )}

            <dl className="grid gap-5 sm:grid-cols-2">
              <div>
                <dt className="mb-1 font-mono text-xs uppercase tracking-wider text-accent">Problem</dt>
                <dd className="text-sm leading-relaxed text-fg/90">{p.problem}</dd>
              </div>
              <div>
                <dt className="mb-1 font-mono text-xs uppercase tracking-wider text-accent">Purpose</dt>
                <dd className="text-sm leading-relaxed text-fg/90">{p.purpose}</dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="mb-1 font-mono text-xs uppercase tracking-wider text-accent">My role</dt>
                <dd>
                  <Copy className="text-sm">{p.role}</Copy>
                </dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="mb-1 font-mono text-xs uppercase tracking-wider text-accent">Contribution</dt>
                <dd>
                  <ul className="list-disc space-y-1 pl-5 text-sm leading-relaxed text-fg/90 marker:text-accent">
                    {p.contribution.map((c) => (
                      <li key={c}>{c}</li>
                    ))}
                  </ul>
                </dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="mb-2 font-mono text-xs uppercase tracking-wider text-accent">Stack</dt>
                <dd className="flex flex-wrap gap-2">
                  {p.stack.map((s) => (
                    <Tag key={s}>{s}</Tag>
                  ))}
                </dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="mb-1 font-mono text-xs uppercase tracking-wider text-accent">Evidence / status</dt>
                <dd className="text-sm text-muted">{p.evidence}</dd>
              </div>
            </dl>
          </Card>
        ))}
      </div>
    </>
  );
}
