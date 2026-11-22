import React from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { SplitText } from './fx/SplitText';

/* Shared building blocks for the "Manifest" design (see styles/globals.css). */

export function Wrap({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-[1360px] px-5 sm:px-8 ${className}`}>{children}</div>;
}

/** Hairline row with a mono index label on the left and an optional link on the right. */
export function IndexBar({
  no, label, href, cta, dark = false,
}: { no: string; label: string; href?: string; cta?: string; dark?: boolean }) {
  return (
    <div className={`flex items-center justify-between border-t py-4 ${dark ? 'border-white/25 text-white' : 'border-ink text-ink'}`}>
      <p className="tag tag-dot">{no} / {label}</p>
      {href && cta && (
        <Link href={href} className={`tag inline-flex items-center gap-2 ${dark ? 'hover:text-signal' : 'hover:text-azure'}`}>
          {cta} <ArrowUpRight className="h-4 w-4" />
        </Link>
      )}
    </div>
  );
}

/** Section opener: index bar, big headline on the left, short intro on the right. */
export function SectionHead({
  no, label, title, intro, href, cta, dark = false, accentClass,
}: {
  no: string; label: string; title: string; intro?: React.ReactNode;
  href?: string; cta?: string; dark?: boolean; accentClass?: string;
}) {
  return (
    <div className="mb-12 sm:mb-16">
      <IndexBar no={no} label={label} href={href} cta={cta} dark={dark} />
      <div className="mt-8 grid gap-6 lg:grid-cols-12 lg:items-end">
        <SplitText
          className={`t-xl lg:col-span-8 ${dark ? 'text-white' : 'text-ink'}`}
          accentClass={accentClass ?? (dark ? 'text-signal' : 'text-azure')}
          text={title}
        />
        {intro && (
          <p data-reveal className={`t-body lg:col-span-4 ${dark ? 'text-white/85' : 'text-ink/80'}`}>{intro}</p>
        )}
      </div>
    </div>
  );
}

/** Full-width closing band: slate block, sky bar on top. */
export function CtaBand({
  title, text, primary, secondary, image,
}: {
  title: string; text?: string;
  primary: { label: string; href: string };
  secondary?: { label: string; href: string };
  image?: string;
}) {
  return (
    <section className="relative isolate overflow-hidden bg-forest text-white">
      <div className="h-2 bg-signal" />
      {image && (
        <>
          <img src={image} alt="" loading="lazy" className="absolute inset-0 -z-10 h-full w-full object-cover opacity-25" />
        </>
      )}
      <Wrap className="grid gap-10 py-20 sm:py-28 lg:grid-cols-12 lg:items-end">
        <SplitText className="t-xl lg:col-span-8" accentClass="text-signal" text={title} />
        <div data-reveal className="flex flex-col gap-6 lg:col-span-4">
          {text && <p className="t-body text-white/90">{text}</p>}
          <div className="flex flex-wrap gap-3">
            <Link href={primary.href} className="btn btn-signal">{primary.label} <ArrowUpRight className="btn-arrow h-4 w-4" /></Link>
            {secondary && <Link href={secondary.href} className="btn btn-ghost">{secondary.label}</Link>}
          </div>
        </div>
      </Wrap>
    </section>
  );
}

/** Big pull-quote style statement that sits beside a mono label. */
export function Statement({ label, children, tone = 'white' }: { label: string; children: React.ReactNode; tone?: 'white' | 'paper' }) {
  return (
    <section className={tone === 'white' ? 'bg-white' : 'bg-paper'}>
      <Wrap className="grid gap-8 py-20 sm:py-28 lg:grid-cols-12">
        <p className="tag tag-dot lg:col-span-3">{label}</p>
        <div className="lg:col-span-9">{children}</div>
      </Wrap>
    </section>
  );
}
