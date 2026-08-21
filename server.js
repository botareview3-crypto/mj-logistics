/**
 * MJ Logistics — RFQ backend
 * -----------------------------------------------------------------------
 * Zero-dependency Node server (built-ins only) that:
 *   - Accepts public RFQ ("Post an RFQ") submissions from the marketing site
 *   - Stores them in a local JSON file (data/rfqs.json)
 *   - Serves a password-gated admin page to review/update/delete RFQs
 *
 * This is intentionally dependency-free so it runs anywhere with `node
 * server.js` — no npm install, no build step. It is a solid starting point,
 * not a finished production system — see README.md "Before you ship this"
 * for what to harden before it touches real traffic (swap the JSON file for
 * a real DB, swap the password for real auth/sessions, put it behind HTTPS).
 *
 * Run:
 *   ADMIN_PASSWORD=some-strong-password PORT=3001 node server.js
 */

const http = require('http');
const fs = require('fs');
const fsp = fs.promises;
const path = require('path');
const crypto = require('crypto');
const url = require('url');

const PORT = process.env.PORT || 3001;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'changeme';
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || '*';
const DATA_DIR = path.join(__dirname, 'data');
const DATA_FILE = path.join(DATA_DIR, 'rfqs.json');
const PUBLIC_DIR = path.join(__dirname, 'public');

if (ADMIN_PASSWORD === 'changeme') {
  console.warn(
    '[warn] ADMIN_PASSWORD is not set — using the default "changeme". ' +
    'Set a real ADMIN_PASSWORD env var before deploying this anywhere reachable.'
  );
}

// ---------------------------------------------------------------------
// Storage: a JSON file is plenty for RFQ volume. Writes are serialized
// through a promise chain so two near-simultaneous submissions can't
// clobber each other.
// ---------------------------------------------------------------------

function ensureDataFile() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, '[]', 'utf8');
}
ensureDataFile();

let writeQueue = Promise.resolve();

async function readAll() {
  const raw = await fsp.readFile(DATA_FILE, 'utf8');
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function withWriteLock(fn) {
  const result = writeQueue.then(fn);
  // Swallow errors here so one failed write doesn't wedge the queue;
  // the caller still sees the rejection via `result`.
  writeQueue = result.catch(() => {});
  return result;
}

function saveAll(records) {
  return withWriteLock(() => fsp.writeFile(DATA_FILE, JSON.stringify(records, null, 2), 'utf8'));
}

// ---------------------------------------------------------------------
// Validation
// ---------------------------------------------------------------------

const COMMODITIES = new Set(['parts', 'gold', 'diamond']);
const STATUSES = new Set(['new', 'reviewed', 'quoted', 'won', 'lost']);
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function clean(str, maxLen) {
  if (typeof str !== 'string') return '';
  return str.trim().slice(0, maxLen);
}

function validateRfqInput(body) {
  const errors = [];

  const commodity = clean(body.commodity, 20).toLowerCase();
  if (!COMMODITIES.has(commodity)) errors.push('commodity must be one of: parts, gold, diamond');

  const company = clean(body.company, 200);
  if (!company) errors.push('company is required');

  const contactName = clean(body.contactName, 200);
  if (!contactName) errors.push('contactName is required');

  const email = clean(body.email, 200);
  if (!email || !EMAIL_RE.test(email)) errors.push('a valid email is required');

  const spec = clean(body.spec, 5000);
  if (!spec) errors.push('spec is required');

  const phone = clean(body.phone, 50);
  const quantity = clean(body.quantity, 200);
  const targetPrice = clean(body.targetPrice, 100);
  const notes = clean(body.notes, 3000);

  return {
    errors,
    value: { commodity, company, contactName, email, phone, quantity, spec, targetPrice, notes },
  };
}

// ---------------------------------------------------------------------
// Very light abuse guards for the public POST endpoint:
//   - honeypot field (real users never fill in "website")
//   - simple in-memory per-IP rate limit
// Both are best-effort, not a substitute for a real WAF/captcha at scale.
// ---------------------------------------------------------------------

const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const RATE_LIMIT_MAX = 5;
const rateLimitHits = new Map(); // ip -> [timestamps]

function isRateLimited(ip) {
  const now = Date.now();
  const hits = (rateLimitHits.get(ip) || []).filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
  hits.push(now);
  rateLimitHits.set(ip, hits);
  return hits.length > RATE_LIMIT_MAX;
}

// ---------------------------------------------------------------------
// HTTP helpers
// ---------------------------------------------------------------------

function setCors(res) {
  res.setHeader('Access-Control-Allow-Origin', ALLOWED_ORIGIN);
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Admin-Token');
}

function sendJson(res, status, data) {
  const body = JSON.stringify(data);
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(body);
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let chunks = '';
    let size = 0;
    const LIMIT = 200 * 1024; // 200kb is generous for this form
    req.on('data', (chunk) => {
      size += chunk.length;
      if (size > LIMIT) {
        reject(new Error('payload too large'));
        req.destroy();
        return;
      }
      chunks += chunk;
    });
    req.on('end', () => {
      if (!chunks) return resolve({});
      try {
        resolve(JSON.parse(chunks));
      } catch {
        reject(new Error('invalid JSON body'));
      }
    });
    req.on('error', reject);
  });
}

