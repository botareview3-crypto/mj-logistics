import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* ── DNS prefetch / preconnect for any external origins ── */}
        <meta httpEquiv="x-dns-prefetch-control" content="on" />

        {/* ── Preload the two most-used font weights (regular + bold) ──
            These are used immediately on every page for headings and body text.
            Other weights load on-demand via font-display: swap. */}
        <link
          rel="preload"
          href="/fonts/Chopin-Trial-Regular-BF65b1d6917c0ec.otf"
          as="font"
          type="font/otf"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/Chopin-Trial-Bold-BF65b1d691a55be.otf"
          as="font"
          type="font/otf"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/Chopin-Trial-ExtraBold-BF65b1d6912ca36.otf"
          as="font"
          type="font/otf"
          crossOrigin="anonymous"
        />

        {/* ── Preload the hero background image (above the fold, highest priority) ── */}
        <link
          rel="preload"
          href="/homepage/hero-bg.webp"
          as="image"
          type="image/webp"
        />

        {/* ── Prefetch other images that appear on first scroll ── */}
        <link rel="prefetch" href="/homepage/auto-parts.webp" as="image" />
        <link rel="prefetch" href="/homepage/diamond.webp" as="image" />
        <link rel="prefetch" href="/homepage/cta-bg.webp" as="image" />

        {/* ── Prefetch category icons ── */}
        <link rel="prefetch" href="/categories/brake-disc.webp" as="image" />
        <link rel="prefetch" href="/categories/engine.webp" as="image" />
        <link rel="prefetch" href="/categories/shock-absorber.webp" as="image" />
        <link rel="prefetch" href="/categories/headlight.webp" as="image" />
        <link rel="prefetch" href="/categories/tire.webp" as="image" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
