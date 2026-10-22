import Head from 'next/head';

interface SeoProps {
  /** Page name; " — MJ Logistics" is added. */
  title: string;
  description?: string;
  /** Keep the page out of search results (account, cart, search, admin…). */
  noindex?: boolean;
}

// One place for the <title>, description, social-share text and noindex flag,
// so every page gets them the same way. The canonical link and the share
// picture are set for all pages in pages/_app.tsx.
export function Seo({ title, description, noindex }: SeoProps) {
  const full = `${title} — MJ Logistics`;
  return (
    <Head>
      <title>{full}</title>
      {description && <meta name="description" content={description} />}
      {noindex && <meta name="robots" content="noindex, nofollow" />}
      <meta property="og:site_name" content="MJ Logistics Enterprise" key="og:site_name" />
      <meta property="og:type" content="website" key="og:type" />
      <meta property="og:title" content={full} key="og:title" />
      {description && <meta property="og:description" content={description} key="og:description" />}
    </Head>
  );
}

/** Trim to a search-result-friendly length without cutting a word in half. */
export function clip(text: string, max = 155): string {
  const clean = text.replace(/\s+/g, ' ').trim();
  if (clean.length <= max) return clean;
  return clean.slice(0, max - 1).replace(/\s+\S*$/, '') + '…';
}
