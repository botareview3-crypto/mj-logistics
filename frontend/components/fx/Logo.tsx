import React from 'react';

/* The MJ star mark from the logo kit (svg/mj-icon-color.svg), split into its
   five shards so each can be animated on its own. */
const SHARDS = [
  'M15.44 71.81 L88.77 112.52 L72.62 62.83 Z',
  'M184.98 73.10 L101.73 83.27 L144.00 113.98 Z',
  'M151.84 172.51 L116.44 96.47 L100.30 146.17 Z',
  'M47.06 171.71 L108.44 114.55 L56.19 114.55 Z',
];
const SIGNAL = 'M84.62 93.19 L126.89 62.47 L100.68 10.87 Z';

export function LogoMark({
  className = '',
  tone = 'color',
  title,
}: {
  className?: string;
  /** color = emerald shards, light = mint/white shards for dark backgrounds */
  tone?: 'color' | 'light' | 'ink';
  title?: string;
}) {
  const fill = tone === 'light' ? '#F3F1EA' : tone === 'ink' ? '#04261D' : '#0A4A3A';
  return (
    <svg
      viewBox="15.44 10.87 169.53 161.63"
      className={className}
      role={title ? 'img' : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
    >
      {SHARDS.map((d, i) => <path key={i} d={d} fill={fill} className="mj-shard" />)}
      <path d={SIGNAL} fill="#FF6A2B" className="mj-shard mj-shard-signal" />
    </svg>
  );
}

/** Full horizontal lockup (outlined SVG from the logo kit). */
export function LogoLockup({ variant = 'color', className = '' }: { variant?: 'color' | 'reversed'; className?: string }) {
  return (
    <img
      src={variant === 'reversed' ? '/brand/mj-horizontal-reversed.svg' : '/brand/mj-horizontal-color.svg'}
      alt="MJ Logistics Enterprise"
      className={className}
      width={212}
      height={40}
      draggable={false}
    />
  );
}
