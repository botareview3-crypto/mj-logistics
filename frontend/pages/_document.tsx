import { Html, Head, Main, NextScript } from 'next/document';

/* Runs before first paint. Adds `fx` to <html> so scroll-reveal elements start
   hidden (see globals.css) — skipped for reduced-motion visitors. If the app
   bundle never boots, the class is removed after 3.5 s so nothing stays hidden. */
const FX_BOOT = `(function(){try{if(window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;var d=document.documentElement;d.classList.add('fx');try{if(!sessionStorage.getItem('mj-intro'))d.classList.add('intro-pending')}catch(e){}setTimeout(function(){if(!window.__mjFxReady)d.classList.remove('fx','intro-pending')},3500)}catch(e){}})();`;

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta name="theme-color" content="#04261D" />
        <link rel="icon" href="/brand/favicon.svg" type="image/svg+xml" />
        <link rel="icon" href="/brand/favicon-32.png" sizes="32x32" type="image/png" />
        <link rel="apple-touch-icon" href="/brand/app-icon-180.png" />

        {/* Archivo (variable width + weight) for body copy; the expanded display
            cut ships locally from the logo kit in /fonts/archivo. */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,300..900&display=swap"
        />
        <link rel="preload" href="/fonts/archivo/ArchivoXB-Exp.ttf" as="font" type="font/ttf" crossOrigin="anonymous" />
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
