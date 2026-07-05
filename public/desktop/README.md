# Desktop PDFs (Finder → Desktop)

Drop PDF files here. They appear automatically in Finder’s **Desktop** folder.

Supported: `.pdf` only (not subfolders).

Examples in this repo:

- `FamPay - Copy`
- `Content and SM  Pitch deck`
- `Assignment - wisprflow`

Preview opens at **40% zoom** with the sidebar hidden by default.

## URL slugs (one word)

When opened in Preview, URLs use a short slug instead of the full path:

| File | URL slug (`/preview?file=…`) |
|------|----------------------------|
| FamPay - Copy | `fampay` |
| Assignment - wisprflow | `wisprflow` |
| Content and SM  Pitch deck | `pitchdeck` |

Add custom slugs in `lib/desktop-folder.ts` (`DESKTOP_PDF_FILENAME_TO_SLUG`).
