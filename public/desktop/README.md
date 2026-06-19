# Desktop PDFs (Finder → Desktop)

Drop PDF files here. They appear automatically in Finder’s **Desktop** folder.

Supported: `.pdf` only (not subfolders).

Examples in this repo:

- `FamPay - Copy Intern Assignment.pdf`
- `Content and SM  Pitch deck.pdf`
- `Assignment - wisprflow.pdf`

Preview opens at **40% zoom** with the sidebar hidden by default.

## URL slugs (one word)

When opened in Preview, URLs use a short slug instead of the full path:

| File | URL slug (`/preview?file=…`) |
|------|----------------------------|
| FamPay - Copy Intern Assignment.pdf | `fampay` |
| Assignment - wisprflow.pdf | `wisprflow` |
| Content and SM  Pitch deck.pdf | `pitchdeck` |

Add custom slugs in `lib/desktop-folder.ts` (`DESKTOP_PDF_FILENAME_TO_SLUG`).
