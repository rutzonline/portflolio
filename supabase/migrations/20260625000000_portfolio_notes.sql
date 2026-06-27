-- Anonymous contact notes (feedback form on resume contact page)

create table if not exists public.portfolio_notes (
  id uuid primary key default gen_random_uuid(),
  content text not null,
  created_at timestamp with time zone not null default now()
);

alter table public.portfolio_notes enable row level security;

grant insert on table public.portfolio_notes to anon;
grant insert on table public.portfolio_notes to authenticated;
grant all on table public.portfolio_notes to service_role;

drop policy if exists "allow_public_insert_portfolio_notes" on public.portfolio_notes;

create policy "allow_public_insert_portfolio_notes"
on public.portfolio_notes
for insert
to public
with check (
  char_length(trim(content)) > 0
  and char_length(trim(content)) <= 2000
);
