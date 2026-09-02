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
  live, since shared hosting can't run FastAPI/ASGI apps. `CLAUDE.md`'s
  "Deployed on Render" line hasn't been updated yet — flagged to Zemen to
  confirm whether Hostinger replaces Render or the two coexist.
