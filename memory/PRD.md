# PhantomWorx — PRD

## Original problem statement
> "For my company https://preview--phantomworx.lovable.app/ ... Replicate it for a website."

A private brokerage / venture house brand site replicated from a Lovable preview into a full-stack Emergent app (React + FastAPI + MongoDB).

## Architecture
- **Frontend**: React 19 (CRA + Craco), Tailwind CSS, custom CSS variables for the bespoke gold-on-ink palette, Cormorant Garamond serif display + JetBrains Mono for labels, IntersectionObserver-driven reveal animations.
- **Backend**: FastAPI with `/api` prefix, Motor (async MongoDB driver), Pydantic v2 models.
- **Database**: MongoDB collection `inquiries` (stores name, email, origin, intent, room, created_at).
- **No auth, no email integration** (replication scope only — submissions are stored privately).

## User personas
- **The Principal** — affluent or institutional client browsing the brand site, who may submit a discreet inquiry.
- **The House** — PhantomWorx team that will (in future) review inquiries from an admin view.

## Core requirements (static)
- Replicate visual + copy of the Lovable site (dark luxury aesthetic, gold accents, serif display, monospace labels).
- Single-page scroll with anchored nav.
- Working contact form ("Inquire") backed by MongoDB.
- All interactive/visible elements have `data-testid` attributes.

## What's been implemented (2026-06-14)
- ✅ Nav with scroll-blur state, anchor links, mobile menu, "Private Line" CTA
- ✅ Hero ("We work between the rooms most never enter.") with silk-line SVG decoration, gold/cream typography, two CTAs
- ✅ Marquee of ethos phrases (auto-scrolling)
- ✅ Ethos section with editorial copy + featured pull quote
- ✅ Practice — Four disciplines grid (Private Sourcing, Strategic Introductions, Acquisition Consulting, Exclusive Opportunities)
- ✅ Listings — 4 lot cards with status (Available/Reserved), numeric refs, "Inquire Privately"
- ✅ Pillars — Discretion / Composure / Conviction
- ✅ Ventures — 6 venture cards with state + progress (01/06 … 06/06)
- ✅ The Phantom Wire — 3 field notes (links to inquire)
- ✅ House quote ("We don't sell visibility. We sell the absence of it.")
- ✅ Inquire form (name, email, origin, intent, room) → POST `/api/inquiries`, success state with sealed acknowledgement
- ✅ Footer with brand motto, atelier text, correspondence link
- ✅ Backend endpoints: `GET /api/`, `POST /api/inquiries`, `GET /api/inquiries`
- ✅ Tested end-to-end via testing agent — 100% backend, 100% frontend pass

## Prioritized backlog
### P1
- [ ] Admin view to review submitted inquiries (auth-gated)
- [ ] Email notification on new inquiry (Resend or SendGrid)
- [ ] Open Graph + social share card image

### P2
- [ ] Detail pages for individual lots and ventures (NDA-gated reveal)
- [ ] Real "Phantom Wire" CMS / markdown article pages
- [ ] Custom domain + analytics
- [ ] Rate-limit on `/api/inquiries`

### P3
- [ ] Subtle hero ambient video (silk/smoke loop)
- [ ] Light/dark theme variant for press kit pages

## Next tasks
- Optional UX tweak: surface server-side email validation (change `inq-email` type to text or add `novalidate` to form). Not blocking.
- Await user direction for admin dashboard or email-notification feature.
