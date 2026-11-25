import Link from "next/link";
import { profile } from "@/data/portfolio";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-line">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-3 px-5 py-8 text-sm text-muted sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <p>
          © {new Date().getFullYear()} {profile.name}. DM101 Final Project — BPM-connected portfolio.
        </p>
        <div className="flex gap-4">
          <Link href="/contact" className="hover:text-fg">
            Contact
          </Link>
          <Link href="/admin/login" className="hover:text-fg">
            Owner sign-in
          </Link>
        </div>
      </div>
    </footer>
  );
}
