# Campaign images (Beyond the Desk → Campaigns)

Campaigns are loaded from **Supabase** (`campaigns` table). Add rows in the dashboard — they appear automatically.

## Image: URL or local file

| Supabase `image_url` | What happens |
|----------------------|--------------|
| **Set** | Uses that URL |
| **Empty** | Looks for a local file below |

Local folder: `public/beyond-desk/campaigns/`

Filename = the campaign **`slug`** column + extension (not the title).

Examples:

| `slug` in Supabase | Local file |
|--------------------|------------|
| `dont-buy-jacket` | `dont-buy-jacket.jpg` |
| `dirt-series` | `dirt-series.png` |
| `really-good-emails` | `really-good-emails.jpg` |

Card labels use the **`title`** column.

Extensions tried: `.png`, `.jpg`, `.jpeg`, `.webp`

Recommended: landscape **16:9**, at least **640×360** px.
