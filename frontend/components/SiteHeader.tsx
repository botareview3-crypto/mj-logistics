import React, { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, Menu, Search, ShoppingBag, User, X } from 'lucide-react';
import { useApp } from '../lib/AppContext';
import { LogoLockup } from './fx/Logo';

/* "Manifest" header: a slim slate info strip, then a sticky white bar with the
   logo, inline links and quick actions. Small screens get a plain drop-down
   panel (no full-screen overlay, no animation library). */
const NAV_LINKS = [
  { label: 'Auto Parts', href: '/shop' },
  { label: 'Stationery', href: '/stationery' },
  { label: 'Mining',     href: '/mining' },
  { label: 'Solar',      href: '/solar' },
  { label: 'Oil & Gas',  href: '/oil-gas' },
  { label: 'Services',   href: '/services' },
  { label: 'About',      href: '/divisions' },
];

export const SiteHeader: React.FC = () => {
  const { navigate, currentPath, currentUser, cartCount } = useApp();
  const [panel, setPanel] = useState<null | 'menu' | 'search'>(null);
  const [query, setQuery] = useState('');
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => { setPanel(null); }, [currentPath]);

  useEffect(() => {
    if (!panel) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setPanel(null); };
    window.addEventListener('keydown', onKey);
    if (panel === 'search') window.setTimeout(() => searchRef.current?.focus(), 50);
    return () => window.removeEventListener('keydown', onKey);
  }, [panel]);

  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    setQuery('');
    setPanel(null);
    navigate(`/search?q=${encodeURIComponent(q)}`);
  }, [navigate, query]);

  const isActive = (href: string) => (href === '/' ? currentPath === '/' : currentPath.startsWith(href));
  const iconBtn = 'relative grid h-11 w-11 place-items-center text-ink transition-colors hover:bg-ink hover:text-white';

  return (
    <>
      {/* Info strip */}
      <div className="hidden bg-ink text-white sm:block">
        <div className="mx-auto flex h-9 max-w-[1360px] items-center justify-between px-8">
          <p className="tag text-white/80">Monrovia, Liberia</p>
          <div className="flex items-center gap-6">
            <a href="mailto:info@mjlogisticsenterprise.com" className="tag text-white/80 hover:text-signal">info@mjlogisticsenterprise.com</a>
            <Link href="/contact" className="tag text-signal hover:text-white">Request a quote</Link>
          </div>
        </div>
      </div>

      <header className="sticky top-0 z-[120] border-b border-ink bg-paper">
        <div className="mx-auto flex h-[72px] max-w-[1360px] items-center justify-between gap-6 px-5 sm:px-8">
          <Link href="/" className="shrink-0" aria-label="MJ Logistics Enterprise — home">
            <LogoLockup variant="color" className="h-8 w-auto sm:h-9" />
          </Link>

          <nav className="hidden items-center xl:flex" aria-label="Main navigation">
            {NAV_LINKS.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={`relative px-4 py-6 text-[16px] font-semibold transition-colors hover:text-azure ${isActive(link.href) ? 'text-ink' : 'text-ink/75'}`}
              >
                {link.label}
                {isActive(link.href) && <span className="absolute inset-x-4 bottom-0 h-1 bg-signal" />}
              </Link>
            ))}
          </nav>

          <div className="flex items-center">
            <button type="button" className={iconBtn} aria-label="Search the catalogue" onClick={() => setPanel(p => (p === 'search' ? null : 'search'))}>
              <Search className="h-[19px] w-[19px]" />
            </button>
            <Link href={currentUser ? '/account' : '/signin'} className={`${iconBtn} hidden sm:grid`} aria-label={currentUser ? 'My account' : 'Sign in'}>
              <User className="h-[19px] w-[19px]" />
            </Link>
            <Link href="/cart" className={iconBtn} aria-label={`Cart (${cartCount} items)`}>
              <ShoppingBag className="h-[19px] w-[19px]" />
              {cartCount > 0 && (
                <span className="absolute right-1 top-1 grid h-[18px] min-w-[18px] place-items-center bg-signal px-1 text-[11px] font-bold text-ink">
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </Link>
            <Link href="/contact" className="btn btn-signal ml-3 hidden !h-11 !px-5 !text-[15px] lg:inline-flex">
              Get a quote <ArrowUpRight className="btn-arrow h-4 w-4" />
            </Link>
            <button
              type="button"
              className={`${iconBtn} ml-1 xl:hidden`}
              aria-expanded={panel === 'menu'}
              aria-controls="site-menu"
              aria-label={panel === 'menu' ? 'Close menu' : 'Open menu'}
              onClick={() => setPanel(p => (p === 'menu' ? null : 'menu'))}
            >
              {panel === 'menu' ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Search drop-down */}
        {panel === 'search' && (
          <div className="border-t border-ink bg-white">
            <form onSubmit={handleSearch} role="search" className="mx-auto flex max-w-[1360px] items-center gap-3 px-5 py-4 sm:px-8">
              <label htmlFor="site-search" className="sr-only">Search the catalogue</label>
              <input
                id="site-search"
                ref={searchRef}
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search parts: brake pads, oil filter, OEM number…"
                className="h-12 flex-1 border border-ink/30 bg-paper px-4 text-[17px] outline-none focus:border-ink"
              />
              <button type="submit" className="btn btn-signal !h-12">Search</button>
            </form>
          </div>
        )}

        {/* Menu drop-down (below xl) */}
        {panel === 'menu' && (
          <nav id="site-menu" aria-label="Site sections" className="max-h-[calc(100svh-72px)] overflow-y-auto border-t border-ink bg-white" data-lenis-prevent>
            <ul className="mx-auto max-w-[1360px] px-5 sm:px-8">
              {[{ label: 'Home', href: '/' }, ...NAV_LINKS, { label: 'Why MJ', href: '/advantages' }, { label: 'Contact', href: '/contact' }].map((link, i) => (
                <li key={link.href} className="border-b border-ink/15">
                  <Link href={link.href} className="flex items-center justify-between py-4 font-display text-[22px] font-bold tracking-tight">
                    <span className="flex items-baseline gap-4">
                      <span className="tag w-6 text-ink/50">{String(i + 1).padStart(2, '0')}</span>
                      <span className={isActive(link.href) ? 'text-azure' : ''}>{link.label}</span>
                    </span>
                    <ArrowUpRight className="h-5 w-5 text-ink/50" />
                  </Link>
                </li>
              ))}
              <li className="flex flex-wrap gap-3 py-6">
                <Link href={currentUser ? '/account' : '/signin'} className="btn btn-ghost-dark !h-12">{currentUser ? 'My account' : 'Sign in'}</Link>
                <Link href="/contact" className="btn btn-signal !h-12">Get a quote</Link>
              </li>
            </ul>
          </nav>
        )}
      </header>
    </>
  );
};
