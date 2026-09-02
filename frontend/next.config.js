/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Produces a plain HTML/CSS/JS `out/` folder on `npm run build` — this is
  // what makes it possible to deploy on Hostinger's shared/business hosting,
  // which only serves static files and does not run a Node.js server.
  output: 'export',
  // Emits `/catalog/index.html` instead of `/catalog.html`, so Hostinger's
  // Apache server can serve clean URLs (e.g. /catalog/) without needing any
  // rewrite rules. Without this, refreshing a page like /catalog on
  // Hostinger 404s unless you manually add ".html" to the URL.
  trailingSlash: true,
  images: {
    // next/image's optimizer needs a Node server, which static export
    // (and Hostinger shared hosting) doesn't have — this serves images
    // as-is instead of trying to run them through it.
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
};

module.exports = nextConfig;
