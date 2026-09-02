# Deploying to Hostinger

This project has two parts:

- **Storefront** (home, catalog, product pages, search, garage) — a static
  Next.js site. It reads its data from `frontend/lib/data/*` at build time
  and does **not** call the backend at all.
- **`/admin` console** — the only page that talks to the FastAPI backend.

Because of that split, there are two independent deployments below. Do
**Part 1** to get the actual site live — that's almost certainly all you
need. Only do **Part 2** if you specifically want the `/admin` staff
console to work online too.

---

## Part 1 — Storefront on Hostinger (works on any plan, including the cheapest shared plan)

Hostinger's shared/business hosting only serves static files — it doesn't
run a Node.js server. So instead of uploading the source code, you build
the site into plain HTML/CSS/JS on your own computer first, then upload
the *result*.

The repo has already been updated for this (`frontend/next.config.js` now
has `output: 'export'`), so you just need to build and upload.

### Step 1 — Build the static site on your computer
You need [Node.js](https://nodejs.org) (18+) installed locally — this step
does not happen on Hostinger.

```bash
cd frontend
npm install
npm run build
```

This creates a `frontend/out/` folder containing the whole site as plain
`.html`, `.css`, and `.js` files. That `out/` folder is everything Hostinger
needs.

### Step 2 — Get your files onto Hostinger
In [hPanel](https://hpanel.hostinger.com):

1. Go to **Websites** → pick your website (or create one / point a domain
   at your hosting plan if you haven't yet).
2. Open **File Manager** (or use an FTP client like FileZilla with the
   credentials under **Files → FTP Accounts**).
3. Navigate into `public_html/`. Delete the default placeholder files
   Hostinger put there (e.g. `default.php`), if any.
4. Upload **the contents of `frontend/out/`** — not the `out` folder
   itself, its *contents* — directly into `public_html/`. So you should end
   up with `public_html/index.html`, `public_html/catalog/`,
   `public_html/_next/`, etc.
   - Fastest way: zip the contents of `out/` on your computer, upload the
     zip via File Manager, then use File Manager's "Extract" option.

### Step 3 — Turn on SSL
In hPanel: **Websites → your site → SSL** → click **Install** (Hostinger
issues a free certificate on every plan). This project's `.htaccess`
(included in the build output) automatically redirects `http://` to
`https://` once SSL is on.

### Step 4 — Point your domain (if it isn't already)
If you bought the domain through Hostinger, this is usually automatic. If
it's registered elsewhere, add Hostinger's nameservers (or an A record
pointing to your hosting IP) at your registrar — hPanel shows the exact
values under **Domains → DNS / Nameservers**.

### That's it
Visit your domain — the storefront should be fully live: catalog
browsing, product pages, search, vehicle selector, My Garage. None of that
needs the backend.

**Whenever you change the catalog data** (edit `frontend/lib/data/*.ts`),
repeat Steps 1–2: rebuild locally and re-upload the new `out/` contents.

---

## Part 2 (optional) — Making `/admin` work too

`/admin` is a staff tool to add/edit parts and toggle maintenance mode. It
needs the FastAPI backend running somewhere reachable over HTTPS.
**Hostinger's shared/business hosting cannot run FastAPI** (Python on
those plans is limited to basic scripts, not ASGI frameworks) — you'd need
a **Hostinger VPS** plan instead. Also note the backend's data is
in-memory only: anything added via `/admin` disappears on every restart —
there's no database wired up yet.

If you don't need `/admin` right now, skip this section entirely — the
storefront works fine without it.

### 2a — Get a Hostinger VPS
Any KVM plan works. In hPanel's setup wizard, choose the **Ubuntu**
template (skip the Django template — this app uses FastAPI, not Django).

### 2b — SSH in and set up the backend
```bash
ssh root@YOUR_VPS_IP

sudo apt update && sudo apt install -y python3-venv python3-pip nginx

# upload the backend/ folder here first (scp, or git clone your repo), then:
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
pip install gunicorn

# quick test:
uvicorn app.main:app --host 0.0.0.0 --port 8000
# Ctrl+C once you confirm http://YOUR_VPS_IP:8000/api/health returns {"status":"ok"}
```

### 2c — Keep it running with systemd
Create `/etc/systemd/system/mj-backend.service`:
```ini
[Unit]
Description=MJ Logistics FastAPI backend
After=network.target

[Service]
User=root
WorkingDirectory=/root/backend
Environment="CORS_ORIGINS=https://yourdomain.com"
Environment="ADMIN_TOKEN=choose-a-long-random-string-here"
ExecStart=/root/backend/venv/bin/uvicorn app.main:app --host 0.0.0.0 --port 8000
Restart=always

[Install]
WantedBy=multi-user.target
```
Then:
```bash
systemctl daemon-reload
systemctl enable --now mj-backend
```

### 2d — Put Nginx in front of it (for HTTPS)
Point a subdomain (e.g. `api.yourdomain.com`) at the VPS IP in hPanel's DNS
settings, then on the VPS:
```bash
sudo apt install -y certbot python3-certbot-nginx
```
Configure Nginx to reverse-proxy `api.yourdomain.com` → `127.0.0.1:8000`,
then run `sudo certbot --nginx` to get a free SSL certificate for it.

### 2e — Point the frontend at it
Before your `npm run build` in Part 1, create `frontend/.env.production`:
```
NEXT_PUBLIC_API_BASE=https://api.yourdomain.com
```
Rebuild and re-upload `out/` as in Part 1. Now `/admin` (log in with the
`ADMIN_TOKEN` you set above) will reach the live backend.

---

## Quick reference

| What | Where it runs | Hostinger plan needed |
|---|---|---|
| Storefront (everything except `/admin`) | Static files | Any (Single/Premium/Business shared) |
| `/admin` console + FastAPI backend | Python/ASGI server | VPS only |
