-- Consumption log entries for Calendar app
create table "public"."consumption_logs" (
    "id" uuid not null default gen_random_uuid(),
    "consumed_on" date not null,
    "title" text not null,
    "url" text not null,
    "category" text not null default 'article',
    "sort_order" int not null default 0,
    "published" boolean not null default true,
    "created_at" timestamp with time zone not null default now()
);

alter table "public"."consumption_logs" enable row level security;

create unique index consumption_logs_pkey on public.consumption_logs using btree (id);
create index consumption_logs_consumed_on_idx on public.consumption_logs using btree (consumed_on desc, sort_order asc);

alter table "public"."consumption_logs" add constraint "consumption_logs_pkey" primary key using index "consumption_logs_pkey";

grant select on table "public"."consumption_logs" to "anon";
grant select on table "public"."consumption_logs" to "authenticated";
grant all on table "public"."consumption_logs" to "service_role";

create policy "allow_public_read_consumption_logs"
on "public"."consumption_logs"
as permissive
for select
to public
using (published = true);

-- Sample seed data (adjust dates as needed)
insert into public.consumption_logs (consumed_on, title, url, category, sort_order) values
('2026-05-30', 'Verifying Agentic Development at Scale', 'https://example.com/agentic-dev', 'article', 0),
('2026-05-30', 'The Commodification Of Christianity', 'https://example.com/christianity', 'article', 1),
('2026-05-29', 'Building Growth Loops in B2B SaaS', 'https://example.com/growth-loops', 'newsletter', 0),
('2026-05-29', 'YouTube: Product Marketing Deep Dive', 'https://youtube.com/watch?v=example', 'youtube', 1),
('2026-06-02', 'Notion API Documentation', 'https://developers.notion.com', 'doc', 0);
