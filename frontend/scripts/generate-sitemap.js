// Runs automatically after `npm run build` (npm "postbuild" hook).
// Reads the exported site in `out/` and writes `out/sitemap.xml` listing every
// public page, so new catalog/part pages are picked up with no manual upkeep.
const fs = require('fs');
const path = require('path');

const OUT = path.join(__dirname, '..', 'out');
const SITE = (process.env.NEXT_PUBLIC_SITE_URL || 'https://mj-logistics.vercel.app').replace(/\/$/, '');
// Private or transactional pages that should not be in search results.
const SKIP = new Set(['admin', 'account', 'cart', 'signin', 'search', '404', '_next', '_not-found']);

if (!fs.existsSync(OUT)) {
  console.log('[sitemap] out/ not found, skipping');
  process.exit(0);
}

const routes = [];
(function walk(dir, rel) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (rel === '' && SKIP.has(entry.name)) continue;
      walk(path.join(dir, entry.name), rel ? `${rel}/${entry.name}` : entry.name);
    } else if (entry.name === 'index.html') {
      routes.push(rel === '' ? '/' : `/${rel}/`);
    }
  }
})(OUT, '');

routes.sort();
const today = new Date().toISOString().slice(0, 10);
const xml =
  '<?xml version="1.0" encoding="UTF-8"?>\n' +
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
  routes.map(r => `  <url><loc>${SITE}${r}</loc><lastmod>${today}</lastmod></url>`).join('\n') +
  '\n</urlset>\n';

fs.writeFileSync(path.join(OUT, 'sitemap.xml'), xml);
console.log(`[sitemap] wrote ${routes.length} URLs to out/sitemap.xml`);
