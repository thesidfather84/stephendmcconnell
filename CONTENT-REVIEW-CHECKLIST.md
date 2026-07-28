# Pre-Launch Content Review — Stephen D. McConnell to approve

Two tiers below: items marked **VERIFIED** were confirmed directly from the published sources Stephen provided (fetched and cross-checked against orthomolecular.org and isom.ca). Everything else is still placeholder, invented, or assumed content written to fill out the site structure and needs Stephen's personal confirmation or correction before launch.

## Verified (confirmed from source, spot-check recommended)
- [ ] "Reversing Chronic Kidney Disease with Niacin and Sodium Bicarbonate: Review and Commentary" — authors Stephen McConnell & W. Todd Penberthy, published by Orthomolecular Medicine News Service, October 14, 2021. **VERIFIED** against orthomolecular.org.
- [ ] "A Basic Biochemical Approach to Addressing Chronic Kidney Disease" — authors W. Todd Penberthy, Stephen McConnell, Richard Chern, Chester H. Fox, published in the Journal of Orthomolecular Medicine, Vol. 40, No. 1, March 18, 2025. **VERIFIED** against isom.ca.
- [ ] Both articles' plain-language summaries and key points in `src/data/library.ts` were written from the fetched source content — please confirm they represent the work accurately and aren't oversimplified or overstated.
- [ ] "Stephen's Role" labels ("Lead Author" for the OMNS piece, "Co-Author" for the ISOM piece) were inferred from author-list order on the published source — confirm this is accurate.
- [x] Full name and credentials — "Stephen D. McConnell, BS, MSc-CCP, CIS" — **provided directly by Stephen**, now used site-wide (`SITE_NAME` in `src/lib/site.ts`).
- [x] Professional Credentials section on the About page (roles, PMM LLC, FQHC/Rural Health Clinic consulting, CMS MSSP, ACO/MACRA/MIPS/Direct Contracting experience) — **provided directly by Stephen**, displayed verbatim with only well-established acronyms (CMS, MACRA, MIPS) expanded.
- [x] Contact email `McConSD55@gmail.com` — **provided directly by Stephen**, now live on the Contact page.
- [ ] Mobile number `814-572-1801` — provided by Stephen but **deliberately not published** anywhere on the site (stored as `CONTACT_MOBILE_PRIVATE` in `src/lib/site.ts`, not imported or rendered). Confirm explicitly before adding it to the Contact page.
- [x] Hero portrait image — Stephen confirmed this AI-generated placeholder image is fine to use publicly for now. Flagging again here in case that changes: it is not a real photograph.

## Links & contact info
- [ ] `SITE_URL` = `https://stephendmcconnell.com` (`src/lib/site.ts`) — domain not confirmed as registered/owned.
- [ ] `YOUTUBE_CHANNEL_URL` = `https://www.youtube.com/@KidneyTotalHealth` (`src/lib/site.ts`) — confirm this is the correct/current channel handle.
- [ ] `HEALTH_DEFENDER_URL` = `https://www.healthdefender.care/pages/meet-the-team` (`src/lib/site.ts`) — confirm this is the correct current page.
- [ ] ResearchGate links (article page and profile page) could not be fetched/verified directly — both returned HTTP 403. Confirm both URLs are correct and current: `researchgate.net/publication/376352949_...` and `researchgate.net/profile/Stephen-Mcconnell-2`.
- [ ] All Videos & Podcasts (`src/data/media.ts`) items still link to the general YouTube channel, not a specific video — real per-item URLs needed once available.

## Credentials & affiliations
- [ ] Compact tagline "Lipid Specialist • Kidney Researcher" (`SITE_TAGLINE`, used in the header/footer where space is tight) is a shortened selection from Stephen's full title list, not an abbreviation of any individual credential — confirm this selection is acceptable, or specify a preferred short form.
- [ ] "CIS" and "MSc-CCP" credential abbreviations are displayed exactly as given, unexpanded (no confident, verifiable expansion was available) — confirm this is correct as-is or supply the expansion.
- [ ] Health Defender affiliation, stated on About and the Approach page's niacin section: "Stephen currently contributes educational guidance — including practical information about managing niacin flushing — with Health Defender." Confirm this is accurate and still current.
- [ ] "More than two decades" of kidney disease research (About page) — please confirm this timeframe is correct.

## Biographical claims (About page + Home page excerpt)
- [ ] "His father's illness set him on a search for answers that led him into the study of kidney disease, lipid metabolism, and cardiovascular health." (Consistent with the personal narrative referenced in the verified OMNS article, but not independently confirmed beyond that.)
- [ ] "Stephen has contributed to published articles." (Now backed by the two verified Research Library entries above.)
- [ ] "Today, his educational work continues through Health Defender and the Kidney Total Health YouTube channel."

## Research Library (`src/data/library.ts`)
- [ ] Third entry, the ResearchGate profile link, has no independently verified bio details (page could not be fetched) — only the link itself and its category are asserted.
- [ ] No PDF is attached to either article yet (`pdfUrl` field is empty) — add if Stephen has a distributable copy.
- [ ] Only 3 entries exist. Any further research, articles, videos, podcasts, or interviews Stephen wants included must be supplied by him, not invented — the data file's `status: "coming-soon" | "awaiting-review"` values exist for this purpose.

## Videos & Podcasts page (`src/data/media.ts`)
- [ ] "Welcome to Kidney Total Health" video — confirm title and date (placeholder **2024-01-15**).
- [ ] "Niacin and Sodium Bicarbonate, Explained" video — confirm title and date (placeholder **2024-03-02**).
- [ ] "A Conversation on Lipidology and Kidney Disease" interview — confirm title, actual podcast/show name (currently generic "Podcast Interview"), and date (placeholder **2023-11-10**).
- [ ] No real YouTube video IDs are set, so nothing on this page actually embeds a specific video yet.

## Kidney Health Approach page (`src/data/approach.ts` + niacin section)
Every bullet on this page is a general educational claim Stephen should personally read, not just approve in category:
- [ ] Chronic kidney disease section (2 statements)
- [ ] Kidney function & metabolic health section (2 statements)
- [ ] Niacin research summary statement + full niacin/flushing deep-dive (why niacin, flushing vs. non-flushing, why flushing occurs, dosing/timing/food/hydration guidance, known risks)
- [ ] Sodium bicarbonate research section (2 statements)
- [ ] Lipid metabolism section (2 statements)
- [ ] Blood pressure & vascular health section (2 statements)
- [ ] Nutrition & lifestyle section (2 statements)
- [ ] Patient education section (1 statement)
- [ ] Monitoring & medical supervision section (1 statement)
- [ ] FAQ answers (niacin approach, flushing management, sodium bicarbonate role)

## Treatment Process page
- [ ] The 8-stage process description — confirm this reflects Stephen's actual educational process and stage order.

## Medical Disclaimer page
- [ ] Full disclaimer text — recommend legal review in addition to Stephen's review.

## Structured data (SEO, not visible on-page)
- [ ] Person schema `knowsAbout` list: Lipidology, Chronic Kidney Disease, Niacin, Nephrology Research (`src/app/layout.tsx`).
- [ ] Person schema `sameAs` only lists the YouTube channel — add ResearchGate and other verified profiles if desired.

## Assets
- [x] `public/images/stephen/stephen-hero.png` (+ `.webp`) added and in use on the homepage hero and About page. This is an AI-generated placeholder image, not a real photograph — replace with an actual photo whenever one is available.
