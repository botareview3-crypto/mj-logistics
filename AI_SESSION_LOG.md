# AI session log

Running log of what Claude actually did in each working session on this
repo, newest entry first. Purpose: if this project gets picked up in a
**new/fresh conversation**, that Claude (or the human) can read this file
and know what just happened without the human having to re-explain it.

This is different from `CLAUDE.md`: `CLAUDE.md` holds durable facts about
the project (architecture, conventions, current state). This file holds a
timeline of session-by-session actions — investigations, changes made,
open questions left for next time. Keep entries short; link to the actual
diffs/files instead of pasting code here.

---

## 2026-08-22 — Added a plain button-based backend test page

**Prompt:** User asked for a simple page to test the backend system —
just the buttons, nothing fancy — after realizing the site pages had
never actually been deployed anywhere with a real URL.

**What I did:**
- `mj-rfq-backend/server.js`: added a `/test` route (mirrors the existing
  `/admin` static-serve pattern) that serves a new `public/test.html`.
- `mj-rfq-backend/public/test.html`: unstyled page with buttons to hit
  `/health`, submit a throwaway `/api/rfq` payload, register a random
  test account, log in with it, check `/api/auth/me`, and log out — each
  button prints the raw JSON response on the page. No CSS effort by
  design, matches the spirit of the existing `site/test-rfq.html`
  throwaway.
- Verified locally: `/test` returns 200, `/health` responds, and a
  sample RFQ POST succeeds end-to-end.
- Once deployed, this will be reachable at
  `https://mj-rfq-backend.onrender.com/test` — the first time either
  backend feature (RFQ or auth) has had an actual live URL to click
  through, as opposed to only being testable via curl or a local file.

## 2026-08-22 — Added Sign in / Sign up (site) + Users tab (Admin)

**Prompt:** User asked for a working sign in/sign up button on the site
that also logs the profile into Admin, files delivered as a zip, and a
standing rule to rename the zip every time.

**What I did:**
- `mj-rfq-backend/server.js`: added a real account system — a separate
  `data/users.json` store (own write-lock queue, doesn't block RFQ
  writes), scrypt password hashing (`hashPassword`/`verifyPassword`,
  salted, timing-safe compare), and in-memory bearer-token sessions
  (`sessions` Map, 30-day TTL — cleared on server restart, same tradeoff
  already accepted for the admin password). New routes: `POST
  /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me`, `POST
  /api/auth/logout`, and `GET /api/admin/users` (admin-token gated,
  returns every signed-up profile sorted by most recent activity — no
  password hashes exposed). Also split the rate limiter into two buckets
  (`rateLimitHits` for `/api/rfq`, `authRateLimitHits` for the new auth
  routes) via a shared `checkRateLimit(map, ip, max)` helper so auth
  attempts can't burn the RFQ submission quota or vice versa.
- `site/concept-b-two-rivers.html`: the previously-decorative "Sign in"
  link in the nav is now a real trigger for a Sign in / Sign up modal
  (same visual language as the existing RFQ modal — tabs instead of two
  separate modals). On success the token is stored in `localStorage`
  (`mj_auth_token`) and the nav swaps to an account menu (first name +
  company + Sign out) that also resumes automatically on page reload via
  `/api/auth/me`. Did **not** touch `site/test-rfq.html` — `CLAUDE.md`
  flags it as a deliberate throwaway not meant to be polished; say the
  word if you want the same button there too.
- `mj-rfq-backend/public/admin.html`: added an "RFQs / Users" tab
  switcher above the existing toolbar. New Users tab lazy-loads
  `/api/admin/users` on first click and lists signup date, company,
  contact + email, phone, last login, and login count, with its own
  search filter. No changes to the existing RFQ table/logic.
- Verified end-to-end against a local run of the updated server:
  register → user appears correctly in `/api/admin/users` → login updates
  `lastLoginAt`/`loginCount` → bad password correctly rejected → admin
  route correctly 401s without the token. All three inline `<script>`
  blocks (site ×2, admin ×1) pass `node -c` syntax checks.
- Added the "rename the zip every time" rule to `CLAUDE.md` under
  Working conventions — a prior session's log claimed to add this but it
  never actually landed in the file; fixed that.

**Open items for next time:** admin password and now user passwords are
both still simple/shared-style auth (no real DB, in-memory sessions reset
on restart) — flagged in `server.js` comments as pre-production debt,
consistent with what was already called out for the admin password.
`site/test-rfq.html` was intentionally left without the auth button.

