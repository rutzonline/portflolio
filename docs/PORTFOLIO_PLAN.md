# Portfolio Website — Planning Doc

macOS-faithful portfolio for **Rutuja Rochkari** (Next.js 15, Supabase CMS, desktop shell).

## Architecture

- **Entry:** `/` → lock screen (default) → desktop shell
- **CMS:** Supabase (`notes`, `photos`, `brands`, `campaigns`, `faqs`, `case_studies`, `consumption_logs`)
- **Local content:** Virtual paths under `/Users/rutujarochkari` (TextEdit intro, Preview PDFs)

## Apps

| App | Purpose | Data |
|-----|---------|------|
| Work | Case study cards + markdown detail | `case_studies` |
| Calendar | Consumption log, Cal.com booking, hidden scheduling | `consumption_logs` |
| Notes | Blog | `notes` |
| Photos | Gallery / video | `photos` |
| Misc | Brands, campaigns, FAQs | Misc tables |
| TextEdit | Intro site map (`intro.txt`) | Local sample file |
| Now Playing | Audio mini player | `AudioProvider` (session) |

## Supabase tables (new)

### `case_studies`

Gallery cards: slug, title, gradients, tags (jsonb), body (markdown), `sort_order`, `published`.

### `consumption_logs`

Daily reading log: `consumed_on` (date), `title`, `url`, `category`, `sort_order`, `published`.

RLS: public read where `published = true`.

## Feature summary

1. **Work** — Notion-style horizontal card grid; in-app detail with `react-markdown`.
2. **Calendar** — Default: consumption (calendar/list). Secondary: Cal.com iframe. Hidden: legacy scheduling via ⋯ menu or ⌘⇧C.
3. **Onboarding** — Locked by default; first unlock opens centered TextEdit `intro.txt`.
4. **System** — Dock magnification curve; menu bar Now Playing widget synced when window is closed.

## Config (`config/site.ts`)

- `introDocPath`
- `calBookingUrl` — https://cal.com/rutujarochkari/hi?duration=25

## Migrations

- `supabase/migrations/20260602000000_case_studies.sql`
- `supabase/migrations/20260602000001_consumption_logs.sql`

Apply with Supabase CLI: `supabase db push` (or dashboard SQL).

## Future

- Rich blocks for Work detail
- Remove hidden scheduling mode when consumption UX is final
