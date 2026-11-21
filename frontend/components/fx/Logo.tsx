import React from 'react';

/* The MJ star mark from the revised logo kit (public/brand/mj-icon-color.svg):
   a slate star with the sky-blue blade. */
const STAR =
  'M1.63,58.96l58.29,32.36c2.51,1.39,5.43-1.01,4.54-3.74l-12.84-39.5c-.48-1.48-1.96-2.39-3.5-2.15L2.67,53.07c-2.97.47-3.67,4.43-1.04,5.89ZM154.06,56.9l-66.17,8.08c-2.85.35-3.8,4.01-1.48,5.7l33.6,24.41c1.26.91,2.99.78,4.09-.32l32.57-32.49c2.13-2.12.37-5.74-2.62-5.38ZM126.15,146.89l-28.14-60.44c-1.21-2.6-4.99-2.37-5.87.36l-12.83,39.51c-.48,1.48.18,3.09,1.57,3.79l40.97,20.94c2.68,1.37,5.58-1.42,4.31-4.15ZM31.95,148.16l48.79-45.44c2.1-1.96.72-5.48-2.16-5.48h-41.53c-1.55,0-2.88,1.13-3.12,2.66l-7.26,45.44c-.47,2.97,3.08,4.86,5.28,2.81Z';
const BLADE =
  'M69.29,71.16l33.6-24.42c1.26-.91,1.66-2.6.96-3.99L83.02,1.73c-1.36-2.68-5.35-2.13-5.92.83l-12.77,65.43c-.55,2.82,2.64,4.85,4.96,3.16Z';

export function LogoMark({
  className = '',
  tone = 'color',
  title,
}: {
  className?: string;
  /** color = slate star, light = paper star for dark backgrounds, ink = deepest slate */
  tone?: 'color' | 'light' | 'ink';
  title?: string;
}) {
  const fill = tone === 'light' ? '#F3F1EA' : tone === 'ink' ? '#0F2230' : '#1F3A4D';
  return (
    <svg
      viewBox="0 0 168.26 161.63"
      className={className}
      role={title ? 'img' : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
    >
      <g transform="scale(1.06757)">
        <path d={STAR} fill={fill} className="mj-shard" />
        <path d={BLADE} fill="#2EC4F1" className="mj-shard mj-shard-signal" />
      </g>
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
