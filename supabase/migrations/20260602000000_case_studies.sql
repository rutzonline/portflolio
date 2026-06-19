-- Case studies for Work app (Notion-style card grid)
create table "public"."case_studies" (
    "id" uuid not null default gen_random_uuid(),
    "slug" text not null,
    "title" text not null,
    "subtitle" text,
    "description" text not null,
    "icon" text not null default '📋',
    "gradient_from" text not null default '#34C759',
    "gradient_to" text not null default '#FF9500',
    "body" text not null default '',
    "tags" jsonb not null default '[]'::jsonb,
    "sort_order" int not null default 0,
    "published" boolean not null default true,
    "created_at" timestamp with time zone not null default now()
);

alter table "public"."case_studies" enable row level security;

create unique index case_studies_pkey on public.case_studies using btree (id);
create unique index case_studies_slug_key on public.case_studies using btree (slug);
create index case_studies_sort_order_idx on public.case_studies using btree (sort_order);

alter table "public"."case_studies" add constraint "case_studies_pkey" primary key using index "case_studies_pkey";
alter table "public"."case_studies" add constraint "case_studies_slug_key" unique using index "case_studies_slug_key";

grant select on table "public"."case_studies" to "anon";
grant select on table "public"."case_studies" to "authenticated";
grant all on table "public"."case_studies" to "service_role";

create policy "allow_public_read_case_studies"
on "public"."case_studies"
as permissive
for select
to public
using (published = true);

-- Seed data
insert into public.case_studies (slug, title, subtitle, description, icon, gradient_from, gradient_to, body, tags, sort_order) values
(
  'state-plate-d2c',
  'The State Plate - D2C',
  'D2C',
  'The State Plate is an Indian regional food products company…',
  '🍽️',
  '#34C759',
  '#FF3B30',
  E'## Overview\n\nThe State Plate reimagines how regional Indian snacks reach people who crave authentic homemade flavors. I led end-to-end growth and marketing across chef onboarding, discovery feeds, and order flows.\n\n## Key Contributions\n\n- Designed a 3-step chef onboarding that reduced drop-off by 42%\n- Built lifecycle email and push flows for repeat orders\n- Ran usability testing with 40+ participants\n\n## Outcomes\n\n- 4.8★ App Store rating at launch\n- 3× increase in repeat orders within 60 days',
  '[{"label":"Full-Time","color":"green"},{"label":"App growth","color":"teal"},{"label":"Email retention","color":"purple"},{"label":"Offline activations","color":"brown"}]'::jsonb,
  1
),
(
  'liquide-fintech',
  'Liquide - Fintech',
  'Fintech',
  'Liquide is a SEBI registered stock investment platform.',
  '📈',
  '#5AC8FA',
  '#FF9F9A',
  E'## Overview\n\nLiquide lets retail investors follow top performers, copy portfolios, and discuss market moves in a social feed.\n\n## Key Contributions\n\n- Redesigned portfolio cards for clearer gain/loss context\n- Social feed components: posts, reactions, comment threads\n- Influencer and paid social campaign strategy\n\n## Outcomes\n\n- 35% increase in social feed engagement post-redesign\n- Copy Portfolio used by 22% of new users in first week',
  '[{"label":"Internship","color":"purple"},{"label":"Social Media revamp","color":"red"},{"label":"Influencer Marketing","color":"brown"}]'::jsonb,
  2
),
(
  'hopstack-b2b-saas',
  'Hopstack - B2B SaaS',
  'B2B SaaS',
  'Hopstack is an advanced digital warehouse platform based in the US.',
  '📦',
  '#007AFF',
  '#AF52DE',
  E'## Overview\n\nHopstack helps third-party logistics providers manage inventory, pick-pack operations, and shipping at scale.\n\n## Key Contributions\n\n- Marketing & newsletter operations for warehouse operators\n- GTM collateral and case study content\n- Product launch email sequences\n\n## Outcomes\n\n- Onboarded 12 enterprise 3PL clients post-launch\n- Reduced operator training time from 2 days to 4 hours',
  '[{"label":"Internship","color":"purple"},{"label":"Marketing & Newsletter Ops","color":"yellow"}]'::jsonb,
  3
),
(
  'freelance-assignments',
  'Freelance / Assignments',
  'Agency',
  'F&B boutique agency and creative strategy work.',
  '🎬',
  '#1C3A5E',
  '#34C759',
  E'## Overview\n\nFreelance and assignment work across F&B boutique agencies, creative strategy, and CRM case studies.\n\n## Key Contributions\n\n- Creative strategy for brand campaigns\n- CRM case study development\n- Pitch deck and content support\n\n## Outcomes\n\n- Delivered multiple client pitch wins\n- Built reusable case study templates for agency portfolio',
  '[{"label":"Freelance","color":"blue"},{"label":"Creative Strategy","color":"gray"},{"label":"CRM case study","color":"pink"}]'::jsonb,
  4
);
