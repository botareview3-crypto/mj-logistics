import React from 'react';

/**
 * Renders text as masked words that lib/fx.ts slides up into view.
 * - `\n` in the text starts a new line.
 * - Words wrapped in *asterisks* get `accentClass` (e.g. signal orange).
 * - `intro` plays the reveal on page intro (with that delay) instead of on scroll.
 */
type Props = {
  text: string;
  as?: keyof JSX.IntrinsicElements;
  className?: string;
  accentClass?: string;
  intro?: number;
  delay?: number;
  id?: string;
};

export function SplitText({ text, as = 'h2', className, accentClass = 'text-signal', intro, delay, id }: Props) {
  const Tag = as as React.ElementType;
  const lines = text.split('\n');
  return (
    <Tag
      id={id}
      className={className}
      data-split=""
      data-intro={intro !== undefined ? String(intro) : undefined}
      data-delay={delay !== undefined ? String(delay) : undefined}
    >
      {lines.map((line, li) => (
        <span key={li} className="block">
          {tokenize(line).map((tok, wi) => (
            <React.Fragment key={wi}>
              <span className="split-word">
                <span className={`split-inner ${tok.accent ? accentClass : ''}`}>{tok.word}</span>
              </span>
              {wi < tokenize(line).length - 1 ? ' ' : null}
            </React.Fragment>
          ))}
        </span>
      ))}
    </Tag>
  );
}

/** Paragraph whose words brighten one by one as it scrolls through view. */
export function ScrubText({ text, as = 'p', className, accentClass = 'text-signal' }: Omit<Props, 'intro' | 'delay' | 'id'>) {
  const Tag = as as React.ElementType;
  const words = tokenize(text);
  return (
    <Tag className={className} data-scrub="">
      {words.map((tok, i) => (
        <React.Fragment key={i}>
          <span className={`scrub-word ${tok.accent ? accentClass : ''}`}>{tok.word}</span>
          {i < words.length - 1 ? ' ' : null}
        </React.Fragment>
      ))}
    </Tag>
  );
}

function tokenize(line: string) {
  const out: { word: string; accent: boolean }[] = [];
  let accent = false;
  for (const raw of line.split(/\s+/).filter(Boolean)) {
    let word = raw;
    const opens = word.startsWith('*');
    if (opens) { accent = true; word = word.slice(1); }
    const closes = word.endsWith('*') || /\*[.,!?;:]$/.test(word);
    word = word.replace('*', '');
    out.push({ word, accent });
    if (closes) accent = false;
  }
  return out;
}