## 2026-08-21 — Investigating admin/test-page field mismatch

**Prompt:** User uploaded the repo zip plus a screenshot of `/admin`
showing 2 RFQ rows, and said some content from `site/test-rfq.html`
submissions ("spec, notes, phone, etc.") doesn't match what shows up in
the admin panel.

**What I did:**
- Unzipped and reviewed `mj-rfq-backend/server.js`,
  `mj-rfq-backend/public/admin.html`, and `site/test-rfq.html`.
- Traced the field path end to end: `test-rfq.html`'s submit handler
  builds a payload with `phone`, `spec`, `targetPrice`, `notes` and posts
  it to `/api/rfq`; `server.js`'s `validateRfqInput` cleans/stores all of
  those fields on the record; `admin.html` renders `phone`, `targetPrice`,
  `spec`, `notes` inside the **expandable detail row** (click the ▸ arrow
  on the left of each row) — they are intentionally not shown as columns
  in the main collapsed table row, which is why the screenshot (a
  collapsed view) doesn't show them.
- Did not find an actual data-loss/mismatch bug in this pass — the code
  as written stores and displays all submitted fields correctly *when a
  row is expanded*. Flagged this back to the user and asked exactly what
  mismatch they're seeing (blank/wrong values after expanding a row? or
  expecting these fields as visible columns instead of behind the
  expand arrow?) before changing anything, since I can't reach the live
  Render deployment or the user's actual submitted values from here.
- Added this file and a pointer rule in `CLAUDE.md` (see "Working
  conventions" there) so future sessions keep this log updated.

**Resolution:** not a data bug — the ▸ expand arrow was just too small/
easy to miss (user didn't notice it existed, thought Status dropdown was
the relevant control). Data itself displays fine once expanded.


## 2026-08-21 — Admin UI spacing/modernization pass

**Prompt:** User confirmed the row-click expand works, then asked for a
general spacing/polish pass on `/admin` to feel more modern.

**What I did — all in `mj-rfq-backend/public/admin.html`, CSS only
(no markup structure or JS logic changes beyond class names already in
place from the previous session):**
- Added a small design-token layer: `--radius-sm/md/lg`, `--shadow-sm/md`,
  `--ease`, plus a `--line-soft` for lighter internal dividers — kept the
  existing brand palette (paper bg, ink, gold/terracotta, blue) as-is.
- Toolbar and table now sit in raised white cards (`border-radius`,
  `box-shadow`) instead of flat-on-paper; increased outer/section spacing
  (`main` padding 24→32px top, toolbar margin 18→24px) for more breathing
  room.
- Table cell padding increased (12→16/18px), header letter-spacing
  slightly wider, row hover uses a smooth 120ms transition.
- `row-new` changed from a full pale-pink row fill to a 3px inset gold
  left-edge accent bar — reads as "new" without fighting the hover state
  or making rows feel like error/warning rows.
- Status `<select>` restyled as a proper pill (custom SVG chevron,
  rounded-full, no native arrow) instead of a plain browser dropdown.
- Detail panel (expand row) given more generous padding, uppercase mono
  micro-labels for Phone/Target price/Spec/Notes, wider grid gap.
- Buttons/inputs got consistent focus rings (box-shadow glow instead of
  hard outline) and a subtle press-scale on `:active`.
- Header bar is now translucent + `backdrop-filter: blur` on scroll,
  login card and empty-state got shadow/radius to match the new system.
- Added a `@media (max-width:640px)` pass tightening padding and
  collapsing the two-column detail grid to one column.
- No HTML structure, IDs, or JS behavior changed — safe drop-in
  replacement for the file from the previous session.

**Next step for user:** copy `admin.html` into
`mj-rfq-backend/public/admin.html`, commit, push; Render auto-deploys.

## 2026-08-21 — Added output-filename rule

**Prompt:** User asked for a standing rule: always name handed-over files
differently from the previous one, so a new download doesn't silently
overwrite the prior version sitting in their Downloads folder.

**What I did:** Added a "Output filename rule" bullet under Working
conventions in `CLAUDE.md`, scoped to disposable Downloads-folder copies
of iterated deliverables (e.g. `admin.html`) — explicitly carved out this
repo's own fixed-name docs (`CLAUDE.md`, `AI_SESSION_LOG.md`, `README.md`),
which are meant to be replaced in place under their real name.

