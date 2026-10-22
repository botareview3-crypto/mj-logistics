// The public address of the site. Used for canonical links, share previews and
// the sitemap. Set NEXT_PUBLIC_SITE_URL in the host's environment settings if
// the address ever changes (e.g. a custom domain); no code change needed.
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://mj-logistics.vercel.app').replace(/\/$/, '');

// Picture shown when a link to the site is shared (WhatsApp, LinkedIn, etc.).
export const SHARE_IMAGE = '/images/homepage/auto-parts.jpg';
