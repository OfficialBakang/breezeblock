# Breezeblock Cafe website

Next.js 16 · React 19 · TypeScript · Tailwind 4 · Motion · Lucide · Keystatic (owner admin).

## Run it

    npm install
    npm run dev            # http://localhost:3000
    npm run build && npm start

## Before launch (needs the cafe)

1. **Photos and logo.** Run `npm run fetch-photos` on a machine that can reach breezeblock.co.za
   to pull in the cafe's own published coffee, pancake and event photos and its logo.
   The hero, courtyard, interior and gallery photos must be supplied by the cafe (or taken from its
   Instagram with permission). Until then those slots show a clearly labelled "Photo to come" panel.
   Upload them in the admin: **Key photographs** and **Gallery photos**.
2. **Enquiry email.** Set `RESEND_API_KEY` and `ENQUIRY_FROM` (see `.env.example`).
3. **Confirm with Portia:** does 071 239 2038 take WhatsApp? If yes, tick it in
   **Business information** and venue-hire buttons switch from email to WhatsApp.
4. **Verify the general number** 078 175 2556 takes WhatsApp (reservation buttons use it).
5. Confirm prices are current. The menu was copied exactly from breezeblock.co.za/menu on 2026-10-31.
6. Check the business details against the Google Business Profile.

## Owner admin

Everything editable lives in `/content` as JSON and is edited at `/keystatic`:
business info and hours, announcement banner, menu (prices, items, "currently available" switch),
photos, gallery, events, page text.

* Locally: `npm run dev` then open `/keystatic`. No login.
* On the live site: Keystatic's GitHub mode (set the `KEYSTATIC_*` variables and
  `NEXT_PUBLIC_KEYSTATIC_GITHUB_REPO`). The owner logs in with GitHub, each save is a commit, and the
  host redeploys. Follow https://keystatic.com/docs/github-mode.

## Notes

* Content is read in `src/lib/content.ts` only. Pages never hard-code business details.
* Structured data (Restaurant + LocalBusiness) is built from the same content in `src/lib/schema.ts`.
* Menu text deviation from the source: "chorizo (110)" is shown as R110 (the source omitted the R).
* Reduced-motion preferences are honoured. Parallax and reveals switch off.