function isAdminAuthed(req) {
  const token = req.headers['x-admin-token'];
  return typeof token === 'string' && token === ADMIN_PASSWORD;
}

function serveStatic(req, res, pathname) {
  // Only ever serves files inside PUBLIC_DIR — no path traversal.
  const safeRelative = path.normalize(pathname).replace(/^(\.\.[/\\])+/, '');
  const filePath = path.join(PUBLIC_DIR, safeRelative);
  if (!filePath.startsWith(PUBLIC_DIR)) {
    res.writeHead(403);
    return res.end('Forbidden');
  }
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      return res.end('Not found');
    }
    const ext = path.extname(filePath);
    const type =
      ext === '.html' ? 'text/html; charset=utf-8' :
      ext === '.js' ? 'application/javascript; charset=utf-8' :
      ext === '.css' ? 'text/css; charset=utf-8' :
      'application/octet-stream';
    res.writeHead(200, { 'Content-Type': type });
    res.end(data);
  });
}

// ---------------------------------------------------------------------
// Request handler
// ---------------------------------------------------------------------

const server = http.createServer(async (req, res) => {
  setCors(res);

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    return res.end();
  }

  const parsed = url.parse(req.url, true);
  const pathname = parsed.pathname;
  const ip = req.socket.remoteAddress || 'unknown';

  try {
    // ---- Public: submit an RFQ -----------------------------------
    if (pathname === '/api/rfq' && req.method === 'POST') {
      const body = await readBody(req);

      // Honeypot: bots fill every field, humans never see this one
      // (it's hidden via CSS on the form). Pretend success, do nothing.
      if (clean(body.website, 200)) {
        return sendJson(res, 201, { ok: true, id: 'ignored' });
      }

      if (isRateLimited(ip)) {
        return sendJson(res, 429, { ok: false, errors: ['Too many requests. Please try again later.'] });
      }

      const { errors, value } = validateRfqInput(body);
      if (errors.length) {
        return sendJson(res, 400, { ok: false, errors });
      }

      const record = {
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        status: 'new',
        ...value,
      };

      const records = await readAll();
      records.push(record);
      await saveAll(records);

      return sendJson(res, 201, { ok: true, id: record.id });
    }

    // ---- Admin: list all RFQs --------------------------------------
    if (pathname === '/api/admin/rfqs' && req.method === 'GET') {
      if (!isAdminAuthed(req)) return sendJson(res, 401, { ok: false, error: 'unauthorized' });
      const records = await readAll();
      records.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      return sendJson(res, 200, { ok: true, records });
    }

    // ---- Admin: update one RFQ (status and/or notes) ---------------
    const patchMatch = pathname.match(/^\/api\/admin\/rfqs\/([^/]+)$/);
    if (patchMatch && req.method === 'PATCH') {
      if (!isAdminAuthed(req)) return sendJson(res, 401, { ok: false, error: 'unauthorized' });
      const id = patchMatch[1];
      const body = await readBody(req);
      const records = await readAll();
      const idx = records.findIndex((r) => r.id === id);
      if (idx === -1) return sendJson(res, 404, { ok: false, error: 'not found' });

      if (body.status !== undefined) {
        const status = clean(body.status, 20).toLowerCase();
        if (!STATUSES.has(status)) {
          return sendJson(res, 400, { ok: false, error: 'invalid status' });
        }
        records[idx].status = status;
      }
      if (body.notes !== undefined) {
        records[idx].notes = clean(body.notes, 3000);
      }
      records[idx].updatedAt = new Date().toISOString();

      await saveAll(records);
      return sendJson(res, 200, { ok: true, record: records[idx] });
    }

    // ---- Admin: delete one RFQ --------------------------------------
    const deleteMatch = pathname.match(/^\/api\/admin\/rfqs\/([^/]+)$/);
    if (deleteMatch && req.method === 'DELETE') {
      if (!isAdminAuthed(req)) return sendJson(res, 401, { ok: false, error: 'unauthorized' });
      const id = deleteMatch[1];
      const records = await readAll();
      const next = records.filter((r) => r.id !== id);
      if (next.length === records.length) return sendJson(res, 404, { ok: false, error: 'not found' });
      await saveAll(next);
      return sendJson(res, 200, { ok: true });
    }

    // ---- Admin: verify a password without fetching data -------------
    if (pathname === '/api/admin/login' && req.method === 'POST') {
      const body = await readBody(req);
      const password = clean(body.password, 200);
      if (password === ADMIN_PASSWORD) {
        return sendJson(res, 200, { ok: true });
      }
      return sendJson(res, 401, { ok: false, error: 'invalid password' });
    }

    // ---- Static admin UI ---------------------------------------------
    if (pathname === '/admin' || pathname === '/admin/') {
      return serveStatic(req, res, '/admin.html');
    }
    if (pathname.startsWith('/admin/')) {
      return serveStatic(req, res, pathname.replace('/admin', ''));
    }

    if (pathname === '/health') {
      return sendJson(res, 200, { ok: true });
    }

    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not found');
  } catch (err) {
    console.error(err);
    sendJson(res, 500, { ok: false, error: 'server error' });
  }
});

server.listen(PORT, () => {
  console.log(`MJ RFQ backend listening on http://localhost:${PORT}`);
  console.log(`Admin UI: http://localhost:${PORT}/admin`);
});
