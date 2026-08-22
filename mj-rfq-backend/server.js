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
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const PUBLIC_DIR = path.join(__dirname, 'public');
const SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

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
  if (!fs.existsSync(USERS_FILE)) fs.writeFileSync(USERS_FILE, '[]', 'utf8');
}
ensureDataFile();

let writeQueue = Promise.resolve();
let usersWriteQueue = Promise.resolve();

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

// Same pattern as above, kept as a separate file + separate write queue so
// user-account writes never block on (or get blocked by) RFQ writes.
async function readAllUsers() {
  const raw = await fsp.readFile(USERS_FILE, 'utf8');
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function saveAllUsers(users) {
  const result = usersWriteQueue.then(() =>
    fsp.writeFile(USERS_FILE, JSON.stringify(users, null, 2), 'utf8')
  );
  usersWriteQueue = result.catch(() => {});
  return result;
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

function validateRegisterInput(body) {
  const errors = [];

  const company = clean(body.company, 200);
  if (!company) errors.push('company is required');

  const contactName = clean(body.contactName, 200);
  if (!contactName) errors.push('contactName is required');

  const email = clean(body.email, 200).toLowerCase();
  if (!email || !EMAIL_RE.test(email)) errors.push('a valid email is required');

  const phone = clean(body.phone, 50);

  const password = typeof body.password === 'string' ? body.password : '';
  if (password.length < 8) errors.push('password must be at least 8 characters');

  return { errors, value: { company, contactName, email, phone, password } };
}

// ---------------------------------------------------------------------
// Password hashing (scrypt, built into Node — no extra dependency) and
// session tokens. Sessions live in memory only: fine for this site's
// traffic, but it means everyone is signed out on a server restart —
// same tradeoff already made for the admin password, called out in the
// README as needing real auth/DB before serious traffic.
// ---------------------------------------------------------------------

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${hash}`;
}

function verifyPassword(password, stored) {
  const [salt, hash] = String(stored || '').split(':');
  if (!salt || !hash) return false;
  const check = crypto.scryptSync(password, salt, 64).toString('hex');
  const a = Buffer.from(hash, 'hex');
  const b = Buffer.from(check, 'hex');
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

const sessions = new Map(); // token -> { userId, expiresAt }

function createSession(userId) {
  const token = crypto.randomBytes(32).toString('hex');
  sessions.set(token, { userId, expiresAt: Date.now() + SESSION_TTL_MS });
  return token;
}

function getSessionToken(req) {
  const auth = req.headers['authorization'] || '';
  if (auth.startsWith('Bearer ')) return auth.slice(7);
  return req.headers['x-session-token'] || '';
}

function getSessionUserId(req) {
  const token = getSessionToken(req);
  if (!token) return null;
  const session = sessions.get(token);
  if (!session) return null;
  if (session.expiresAt < Date.now()) {
    sessions.delete(token);
    return null;
  }
  return session.userId;
}

function toPublicProfile(user) {
  return {
    id: user.id,
    company: user.company,
    contactName: user.contactName,
    email: user.email,
    phone: user.phone,
    createdAt: user.createdAt,
    lastLoginAt: user.lastLoginAt || null,
    loginCount: user.loginCount || 0,
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

function checkRateLimit(map, ip, max) {
  const now = Date.now();
  const hits = (map.get(ip) || []).filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
  hits.push(now);
  map.set(ip, hits);
  return hits.length > max;
}

function isRateLimited(ip) {
  return checkRateLimit(rateLimitHits, ip, RATE_LIMIT_MAX);
}

// Separate bucket + slightly higher ceiling for auth: a family of
// register/login attempts on one connection shouldn't burn the RFQ quota.
const AUTH_RATE_LIMIT_MAX = 10;
const authRateLimitHits = new Map();

function isAuthRateLimited(ip) {
  return checkRateLimit(authRateLimitHits, ip, AUTH_RATE_LIMIT_MAX);
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

    // ---- Public: create an account (site "Sign up") -----------------
    if (pathname === '/api/auth/register' && req.method === 'POST') {
      if (isAuthRateLimited(ip)) {
        return sendJson(res, 429, { ok: false, errors: ['Too many requests. Please try again later.'] });
      }

      const body = await readBody(req);
      const { errors, value } = validateRegisterInput(body);
      if (errors.length) return sendJson(res, 400, { ok: false, errors });

      const users = await readAllUsers();
      if (users.some((u) => u.email === value.email)) {
        return sendJson(res, 409, { ok: false, errors: ['An account with this email already exists.'] });
      }

      const now = new Date().toISOString();
      const user = {
        id: crypto.randomUUID(),
        company: value.company,
        contactName: value.contactName,
        email: value.email,
        phone: value.phone,
        passwordHash: hashPassword(value.password),
        createdAt: now,
        lastLoginAt: now,
        loginCount: 1,
      };
      users.push(user);
      await saveAllUsers(users);

      const token = createSession(user.id);
      return sendJson(res, 201, { ok: true, token, profile: toPublicProfile(user) });
    }

    // ---- Public: sign in (site "Sign in") ----------------------------
    if (pathname === '/api/auth/login' && req.method === 'POST') {
      if (isAuthRateLimited(ip)) {
        return sendJson(res, 429, { ok: false, errors: ['Too many requests. Please try again later.'] });
      }

      const body = await readBody(req);
      const email = clean(body.email, 200).toLowerCase();
      const password = typeof body.password === 'string' ? body.password : '';
      if (!email || !password) {
        return sendJson(res, 400, { ok: false, errors: ['email and password are required'] });
      }

      const users = await readAllUsers();
      const idx = users.findIndex((u) => u.email === email);
      if (idx === -1 || !verifyPassword(password, users[idx].passwordHash)) {
        return sendJson(res, 401, { ok: false, errors: ['Invalid email or password.'] });
      }

      users[idx].lastLoginAt = new Date().toISOString();
      users[idx].loginCount = (users[idx].loginCount || 0) + 1;
      await saveAllUsers(users);

      const token = createSession(users[idx].id);
      return sendJson(res, 200, { ok: true, token, profile: toPublicProfile(users[idx]) });
    }

    // ---- Signed-in user: resume session on page load -----------------
    if (pathname === '/api/auth/me' && req.method === 'GET') {
      const userId = getSessionUserId(req);
      if (!userId) return sendJson(res, 401, { ok: false, error: 'unauthorized' });
      const users = await readAllUsers();
      const user = users.find((u) => u.id === userId);
      if (!user) return sendJson(res, 401, { ok: false, error: 'unauthorized' });
      return sendJson(res, 200, { ok: true, profile: toPublicProfile(user) });
    }

    // ---- Signed-in user: sign out -------------------------------------
    if (pathname === '/api/auth/logout' && req.method === 'POST') {
      const token = getSessionToken(req);
      if (token) sessions.delete(token);
      return sendJson(res, 200, { ok: true });
    }

    // ---- Admin: list all RFQs --------------------------------------
    if (pathname === '/api/admin/rfqs' && req.method === 'GET') {
      if (!isAdminAuthed(req)) return sendJson(res, 401, { ok: false, error: 'unauthorized' });
      const records = await readAll();
      records.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      return sendJson(res, 200, { ok: true, records });
    }

    // ---- Admin: list all signed-up profiles -------------------------
    if (pathname === '/api/admin/users' && req.method === 'GET') {
      if (!isAdminAuthed(req)) return sendJson(res, 401, { ok: false, error: 'unauthorized' });
      const users = await readAllUsers();
      const profiles = users
        .map(toPublicProfile)
        .sort((a, b) => new Date(b.lastLoginAt || b.createdAt) - new Date(a.lastLoginAt || a.createdAt));
      return sendJson(res, 200, { ok: true, profiles });
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

    // ---- Static test/wiring-check page --------------------------------
    // Plain button-based page to smoke-test /api/rfq and /api/auth/* live
    // against this backend without needing the real site frontend.
    if (pathname === '/test' || pathname === '/test/') {
      return serveStatic(req, res, '/test.html');
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
