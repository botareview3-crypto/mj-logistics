# MJ Logistics — RFQ backend

Handles the "Post an RFQ" form on the marketing site and gives you an admin
page to review, triage, and act on submissions.

No dependencies — plain Node. Nothing to `npm install`.

## Run it

```bash
ADMIN_PASSWORD=pick-a-real-password PORT=3001 node server.js
```

- API: `http://localhost:3001/api/rfq`
- Admin UI: `http://localhost:3001/admin`

If you skip `ADMIN_PASSWORD` it falls back to `changeme` and prints a warning
— fine for local testing, not for anything reachable from the internet.

## How it fits together

- `server.js` — the whole backend. Stores RFQs in `data/rfqs.json`.
- `public/admin.html` — the admin page, served at `/admin`.
- `concept-b-two-rivers.html` (the marketing site) — every "Post an RFQ"
  button now opens a modal that `POST`s to `/api/rfq`. The endpoint URL is
  set at the top of the `<script>` block near the bottom of that file
  (`RFQ_API_URL`) — point it at wherever this server ends up living if it's
  not on the same domain as the site.

## API

| Method | Path                    | Auth              | Purpose                        |
|--------|-------------------------|-------------------|---------------------------------|
| POST   | `/api/rfq`               | none (public)     | Submit an RFQ from the site     |
| POST   | `/api/admin/login`       | none              | Check a password before showing the admin UI |
| GET    | `/api/admin/rfqs`        | `X-Admin-Token`   | List all RFQs                   |
| PATCH  | `/api/admin/rfqs/:id`    | `X-Admin-Token`   | Update status and/or notes      |
| DELETE | `/api/admin/rfqs/:id`    | `X-Admin-Token`   | Delete an RFQ                   |

`X-Admin-Token` is just the admin password sent as a header. The admin page
handles this for you — you only need to remember the password.

An RFQ record looks like:

```json
{
  "id": "uuid",
  "createdAt": "2026-08-21T12:00:00.000Z",
  "status": "new",
  "commodity": "gold",
  "company": "Acme Trading",
  "contactName": "Jane Doe",
  "email": "jane@acme.com",
  "phone": "",
  "quantity": "5kg",
  "spec": "0.995 fineness, doré bars",
  "targetPrice": "",
  "notes": ""
}
```

`status` moves through `new → reviewed → quoted → won/lost`, editable from
the admin table.

## Built-in abuse guards

- A hidden honeypot field (`website`) — real visitors never see or fill it;
  bots that fill every field silently get a fake success.
- A simple per-IP rate limit (5 submissions / 10 minutes) on the public
  endpoint.

Both are basic deterrents, not a full defense — see below for what to add
if spam becomes a real problem.

## Before you ship this

This is a solid starting point, not a production-hardened system. Before it
handles real traffic:

1. **Swap the JSON file for a real database** (Postgres, SQLite, etc.) once
   volume grows past what a single file comfortably handles, and so you get
   proper backups.
2. **Replace the password-in-a-header auth** with real sessions/JWTs (or
   just put the `/admin` path and `/api/admin/*` routes behind your normal
   company SSO / VPN) — the current scheme is fine for one or two trusted
   people, not for a real access-control story.
3. **Serve over HTTPS** and set `ALLOWED_ORIGIN` to your actual site domain
   instead of the `*` default.
4. **Add a captcha** (hCaptcha/Turnstile) to the public form if spam gets
   past the honeypot + rate limit.
5. **Send a notification** (email/Slack) on new submissions instead of
   relying on someone refreshing `/admin`.
6. **Back up `data/rfqs.json`** regularly if you stay on the file-based
   store for now.

## Environment variables

| Variable         | Default    | Purpose                                  |
|-------------------|------------|-------------------------------------------|
| `PORT`            | `3001`     | Port the server listens on                |
| `ADMIN_PASSWORD`  | `changeme` | Password for the admin page and API       |
| `ALLOWED_ORIGIN`  | `*`        | CORS origin allowed to call `/api/rfq`    |
