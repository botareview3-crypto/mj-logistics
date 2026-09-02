# Chat History

A running log of what was discussed and built each session. Appended by
Claude at the end of sessions where real work happened — not a full
transcript, just the gist.

---

### 2026-09-02
- Set up the project for free deployment on Render: static-exported the
  Next.js frontend (`next.config.js` → `output: 'export'`, `trailingSlash:
  true`, `images.unoptimized: true`), confirmed the storefront doesn't
  depend on the FastAPI backend at all (only `/admin` does), and added
  `render.yaml` as a Blueprint that creates both services and wires their
  URLs together automatically.
- Established the working rulebook (`CLAUDE.md`): PowerShell-only commands,
  the zip → copy → commit → push flow, and history-tracking files.
- Local folder (`C:\Users\HP\mj-logistics`) had diverged from the GitHub
  repo, so the first push starts with a full local reset (fresh clone)
  rather than an incremental copy.
- Zemen decided to deploy via **Hostinger** instead of (or in addition to)
  Render. Added `frontend/public/.htaccess` (force HTTPS, gzip, asset
  caching, 404 routing — gets copied into `out/` by `next build` since it
  lives under `public/`) and `HOSTINGER-DEPLOY.md`, which documents two
  independent paths: Part 1, building `frontend/out/` locally and uploading
  it to Hostinger shared/business hosting for the storefront (works on any
  plan, no card needed); Part 2 (optional), running the FastAPI backend on
  a Hostinger VPS via systemd + Nginx + certbot so `/admin` also works
  live, since shared hosting can't run FastAPI/ASGI apps.
- Zemen confirmed the final split: Hostinger hosts the storefront (already
  paying for Business Web Hosting + the `.com` domain), Render's free tier
  hosts only the `/admin` backend, and nothing else gets paid for (no
  Hostinger VPS, no Render static site).
- Render's Blueprint deploy failed on the static frontend service
  (`services[1].plan: no such plan free for service type web` — the
  `runtime: static` service doesn't accept a `plan` key). Since that
  service isn't needed anyway (Hostinger hosts the frontend), removed it
  from `render.yaml` entirely and hardcoded `CORS_ORIGINS` to
  `https://mjlogisticsenterprise.com` instead of wiring it to the removed
  service via `fromService`. `render.yaml` now defines a single backend
  service. Updated `CLAUDE.md`'s "Deployed on Render" line to match.
- Backend build failed on Render: `pip install` tried to build
  `pydantic-core==2.23.4` from source with maturin/Rust and hit a
  read-only filesystem error. Cause was that Render, with no Python
  version pinned, defaulted to a very new interpreter (3.14) that has no
  prebuilt wheel for that pydantic-core release, forcing a source build.
  First fix attempt (`backend/runtime.txt`) didn't take — Render doesn't
  actually support `runtime.txt` (that's a Heroku-only convention); the
  build kept using 3.14 and failed the same way. Corrected fix: removed
  `runtime.txt` and instead pinned Python via the two methods Render does
  support — a `PYTHON_VERSION: 3.12.7` env var added to `render.yaml`
  (highest precedence) and a `backend/.python-version` file containing
  `3.12.7` as a backup. 3.12.7 is a version pydantic-core 2.23.4 ships
  prebuilt wheels for, so the build should install from a wheel instead
  of compiling.
- Confirmed the Render backend deploy succeeded — installed from prebuilt
  cp312 wheels, no source build, service came up live at
  `https://mj-logistics-backend-7crs.onrender.com`. The `HEAD / 404` in
  the boot log is just Render's own health check hitting `/`, which the
  API doesn't define a route for — harmless.
- Caught that `HOSTINGER-DEPLOY.md` was stale: it still documented a
  Hostinger-VPS path for `/admin` even though the backend now runs on
  Render. Also found a real gap — Part 1 (the path Zemen actually uses)
  never told the frontend build where the Render backend lives, so
  `/admin` would silently fall back to `http://localhost:8000` in the
  live site. Rewrote the doc: Part 1 now includes a step to create
  `frontend/.env.production` with `NEXT_PUBLIC_API_BASE` pointed at the
  Render URL before `npm run build`; Part 2 (the VPS walkthrough) is
  relabeled as legacy/reference-only, not part of the current setup.

### 2026-09-02 (later same day)
- Walked through the live backend deploy with Zemen: `/admin` and `/`
  404 as expected (no HTML routes defined, API is JSON-only under `/api/*`
  and `/docs`); confirmed `/api/health`, `/api/site/settings`, `/docs` all
  work correctly on `mj-logistics-backend-7crs.onrender.com`.
- Zemen wants to preview the storefront UI before committing to the
  Hostinger upload flow, so re-added the `mj-logistics-frontend` static
  site to `render.yaml` as a **temporary** second service — explicit,
  session-scoped override of the "no Render static site" decision above;
  Hostinger is still the intended final home once the UI is approved.
  This time wired `CORS_ORIGINS` and `NEXT_PUBLIC_API_BASE` between the two
  services via `fromService` / `RENDER_EXTERNAL_URL` (per the automatic-
  wiring convention in `CLAUDE.md`) instead of hardcoding URLs, and left
  off the `plan` key on the static service per the prior known failure.
