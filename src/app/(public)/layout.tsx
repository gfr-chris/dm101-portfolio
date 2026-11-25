import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <a
        href="#content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-50 focus:rounded-md focus:bg-accent focus:px-3 focus:py-2 focus:text-[#04201d]"
      >
        Skip to content
      </a>
      <SiteHeader />
      <main id="content" className="mx-auto w-full max-w-5xl px-5 pt-12 sm:px-8 sm:pt-16">
        {children}
      </main>
      <SiteFooter />
    </>
  );
}
