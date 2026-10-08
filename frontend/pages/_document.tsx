import { Html, Head, Main, NextScript } from 'next/document';

/* Runs before first paint. Adds `fx` to <html> so reveal elements start hidden
   (see globals.css) — skipped for reduced-motion visitors. If the app bundle
   hasn't booted within 3 s, the class is removed so nothing stays hidden. */
const FX_BOOT = `(function(){try{if(window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;var d=document.documentElement;d.classList.add('fx');setTimeout(function(){if(!window.__mjFxReady)d.classList.remove('fx')},3000)}catch(e){}})();`;

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta name="theme-color" content="#04261D" />
        <link rel="icon" href="/brand/favicon.svg" type="image/svg+xml" />
        <link rel="icon" href="/brand/favicon-32.png" sizes="32x32" type="image/png" />
        <link rel="apple-touch-icon" href="/brand/app-icon-180.png" />

        {/* Archivo for all text (headings use a heavier weight). */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;600;700&display=swap"
        />
        <link rel="preload" href="/images/site/hero-poster.webp" as="image" type="image/webp" />

        <script dangerouslySetInnerHTML={{ __html: FX_BOOT }} />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
