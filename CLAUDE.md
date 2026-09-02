# CLAUDE.md — Working rules for this project

This file documents how Claude and the project owner (Zemen) work
together on MJ Logistics. Read this first in any new session before
making changes.

## Project basics

- Local folder: `C:\Users\HP\mj-logistics`
- GitHub repo: `https://github.com/botareview3-crypto/mj-logistics` (branch: `main`)
- Deployed on Render (two services from `render.yaml`: a static site for the
  storefront, a free Python web service for the `/admin` API — auto-deploys
  from `main` once the Blueprint is connected)
- Stack: FastAPI backend (Python, in-memory data, no DB) + Next.js frontend
  (App/Pages Router, built as a static export — `next build` produces plain
  HTML/CSS/JS, no Node server needed in production)
- File storage: none. The backend's catalog/admin data lives in memory only
  and resets on every restart or redeploy. There is no cloud storage
  provider configured. If persistence is ever needed, that's a future
  decision (e.g. Render Postgres), not something currently wired up.

## The shell is always PowerShell

Zemen works on Windows. **Every command given for local execution — from
unzipping a delivered file all the way through to `git push` — must be
PowerShell syntax**, never syntax from another shell. That covers things like:

- `Expand-Archive` (not `unzip`)
- `Copy-Item` (not `cp`)
- `Remove-Item` (not `rm`)
- `D:\Chrome_Downloads\...` style paths (Zemen's confirmed downloads folder
  — not a generic default like `C:\Users\...\Downloads`)

**All PowerShell commands for a given delivery go in a single block, start
to finish** — unzip, copy files, `git status`/`git diff`, `git add`,
`git commit`, and `git push` all together in one copy-pasteable block, not
split across separate steps. This overrides the earlier idea of pausing
before commit/push — Zemen reviews the `git diff` output after the block
runs, not before continuing.

**Downloaded zip filenames are not reliable — use a unique internal folder
name instead.** The platform names downloads after the zip's top-level
folder, not the filename Claude sets when creating the file. If every
delivery zip contains a `mj-logistics-main\` folder, every download
collides and Windows appends `(1)`, `(2)`, etc. — which then don't match
the paths Claude wrote in its instructions.

To avoid this, **each delivery zip's top-level folder must be renamed to
something unique and descriptive for that delivery** (e.g.
`mj-render-setup\`, `mj-admin-fix\`, `mj-fixed-landingpage\`) instead of
`mj-logistics-main\`. The folder name should match the zip's own filename
(minus `.zip`) so the download and its contents are self-evidently paired,
and Claude writes the `Copy-Item` paths against that folder name directly —
no more guessing `(n)` suffixes. If a download's name still doesn't match
what Claude expected, ask Zemen to run
`Get-ChildItem D:\Chrome_Downloads\*.zip | Sort-Object LastWriteTime -Descending | Select-Object -First 5 Name, LastWriteTime`
to confirm before writing further commands.

## The end-to-end push workflow

When Claude makes code changes in a session, the deliverable is a zip
containing only the changed files (preserving their folder structure, e.g.
`mj-logistics-main\<path\to\file>`). The standard flow Zemen follows to get
that into the real repo is:

```powershell
cd C:\Users\HP\mj-logistics

# 1. Unzip the delivered file (adjust the filename to match what was downloaded)
Expand-Archive -Path "D:\Chrome_Downloads\<name>.zip" -DestinationPath "D:\Chrome_Downloads\<name>" -Force

# 2. Copy only the changed files over (one copy command per file, matching folders)
Copy-Item "D:\Chrome_Downloads\<name>\mj-logistics-main\<path\to\file>" -Destination .\<path\to\> -Force

# 3. Review before committing
git status
git diff

# 4. Commit and push
git add <changed files>
git commit -m "<clear, specific message>"
git push
```

Rules for this flow:

- Claude always lists out the exact copy commands for each changed file —
  never a blind folder copy that could overwrite unrelated files.
- Each delivered zip gets a unique filename — never reuse the same zip name
  across deliverables in a session or across sessions, so old downloads in
  `D:\Chrome_Downloads` don't get confused with new ones.
- Zemen reviews `git diff` before committing. Claude should tell them what
  to look for if it isn't obvious.
- Commit messages are short, specific, and describe the change (not "update
  files").
- Note any harmless recurring warnings from the toolchain (e.g. Git's
  `LF will be replaced by CRLF` on Windows) so they aren't mistaken for
  errors.
- If a command opens a pager (e.g. `git diff`), note the key to exit it
  (`q`).

## History tracking

Two files in this repo exist purely to keep a record over time, and both
need to stay current:

- **`COMMIT_HISTORY.md`** — a plain log of git commits with dates. It's
  regenerated from the real `git log`, never hand-typed, so it's always
  accurate. Run `scripts\update-commit-history.ps1` after pushing to
  refresh it, then commit that file too (small follow-up commit is fine).
- **`CHAT_HISTORY.md`** — a running summary of what was discussed and built
  in each Claude session, in Zemen's own project. This is *not* generated
  from git — Claude should append a new dated entry to it near the end of
  any session where real work happened (a feature built, a decision made, a
  bug fixed), summarizing what changed and why. Keep entries short — a few
  lines per session, not a transcript.

When asked to "remember" a rule or convention going forward, it goes in
*this* file (CLAUDE.md), not CHAT_HISTORY.md — CLAUDE.md is the rulebook,
CHAT_HISTORY.md is the log.

## Other conventions established so far

- New features get their own zip deliverable containing only the files that
  changed — not the whole project — so `git diff` stays reviewable.
- The storefront pages (home, catalog, product pages, search, cart, garage)
  read from `frontend/lib/data/*` at build time — they do **not** call the
  FastAPI backend. Only `/admin` talks to the backend. Keep this in mind
  before assuming a data change needs a backend deploy.
- The backend's `ADMIN_TOKEN` is auto-generated by Render (see
  `render.yaml` → `generateValue: true`) — find the live value in the
  backend service's Environment tab on Render's dashboard, not in the repo.
- `render.yaml` wires `NEXT_PUBLIC_API_BASE` (frontend) and `CORS_ORIGINS`
  (backend) to each other automatically via `RENDER_EXTERNAL_URL` — no
  manual URL copy-pasting between the two services.

---
### One-time setup note (this session)
Local (`C:\Users\HP\mj-logistics`) and GitHub had diverged, so the first
push under this workflow starts with a full local reset (delete + fresh
`git clone`) rather than an incremental copy. See the setup message for the
exact commands. After that one-time reset, the standard flow above applies
going forward.
