import type { Metadata } from "next";
import Link from "next/link";
import { LoginForm } from "./LoginForm";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export const metadata: Metadata = { title: "Owner sign-in", robots: { index: false, follow: false } };

export default function LoginPage() {
  return (
    <main className="mx-auto grid min-h-dvh w-full max-w-sm place-content-center px-5">
      <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-accent">Admin area</p>
      <h1 className="mb-6 text-2xl font-semibold tracking-tight">Owner sign-in</h1>
      {!isSupabaseConfigured() && (
        <p className="mb-5 rounded-lg border border-warn/40 bg-warn/10 p-3 text-sm text-warn">
          Supabase environment variables are not set. See the README (Setup → step 3).
        </p>
      )}
      <LoginForm />
      <Link href="/" className="mt-8 text-sm text-muted hover:text-fg">
        ← Back to portfolio
      </Link>
    </main>
  );
}
