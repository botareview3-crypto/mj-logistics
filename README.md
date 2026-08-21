# MJ Logistics

## Status (as of Aug 21, 2026)

- ✅ Backend live on Render: `https://mj-rfq-backend.onrender.com`
  - `/health` → `{"ok":true}`
  - `/admin` → password-gated RFQ dashboard (password is the `ADMIN_PASSWORD`
    env var set in Render, not stored in this repo)
- ✅ `site/test-rfq.html` — a throwaway mock page with a single "Post an RFQ"
  button, wired to the live backend. Use it to confirm submissions land in
  `/admin` before the real frontend is ready.
- ⏳ Real marketing site frontend — not delivered yet. `site/concept-b-two-rivers.html`
  is a concept/draft, not final.

## What happens when the real frontend arrives

1. Drop the real site file(s) into `site/`.
2. Find the "Post an RFQ" button(s) on the real page and point them at the
   same `RFQ_API_URL` used in `site/test-rfq.html`
   (`https://mj-rfq-backend.onrender.com/api/rfq`).
3. Delete or archive `site/test-rfq.html` — it was only a wiring check.
4. Tighten `ALLOWED_ORIGIN` in `render.yaml` from `*` to the real site's
   domain, then redeploy.

## Repo layout

```
mj-logistics/
├── render.yaml              # Render Blueprint config for the backend
├── mj-rfq-backend/          # Node backend — see its own README.md for API docs
│   ├── server.js
│   ├── public/admin.html
│   └── data/rfqs.json       # gitignored, local dev only
└── site/
    ├── concept-b-two-rivers.html   # draft/concept, not final
    └── test-rfq.html               # mock test button, temporary
```

## Deploying

Backend deploys via Render Blueprint (`render.yaml` at repo root) — push to
`main` and Render auto-syncs. See `mj-rfq-backend/README.md` for the API
reference and local dev instructions.
