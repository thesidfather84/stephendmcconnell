# Pre-Launch Content Review — Stephen D. McConnell to approve

Every item below is placeholder, invented, or assumed content written to fill out the site structure. None of it should be treated as verified. Stephen should personally confirm or correct each line before the site goes live.

## Links & contact info
- [ ] `SITE_URL` = `https://stephendmcconnell.com` (`src/lib/site.ts`) — domain not confirmed as registered/owned.
- [ ] `CONTACT_EMAIL` = `contact@stephendmcconnell.com` (`src/lib/site.ts`) — invented address; may not exist or receive mail.
- [ ] `YOUTUBE_CHANNEL_URL` = `https://www.youtube.com/@KidneyTotalHealth` (`src/lib/site.ts`) — confirm this is the correct/current channel handle.
- [ ] `HEALTH_DEFENDER_URL` = `https://www.healthdefender.care/pages/meet-the-team` (`src/lib/site.ts`) — confirm this is the correct current page.
- [ ] All Research & Media items currently link out to the general YouTube channel, not a specific article/video — real per-item URLs (or PDF links) needed once available.

## Credentials & affiliations
- [ ] "MSc" credential and "Lipidemiologist" title, used site-wide (header, About, homepage, `<title>` tags, Person structured data `jobTitle`) — confirm exact wording/spelling Stephen uses professionally.
- [ ] Tagline "Lipidemiologist • Kidney Researcher • Educator" (`src/lib/site.ts`, shown in header/footer/About/Home).
- [ ] Health Defender affiliation, stated on About and the Approach page's niacin section: "Stephen currently contributes educational guidance — including practical information about managing niacin flushing — with Health Defender." Confirm this is accurate and still current.
- [ ] "publication" field for all three Research items is set to "Kidney Total Health" (`src/data/research.ts`) — confirm this is really where these articles were/will be published, vs. a different site, journal, or "self-published."

## Biographical claims (About page + Home page excerpt)
- [ ] "His father's illness set him on a search for answers that led him into the study of kidney disease, lipid metabolism, and cardiovascular health."
- [ ] "Stephen has contributed to published articles."
- [ ] "Today, his educational work continues through Health Defender and the Kidney Total Health YouTube channel."

## Research & Articles page (`src/data/research.ts`)
- [ ] Title: "A Basic Biochemical Approach to Addressing Chronic Kidney Disease" — confirm exact title, author byline, and year (currently placeholder **2023**).
- [ ] Title: "Reversing Chronic Kidney Disease with Niacin and Sodium Bicarbonate" — confirm exact title, author byline, and year (currently placeholder **2024**); confirm summary framing is accurate.
- [ ] Title: "Lipidology Foundations for Kidney Health" — confirm this piece exists as described, or remove it.
- [ ] All "mainTopics" tags per article — confirm accuracy.
- [ ] No PDF links are attached to any article yet.

## Videos & Podcasts page (`src/data/media.ts`)
- [ ] "Welcome to Kidney Total Health" video — confirm title and date (placeholder **2024-01-15**).
- [ ] "Niacin and Sodium Bicarbonate, Explained" video — confirm title and date (placeholder **2024-03-02**).
- [ ] "A Conversation on Lipidology and Kidney Disease" interview — confirm title, actual podcast/show name (currently generic "Podcast Interview"), and date (placeholder **2023-11-10**).
- [ ] No real YouTube video IDs are set, so nothing on this page actually embeds a specific video yet — all cards currently link to the general channel.

## Kidney Health Approach page (`src/data/approach.ts` + niacin section)
Every bullet on this page is a general educational claim Stephen should personally read, not just approve in category:
- [ ] Chronic kidney disease section (2 statements)
- [ ] Kidney function & metabolic health section (2 statements)
- [ ] Niacin research summary statement + full niacin/flushing deep-dive (why niacin, scientific questions, flushing vs. non-flushing, why flushing occurs, dosing/timing/food/hydration guidance, known risks)
- [ ] Sodium bicarbonate research section (2 statements)
- [ ] Lipid metabolism section (2 statements)
- [ ] Blood pressure & vascular health section (2 statements)
- [ ] Nutrition & lifestyle section (2 statements)
- [ ] Patient education section (1 statement)
- [ ] Monitoring & medical supervision section (1 statement)
- [ ] FAQ answers: niacin/CKD cure question, flushing/danger question, sodium bicarbonate question

## Treatment Process page
- [ ] The 8-stage process description — confirm this reflects Stephen's actual educational process and stage order.

## Medical Disclaimer page
- [ ] Full disclaimer text — recommend legal review in addition to Stephen's review.

## Structured data (SEO, not visible on-page)
- [ ] Person schema `knowsAbout` list: Lipidology, Chronic Kidney Disease, Niacin, Nephrology Research (`src/app/layout.tsx`).
- [ ] Person schema `sameAs` only lists the YouTube channel — add other verified profiles (LinkedIn, Health Defender bio, etc.) if desired.

## Assets
- [ ] `public/stephen/stephen-mcconnell.png` has not been added yet — site currently shows an "SM" placeholder avatar everywhere his photo should appear.
