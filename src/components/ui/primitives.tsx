import { cn } from "@/lib/utils";

export function Container({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn("mx-auto w-full max-w-5xl px-5 sm:px-8", className)}>{children}</div>;
}

export function PageHeader({ eyebrow, title, lead }: { eyebrow?: string; title: string; lead?: string }) {
  return (
    <header className="page-heading mb-10 border-b border-line pb-8">
      {eyebrow && (
        <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-accent">{eyebrow}</p>
      )}
      <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h1>
      {lead && <p className="mt-3 max-w-2xl text-lg leading-relaxed text-muted">{lead}</p>}
    </header>
  );
}

export function Card({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn("glass-card rounded-xl border border-line bg-surface p-5 sm:p-6", className)}>{children}</div>;
}

export function Tag({ children, tone = "default" }: { children: React.ReactNode; tone?: "default" | "accent" }) {
  return (
    <span
      className={cn(
        "inline-block rounded-md border px-2 py-0.5 font-mono text-xs",
        tone === "accent" ? "border-accent/40 bg-accent/10 text-accent" : "border-line bg-surface-2 text-muted",
      )}
    >
      {children}
    </span>
  );
}

export function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="mb-4 text-xl font-semibold tracking-tight">{children}</h2>;
}

/** Renders copy; text still containing an [EDIT] placeholder is shown in amber italics so it can't be missed. */
export function Copy({ children, className }: { children: string; className?: string }) {
  const isDraft = children.includes("[EDIT]");
  return (
    <p className={cn("leading-relaxed", isDraft ? "text-warn/90 italic" : "text-fg/90", className)}>{children}</p>
  );
}
