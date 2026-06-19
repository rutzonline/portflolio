create table if not exists "public"."creations" (
    "id" uuid not null default gen_random_uuid(),
    "title" text not null,
    "kind" text not null check (kind in ('video', 'image', 'embed', 'link')),
    "url" text not null,
    "thumbnail_url" text,
    "platform" text,
    "sort_order" int not null default 0,
    "published" boolean not null default true,
    "created_at" timestamp with time zone not null default now()
);

alter table "public"."creations" enable row level security;

create unique index if not exists creations_pkey on public.creations using btree (id);
alter table "public"."creations" add constraint "creations_pkey" primary key using index "creations_pkey";

grant select on table "public"."creations" to "anon";
grant select on table "public"."creations" to "authenticated";
grant all on table "public"."creations" to "service_role";

create policy "allow_public_read_creations"
on "public"."creations"
as permissive
for select
to public
using (published = true);
