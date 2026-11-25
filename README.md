# Personal Portfolio Management System — DM101 Final Project

A responsive personal portfolio that demonstrates **Business Process Management** through a measurable
visitor → inquiry → owner-review workflow, with a private owner dashboard.

**Stack:** Next.js 16 (App Router) · React 19 · TypeScript 6 · Tailwind CSS 4 · Supabase (PostgreSQL + Auth + RLS) · @xyflow/react 13 · Vercel

---

## 1. What is built (vs. the project plan)

| Plan module | Status | Where |
|---|---|---|
| Home, About, Skills, Projects, Goals, Reflection | ✅ | `src/app/(public)/*`, content in `src/data/portfolio.ts` |
| Contact / inquiry form (validation, confirmation, privacy notice) | ✅ | `components/inquiry/InquiryForm.tsx`, `app/actions/submit-inquiry.ts` |
| Admin login, dashboard, inquiry list/filter/detail, status update + history | ✅ | `src/app/admin/*` |
| BPM page: As-Is / To-Be diagrams, roles, decisions, outputs, KPI definitions | ✅ | `/admin/process`, `components/process/ProcessFlow.tsx` |
| KPI dashboard from real records, with period + small-sample labels | ✅ | `/admin`, `lib/kpis.ts` |
| What-if simulation (*Could*) | ⏭ not built (optional stretch) | — |

## 2. Setup

```bash
npm install
cp .env.example .env.local      # then fill in the 3 values (step 3)
npm run dev                      # http://localhost:3000
```

### Step 3 — Supabase
1. Create a Supabase project.
2. **SQL Editor →** paste and run `supabase/schema.sql` (safe to re-run).
3. **Project Settings → API:** copy the URL, the publishable/anon key and the `service_role` key into `.env.local`.
   The service-role key is **server-only** (used just by the inquiry submit action) — never prefix it with `NEXT_PUBLIC_`, never commit it.
4. **Authentication → Users → Add user** (your email + password). Then turn **off** public sign-ups
   (Authentication → Sign In / Providers → *Allow new users to sign up*).
5. Make that user the owner — run in the SQL editor (use your email):
   ```sql
   update auth.users
      set raw_app_meta_data = coalesce(raw_app_meta_data,'{}'::jsonb) || '{"role":"owner"}'::jsonb
    where email = 'you@example.com';
   ```
6. Sign in at `/admin/login` (sign out/in once if you were already signed in, so the claim reaches your token).

### Fill in your own content
Open `src/data/portfolio.ts`. Everything marked **`[EDIT]`** is a placeholder only you can write truthfully
(skill levels, goals, reflection, your exact role in each project). Placeholders show in amber on the site.
Before deploying run:

```bash
npm run check:content     # fails until every [EDIT] is replaced
```

Add project screenshots to `public/projects/` and set `image: "/projects/name.png"` on the project.

## 3. How the security model works
- **RLS is enabled** on both tables and there is **no policy for `anon`** → anonymous clients cannot read, insert, update or delete.
- Public submissions go through a **server action** that validates with Zod, rate-limits (3/email/hour, 40 total/hour), checks a honeypot field, then inserts with the server-only service key.
- The **owner** is the Supabase user whose `app_metadata.role = 'owner'` (users cannot edit `app_metadata`). The same check runs in: the database (`is_owner()` in every policy), every admin page/action (`lib/auth.ts`), and `proxy.ts` (early redirect only).
- Status changes call the database function `change_inquiry_status`, which **atomically** validates the allowed transition, stamps `first_response_at` / `closed_at`, and writes the history row.

## 4. Status lifecycle
`New → In Review → Responded → Closed` (and `In Review → Closed`). `Closed` is terminal in this release.

## 5. KPIs
Computed from stored records in `lib/kpis.ts`. The dashboard always shows the reporting period and warns when fewer than 10 inquiries exist.
**Test data:** prefix the subject with `[TEST]` — those records get a "test" badge and are counted in the small-sample note.
Never present test figures as real results in your demo; say so.

## 6. Demo script (plan §8.1)
1. Show the public sections → 2. explain the As-Is problem (`/admin/process`) → 3. submit an invalid form, then a valid `[TEST]` inquiry
→ 4. sign in and open it → 5. move it New → In Review → Responded → Closed and show the history → 6. show the To-Be diagram and the KPIs.

## 7. Acceptance checklist (plan §8)
| ID | How to verify |
|---|---|
| AC-01 | Resize the browser / use device emulation on every public page; no sideways scroll |
| AC-02 | Visit About, Skills, Projects, Goals, Reflection |
| AC-03 | Submit with empty fields, bad email, no consent → field-level errors, nothing stored |
| AC-04 | Submit valid → row in `inquiries` with `status='New'` + confirmation shown |
| AC-05 | Signed out, open `/admin` → redirected to `/admin/login` |
| AC-06 | Sign in → inquiries visible; a different Supabase user without the owner role is refused |
| AC-07 | Change status → `status` updates and a row appears in `inquiry_status_history` |
| AC-08 | `/admin` KPIs + period label |
| AC-09 | Using only the anon key against the REST API (`/rest/v1/inquiries`) returns no rows / permission error |
| AC-10 | `/admin/process` |

## 8. Deploy (Vercel)
Push to GitHub → import in Vercel → add the 3 environment variables → deploy. Then **test AC-05, AC-06 and AC-09 on the live URL before sharing it**.
Pin the Node.js version in Vercel to a current LTS. Commit `package-lock.json`; don't upgrade majors mid-project.

## 9. Notes / deliberate choices
- UI primitives are small hand-written components (no shadcn CLI step); Lucide icons are used as planned.
- Recharts is not used — the status distribution is a simple CSS bar chart (plan: cards are enough for the MVP).
- `typescript` is pinned to `~6.0.3` to match the plan even though a newer major exists on npm.
- An initial system-generated history row (`∅ → New`) is written on submission so every inquiry's trail starts at the form.
- No email notifications are sent; the owner uses the "Reply by email" link on the detail page.
