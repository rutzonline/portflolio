# Brand images (Beyond the Desk → brands getting it right)

Brands are loaded from **Supabase** (`brands` table).

## Subsection column

Set **`subsection`** on each row to group brands in the app:

| `subsection` value | UI bucket   |
|--------------------|-------------|
| `d2c`              | d2c         |
| `b2b`              | b2b         |
| `b2b2c`            | b2b2c       |
| `b2c`              | b2c         |

Legacy **`category`** is still read as a fallback if `subsection` is empty.

## Image: URL or local file

| Supabase `image_url` | What happens |
|----------------------|--------------|
| **Set** | Uses that URL (recommended) |
| **Empty** | Looks for a local file below |

Local folder: `public/beyond-desk/brands/`

Filename = slug of the brand **name** + extension (e.g. `notion.png`, `aminu.jpg`).

Extensions tried: `.png`, `.jpg`, `.jpeg`, `.webp`

Recommended: square **512×512** px or similar.
