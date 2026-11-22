import React from 'react';
import { SplitText } from './SplitText';
import { Wrap } from '../ui';

/**
 * Inner-page hero ("Manifest" design): a mono label bar, a huge headline and
 * intro on the left, a tall square-edged photo on the right. Words in
 * *asterisks* get the accent colour. Props are unchanged from the old hero.
 */
export function PageHero({
  eyebrow, title, intro, actions, image, imageAlt = '', children,
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
    <section className="border-b border-ink bg-paper">
      <Wrap className="pb-14 pt-8 sm:pb-20 sm:pt-10">
        <div className="flex items-center justify-between border-t border-ink pt-4">
          <p data-reveal data-intro="0" className="tag tag-dot">{eyebrow}</p>
          <p className="tag hidden text-ink/60 sm:block">MJ Logistics Enterprise</p>
        </div>
        <div className={`mt-10 grid gap-10 lg:gap-14 ${image ? 'lg:grid-cols-12' : ''}`}>
          <div className={image ? 'lg:col-span-7' : 'max-w-5xl'}>
            <SplitText as="h1" intro={0.05} className="t-hero" text={title} />
            {intro && <p data-reveal data-intro="0.25" className="t-body mt-8 max-w-xl text-ink/80 sm:text-[19px]">{intro}</p>}
            {actions && <div data-reveal data-intro="0.35" className="mt-9 flex flex-wrap items-center gap-3">{actions}</div>}
            {children}
          </div>
          {image && (
            <figure className="lg:col-span-5">
              <div data-clip data-intro="0.15" className="relative aspect-[4/5] overflow-hidden bg-mist lg:aspect-[4/5]">
                <div data-parallax="0.05" className="absolute -inset-y-[6%] inset-x-0">
                  <img src={image} alt={imageAlt} className="h-full w-full object-cover" />
                </div>
                <span className="absolute bottom-0 left-0 bg-signal px-3 py-1.5 tag text-ink">{eyebrow}</span>
              </div>
            </figure>
          )}
        </div>
      </Wrap>
    </section>
  );
}
