# Deploying to Render (100% free, no credit card)

This repo is set up to deploy as **two free Render services**, wired together
by the `render.yaml` blueprint at the repo root:

| Service | Type | What it does | Free-tier behavior |
|---|---|---|---|
| `mj-logistics-frontend` | Static Site | The storefront — prebuilt into plain HTML/CSS/JS by `next build` (static export) | Always on, no sleep, no cold start, unlimited |
| `mj-logistics-backend` | Web Service (Python) | Powers only the `/admin` console | Sleeps after 15 min idle (~30-60s cold start on next request); data is **in-memory and resets** on every restart/redeploy |

### Why the backend is optional-ish
The storefront (home, catalog, product pages, search, cart, garage) reads
from `frontend/lib/data/*` at build time — it does **not** call the FastAPI
backend at all. The backend only backs the `/admin` staff console (add/edit
parts, toggle maintenance mode). If you never touch `/admin`, the backend
spinning down after 15 minutes has zero effect on the live site.

Because the backend stores everything in memory, anything added through
`/admin` disappears whenever the free instance restarts (idle sleep, a new
deploy, or a Render-side redeploy). There's no database in this setup. If you
later want admin changes to persist, the natural next step is Render's free
PostgreSQL — but note Render's free Postgres **expires after 30-90 days**
(no permanent free DB tier exists there), so treat that as a future
enhancement, not part of "push this online."

## Steps

1. **Push this code to a GitHub repo** (public or private — Render's free
   tier works with either once you connect your GitHub account, no card
   needed).

2. **On Render:** New → Blueprint → connect the repo. Render will detect
   `render.yaml` and create both services automatically, including:
   - A random `ADMIN_TOKEN` for the backend (find it in that service's
     Environment tab afterward — you'll need it to log into `/admin`)
   - `NEXT_PUBLIC_API_BASE` on the frontend, auto-wired to the backend's URL
   - `CORS_ORIGINS` on the backend, auto-wired to the frontend's URL

3. Click **Apply**. First build takes a few minutes for each service.

4. Visit the frontend's `onrender.com` URL — that's your live storefront.

That's it — no database, no external storage, no paid add-ons, no card.

## Local development (unchanged)
```bash
cd backend && pip install -r requirements.txt && uvicorn app.main:app --reload --port 8000
cd frontend && npm install && npm run dev
```
