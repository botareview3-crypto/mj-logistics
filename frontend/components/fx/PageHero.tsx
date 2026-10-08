import React from 'react';
import { SplitText } from './SplitText';

/**
 * Shared light hero for inner pages: eyebrow, headline, intro and actions on
 * paper, with an optional wide photo underneath. Headline words marked with
 * *asterisks* are highlighted in signal orange (see SplitText).
 */
export function PageHero({
  eyebrow,
  title,
  intro,
  actions,
  image,
  imageAlt = '',
  children,
}: {
  eyebrow: string;
  title: string;
  intro?: React.ReactNode;
  actions?: React.ReactNode;
  image?: string;
  imageAlt?: string;
  children?: React.ReactNode;
}) {
  return (
    <section className="bg-paper pb-14 pt-32 sm:pb-20 sm:pt-40">
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8">
        <p data-reveal data-intro="0" className="eyebrow mb-6 flex items-center gap-3 text-sage">
          <span className="h-px w-10 bg-signal" /> {eyebrow}
        </p>
        <div className="grid gap-8 lg:grid-cols-[1.25fr_.75fr] lg:items-end">
          <SplitText as="h1" intro={0.05} className="t-hero max-w-[16ch] text-ink" text={title} />
          <div>
            {intro && (
              <p data-reveal data-intro="0.25" className="max-w-xl text-[17px] leading-8 text-ink/70">{intro}</p>
            )}
            {actions && (
              <div data-reveal data-intro="0.35" className="mt-8 flex flex-wrap gap-3">{actions}</div>
            )}
          </div>
        </div>
        {children}
        {image && (
          <div data-clip data-intro="0.2" className="relative mt-12 h-[44vh] min-h-[280px] overflow-hidden rounded-3xl sm:mt-16 sm:h-[56vh]">
            <div className="absolute -inset-y-[8%] inset-x-0" data-parallax="0.05">
              <img src={image} alt={imageAlt} className="h-full w-full object-cover" />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
