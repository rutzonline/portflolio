-- Platform field + strict consumption categories
alter table "public"."consumption_logs"
  add column if not exists "platform" text;

alter table "public"."consumption_logs"
  drop constraint if exists "consumption_logs_category_check";

alter table "public"."consumption_logs"
  add constraint "consumption_logs_category_check"
  check (category in ('video', 'article', 'newsletter', 'post', 'podcast'));

-- Normalize any legacy seed values (no-op if already migrated)
update "public"."consumption_logs" set category = 'video' where category in ('youtube');
update "public"."consumption_logs" set category = 'article' where category in ('doc');
update "public"."consumption_logs" set platform = coalesce(platform, 'Web') where platform is null;

-- Refresh sample rows with strict enum + platform
delete from "public"."consumption_logs" where title like 'Verifying Agentic%' or title like 'The Commodification%' or title like 'Building Growth%' or title like 'YouTube:%' or title like 'Notion API%';

insert into public.consumption_logs (consumed_on, title, url, category, platform, sort_order) values
('2026-05-30', 'Verifying Agentic Development at Scale', 'https://example.com/agentic-dev', 'article', 'Substack', 0),
('2026-05-30', 'The Commodification Of Christianity', 'https://example.com/christianity', 'article', 'Medium', 1),
('2026-05-29', 'Building Growth Loops in B2B SaaS', 'https://example.com/growth-loops', 'newsletter', 'Lenny''s Newsletter', 0),
('2026-05-29', 'Product Marketing Deep Dive', 'https://youtube.com/watch?v=example', 'video', 'YouTube', 1),
('2026-06-02', 'Notion API Documentation', 'https://developers.notion.com', 'article', 'Notion', 0),
('2026-06-01', 'Founder-led growth on X', 'https://x.com/example/status/1', 'post', 'X', 0),
('2026-05-28', 'Acquired: SaaS Metrics', 'https://example.com/podcast/acquired', 'podcast', 'Spotify', 0);
