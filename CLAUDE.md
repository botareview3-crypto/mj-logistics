# Notes for Claude — read this before touching this repo

Context for picking this project back up in a fresh conversation. This file
is for AI context, not for the human — see `README.md` for that.

## Current state (Aug 21, 2026)

- GitHub repo: `botareview3-crypto/mj-logistics` (owner uploaded via GitHub's
  web drag-and-drop UI once already, which double-nested the folder — fixed
  by force-pushing a clean local git repo instead. Prefer git push over the
  web upload UI for any future full-repo changes.)
- Deployed on Render as a Blueprint (`render.yaml` at repo root), service
  name `mj-rfq-backend`, live at `https://mj-rfq-backend.onrender.com`.
- `/health` confirmed working. `/admin` confirmed reachable (password-gated,
  password lives only in Render's env vars, not in this repo).
- `site/test-rfq.html` is a deliberate throwaway: single button, no styling
  effort, exists only to confirm the backend round-trip works before the
  real frontend exists. Don't polish it — replace it.
- `site/concept-b-two-rivers.html` is a design concept, not the real/final
  site. Don't treat it as production frontend code without checking with
  the user first.

## Architecture facts worth knowing

- Backend is **dependency-free Node** (`http` built-in, no Express) —
  `mj-rfq-backend/server.js`. Routing is manual `if (pathname === ...)`
  blocks, not a framework. Keep that pattern if adding routes.
- Storage is a flat JSON file (`data/rfqs.json`), write-locked via a promise
  queue (`withWriteLock`) — fine for current volume, called out in the
  backend README as needing a real DB before serious traffic.
- Admin auth is a single shared password compared against `X-Admin-Token`
  header — not sessions/JWT. Also flagged as pre-production-hardening debt.
- CORS: `ALLOWED_ORIGIN` env var, currently `*` in `render.yaml`. Should be
  tightened to the real site's domain once that domain exists — don't do
  this preemptively without the user confirming the domain.
- RFQ POST payload shape (`/api/rfq`): `commodity` (parts|gold|diamond),
  `company`, `contactName`, `email`, `phone`, `quantity`, `spec`,
  `targetPrice`, `notes`, plus a `website` honeypot field that must stay
  empty. Full field/validation detail is in `mj-rfq-backend/README.md` —
  read that file for anything API-related rather than re-deriving it here.

## Working conventions established in this project

- **Session log rule:** every session, before finishing up, add an entry
  to `/AI_SESSION_LOG.md` (newest entry first) summarizing what the user
  asked, what you actually did/found, and any open question left for next
  time. This exists so a fresh conversation picking up this project can
  read one file and know what just happened instead of the human having
  to re-explain it. `CLAUDE.md` (this file) is for durable facts that
  stay true; `AI_SESSION_LOG.md` is the session-by-session timeline —
  don't merge the two.
- Two-README split: `/README.md` = human status/overview,
  `/CLAUDE.md` (this file) = AI working context. Keep both updated when
  something structural changes — don't let them drift out of sync.
- User works in PowerShell on Windows (`C:\Users\HP\Desktop\mj-logistics`
  as local root). Give PowerShell-flavored commands, not bash, unless they
  say otherwise.
- User prefers being handed exact copy-pasteable commands/code with minimal
  narration when doing git/deploy operations.

- User's browser downloads land in `C:\Users\HP\Downloads`; the local repo root is `C:\Users\HP\Desktop\mj-logistics`. When handing over a new/updated file, give the PowerShell command to copy it from Downloads into the right repo subfolder before git add/commit/push.
