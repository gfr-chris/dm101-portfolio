import type { Metadata } from "next";
import { PageHeader, Card } from "@/components/ui/primitives";
import { InquiryForm } from "@/components/inquiry/InquiryForm";

export const metadata: Metadata = { title: "Contact" };

export default function ContactPage() {
  return (
    <>
      <PageHeader
        eyebrow="Contact / inquiry"
        title="Send an inquiry"
        lead="Choose a category and tell me what you need. Every valid inquiry is recorded and tracked until it is closed."
      />
      <div className="grid gap-8 lg:grid-cols-[1fr_18rem]">
        <InquiryForm />
        <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          <Card>
            <h2 className="mb-2 font-semibold">How it works</h2>
            <ol className="list-decimal space-y-1.5 pl-5 text-sm text-muted marker:text-accent">
              <li>Your inquiry is validated.</li>
              <li>It is stored with a timestamp and the status “New”.</li>
              <li>You see a confirmation.</li>
              <li>I review it and update its status.</li>
            </ol>
          </Card>
          <Card>
            <h2 className="mb-2 font-semibold">Privacy</h2>
            <p className="text-sm leading-relaxed text-muted">
              Only the details needed to reply are collected, and they are visible only to the site owner.
            </p>
          </Card>
        </aside>
      </div>
    </>
  );
}
