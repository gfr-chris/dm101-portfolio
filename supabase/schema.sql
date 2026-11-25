-- ============================================================================
-- DM101 Personal Portfolio Management System — database schema
-- Run once in the Supabase SQL editor (Project → SQL Editor → New query).
-- ============================================================================

-- ---------- Tables ----------------------------------------------------------
create table if not exists public.inquiries (
  id                uuid primary key default gen_random_uuid(),
  name              text not null check (char_length(name) between 2 and 100),
  email             text not null check (char_length(email) between 5 and 254),
  organization      text check (char_length(organization) <= 120),
  inquiry_type      text not null check (inquiry_type in ('project','internship','collaboration','general')),
  subject           text not null check (char_length(subject) between 3 and 150),
  message           text not null check (char_length(message) between 10 and 2000),
  status            text not null default 'New' check (status in ('New','In Review','Responded','Closed')),
  consent           boolean not null check (consent = true),
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),
  first_response_at timestamptz,
  closed_at         timestamptz
);

create table if not exists public.inquiry_status_history (
  id              uuid primary key default gen_random_uuid(),
  inquiry_id      uuid not null references public.inquiries(id) on delete cascade,
  previous_status text check (previous_status in ('New','In Review','Responded','Closed')),
  new_status      text not null check (new_status in ('New','In Review','Responded','Closed')),
  changed_by      uuid,                -- auth.users.id of the owner; NULL = system (initial submission)
  note            text check (char_length(note) <= 500),
  created_at      timestamptz not null default now()
);

create index if not exists inquiries_created_at_idx on public.inquiries (created_at desc);
create index if not exists inquiries_status_idx     on public.inquiries (status);
create index if not exists inquiries_email_idx      on public.inquiries (email, created_at desc);
create index if not exists history_inquiry_idx      on public.inquiry_status_history (inquiry_id, created_at);

-- ---------- Owner check -----------------------------------------------------
-- The owner is the Supabase Auth user whose app_metadata contains {"role":"owner"}.
-- app_metadata can only be changed server-side / from the dashboard, never by the user.
create or replace function public.is_owner()
returns boolean
language sql
stable
as $$
  select coalesce(auth.jwt() -> 'app_metadata' ->> 'role', '') = 'owner';
$$;

-- ---------- Row Level Security ---------------------------------------------
alter table public.inquiries               enable row level security;
alter table public.inquiry_status_history  enable row level security;

-- No policy exists for the `anon` role => anonymous clients cannot select,
-- insert, update or delete anything. Public submissions go through the
-- server-side action (service-role key, server only).
drop policy if exists "owner can read inquiries"   on public.inquiries;
drop policy if exists "owner can update inquiries" on public.inquiries;
drop policy if exists "owner can read history"     on public.inquiry_status_history;
drop policy if exists "owner can add history"      on public.inquiry_status_history;

create policy "owner can read inquiries"
  on public.inquiries for select to authenticated using (public.is_owner());

create policy "owner can update inquiries"
  on public.inquiries for update to authenticated
  using (public.is_owner()) with check (public.is_owner());

create policy "owner can read history"
  on public.inquiry_status_history for select to authenticated using (public.is_owner());

create policy "owner can add history"
  on public.inquiry_status_history for insert to authenticated with check (public.is_owner());

-- Belt and braces: table privileges as well as policies.
revoke all on public.inquiries              from anon, authenticated;
revoke all on public.inquiry_status_history from anon, authenticated;
grant select, update on public.inquiries              to authenticated;
grant select, insert on public.inquiry_status_history to authenticated;

-- ---------- Status change (atomic, validated) ------------------------------
-- Enforces the lifecycle: New → In Review → (Responded | Closed); Responded → Closed.
-- SECURITY INVOKER: RLS still applies to the caller.
create or replace function public.change_inquiry_status(
  p_inquiry_id uuid,
  p_new_status text,
  p_note       text default null
)
returns public.inquiries
language plpgsql
security invoker
set search_path = public
as $$
declare
  cur        public.inquiries;
  prev       text;
  is_allowed boolean;
begin
  if not public.is_owner() then
    raise exception 'Not authorized' using errcode = '42501';
  end if;

  select * into cur from public.inquiries where id = p_inquiry_id for update;
  if not found then
    raise exception 'Inquiry not found' using errcode = 'P0002';
  end if;

  prev := cur.status;
  is_allowed :=
       (prev = 'New'       and p_new_status = 'In Review')
    or (prev = 'In Review' and p_new_status in ('Responded','Closed'))
    or (prev = 'Responded' and p_new_status = 'Closed');

  if not is_allowed then
    raise exception 'Invalid status transition: % -> %', prev, p_new_status using errcode = '22023';
  end if;

  update public.inquiries
     set status            = p_new_status,
         updated_at        = now(),
         first_response_at = case when p_new_status = 'Responded' and first_response_at is null
                                  then now() else first_response_at end,
         closed_at         = case when p_new_status = 'Closed' then now() else closed_at end
   where id = p_inquiry_id
   returning * into cur;

  insert into public.inquiry_status_history (inquiry_id, previous_status, new_status, changed_by, note)
  values (p_inquiry_id, prev, p_new_status, auth.uid(), nullif(btrim(coalesce(p_note, '')), ''));

  return cur;
end;
$$;

revoke execute on function public.change_inquiry_status(uuid, text, text) from public, anon;
grant  execute on function public.change_inquiry_status(uuid, text, text) to authenticated;

-- ---------- Make yourself the owner ----------------------------------------
-- 1) Authentication → Users → Add user (email + password). Turn OFF public sign-ups
--    (Authentication → Sign In / Providers → "Allow new users to sign up").
-- 2) Then run (replace the email):
--
--    update auth.users
--       set raw_app_meta_data = coalesce(raw_app_meta_data, '{}'::jsonb) || '{"role":"owner"}'::jsonb
--     where email = 'you@example.com';
--
-- 3) Sign out and sign in again so the new claim is in your token.
