# Three Star Towers

Website and mobile app for Three Star Towers Limited — premium property development in Mombasa, home of the Rosewood Residences.

| Folder | What it is |
| --- | --- |
| `web/` | Marketing website (Next.js, App Router). Home, developments, residence detail, contact. |
| `mobile/` | iOS + Android app (Expo / React Native, Expo Router). Browse listings, map, saved, contact. |
| `brand/` | Logo (original PNG + vector redraw) and the source renders taken from the Rosewood brochure. |
| `scripts/` | `sync-content.mjs` copies listings and images from the website into the app. |

## Content

All company details, listings, prices and map coordinates live in one file:
`web/src/content/properties.ts`. Images live in `web/public/images/`.

After editing either, copy them into the app:

```bash
node scripts/sync-content.mjs
```

Things to confirm before launch (marked in the content file):

- **Map pins** — every development has `coordsApproximate: true`. The Stadium pin is estimated from the brochure map; the others mark the neighbourhood. Replace with surveyed coordinates and set the flag to `false`.
- **Nyali, Kizingo and Nyali Beach** — listed as "coming soon" with no prices, plans or renders. Fill in `unitTypes`, `gallery`, `hero`, etc. when ready.
- **Prices** — taken from the Rosewood Stadium KES price list (valid to March 2025).

## Website

```bash
cd web
npm install
npm run dev
```

Maps use Leaflet with OpenStreetMap tiles (no API key). The enquiry form has no backend: it opens WhatsApp or the visitor's email app with a pre-filled message to sales.

### Leads, installs and the admin area

The app and the enquiry form post to `/api/leads`, `/api/installs` and `/api/events`; `/admin` shows the
results (sign-in required, hidden from search engines). Production needs these environment variables in Vercel:

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | Postgres connection. Created for you by Vercel > Storage > Neon Postgres. |
| `ADMIN_USER`, `ADMIN_PASSWORD` | The admin sign-in. Never commit these; the repository is public. |
| `SESSION_SECRET` | Any long random string; signs the admin session cookie. |

Tables are created automatically on first use. Locally, with none of these set, an in-process database is
stored in `web/.data` and the sign-in is `admin` / `admin`.

## Mobile app

```bash
cd mobile
npm install
npx expo start
```

Scan the QR code with Expo Go, or press `a` / `i` for an emulator. Store builds are made with EAS (`npx eas-cli build`), which needs an Expo account plus Apple Developer and Google Play accounts.
