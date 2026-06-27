-- Contact footer: charm counter + anonymous feedback

create table if not exists public.pixel_counter (
  id int primary key,
  count bigint not null default 0
);

insert into public.pixel_counter (id, count)
values (1, 0)
on conflict (id) do nothing;

alter table public.pixel_counter enable row level security;

grant select on table public.pixel_counter to anon;
grant select on table public.pixel_counter to authenticated;
grant all on table public.pixel_counter to service_role;

create policy "allow_public_read_pixel_counter"
on public.pixel_counter
for select
to public
using (true);

create or replace function public.increment_pixel_counter()
returns bigint
language plpgsql
security definer
set search_path = public
as $$
declare
  new_count bigint;
begin
  update public.pixel_counter
  set count = count + 1
  where id = 1
  returning count into new_count;

  return coalesce(new_count, 0);
end;
$$;

grant execute on function public.increment_pixel_counter() to anon;
grant execute on function public.increment_pixel_counter() to authenticated;

create table if not exists public.feedbacks (
  id uuid primary key default gen_random_uuid(),
  message text not null,
  created_at timestamp with time zone not null default now()
);

alter table public.feedbacks enable row level security;

grant insert on table public.feedbacks to anon;
grant insert on table public.feedbacks to authenticated;
grant all on table public.feedbacks to service_role;

create policy "allow_public_insert_feedbacks"
on public.feedbacks
for insert
to public
with check (
  char_length(trim(message)) > 0
  and char_length(trim(message)) <= 2000
);
