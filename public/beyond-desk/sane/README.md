# Things keeping me sane (Beyond the Desk)

One image per activity. Filename = slug of the activity **label** + extension.

Supported: `.png`, `.jpg`, `.jpeg`, `.webp` (`.png` tried first).

Examples (match labels in Supabase `beyond_the_desk`):

| File | Label example |
|------|----------------|
| `reading-fiction.jpg` | reading (fiction) |
| `scrappp-journaling.jpg` | scrappp journaling |
| `premier-league.jpg` | premier league |
| `max-never-dies.jpg` | max never dies |
| `all-forms-of-media.jpg` | all forms of media |
| `cocokingg.jpg` | cocokingg |

Slug rules: lowercase, apostrophes removed, spaces/symbols → hyphens.

Local images are used when Supabase `image_url` is empty. When `image_url` is set, that URL is loaded first (faster when files are not in this folder).

Recommended: landscape **16:9**, at least **640×360** px.
