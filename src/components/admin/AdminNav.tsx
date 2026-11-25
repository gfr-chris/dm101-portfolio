"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Inbox, Workflow, LogOut } from "lucide-react";
import { signOut } from "@/app/actions/auth";
import { cn } from "@/lib/utils";

const items = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/inquiries", label: "Inquiries", icon: Inbox },
  { href: "/admin/process", label: "BPM process", icon: Workflow },
];

export function AdminNav({ email }: { email: string }) {
  const pathname = usePathname();
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-bg/90 backdrop-blur">
      <div className="mx-auto flex min-h-14 w-full max-w-6xl flex-wrap items-center justify-between gap-x-4 gap-y-1 px-5 py-2 sm:px-8">
        <div className="flex items-center gap-5">
          <Link href="/admin" className="font-mono text-xs uppercase tracking-[0.18em] text-accent">Admin</Link>
          <nav aria-label="Admin" className="flex items-center gap-1">
            {items.map(({ href, label, icon: Icon, exact }) => {
              const active = exact ? pathname === href : pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className={cn("flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-sm", active ? "bg-surface-2 text-accent" : "text-muted hover:text-fg")}
                >
                  <Icon size={15} /> <span className="hidden sm:inline">{label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <Link href="/" className="text-muted hover:text-fg">View site</Link>
          <span className="hidden text-muted md:inline">{email}</span>
          <form action={signOut}>
            <button type="submit" className="flex items-center gap-1.5 rounded-md border border-line px-2.5 py-1.5 text-muted hover:text-fg">
              <LogOut size={14} /> Sign out
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
