import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { profile, projects } from "@/data/portfolio";
import { Card, Tag } from "@/components/ui/primitives";

export default function HomePage() {
  return (
    <div>
      <section className="hero-panel mb-16 sm:mb-20">
        <div className="relative z-10 grid items-center gap-8 md:grid-cols-[minmax(0,1fr)_16rem]">
          <div>
            <p className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-accent">Portfolio · DM101</p>
            <h1 className="text-4xl font-semibold leading-tight tracking-tight sm:text-6xl">
              {profile.name.split(" ").slice(0, -1).join(" ")}{" "}
              <span className="bg-linear-to-r from-accent to-accent-2 bg-clip-text text-transparent">
                {profile.name.split(" ").slice(-1)}
              </span>
            </h1>
            <p className="mt-5 max-w-2xl text-xl leading-relaxed text-muted">{profile.tagline}</p>
            <p className="mt-4 max-w-2xl leading-relaxed text-fg/80">{profile.intro}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/projects" className="btn btn-primary">
                View projects <ArrowRight size={16} />
              </Link>
              <Link href="/about" className="btn btn-ghost">
                About me
              </Link>
              <Link href="/contact" className="btn btn-ghost">
                Send an inquiry
              </Link>
            </div>
          </div>
          <div className="hero-portrait mx-auto w-full max-w-56 md:max-w-none">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[1.05rem]">
              <Image
                src="/profile-photo.png"
                alt={`Professional portrait of ${profile.name}`}
                fill
                priority
                sizes="(max-width: 767px) 224px, 256px"
                className="object-cover object-center"
              />
            </div>
          </div>
        </div>
      </section>

      <section aria-labelledby="featured" className="border-t border-line pt-10">
        <div className="mb-5 flex items-end justify-between">
          <h2 id="featured" className="text-xl font-semibold tracking-tight">
            Selected projects
          </h2>
          <Link href="/projects" className="text-sm text-accent hover:underline">
            All projects →
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          {projects.slice(0, 3).map((p) => (
            <Card key={p.slug} className="flex flex-col gap-3">
              <Tag tone="accent">{p.kind.split("·")[0].trim()}</Tag>
              <h3 className="font-semibold leading-snug">{p.title}</h3>
              <p className="text-sm leading-relaxed text-muted">{p.purpose}</p>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
