import React, { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, Search, ShoppingBag, User } from 'lucide-react';
import { useApp } from '../lib/AppContext';
import { gsap } from '../lib/gsap';
import { getLenis } from '../lib/useLenis';
import { LogoLockup } from './fx/Logo';
import { Magnetic } from './fx/Magnetic';

/* ─── Navigation data ────────────────────────────────────────────────────── */
const NAV_LINKS = [
  { label: 'Auto Parts', href: '/shop' },
  { label: 'Mining',     href: '/mining' },
  { label: 'Solar',      href: '/solar' },
  { label: 'About',      href: '/divisions' },
  { label: 'Contact',    href: '/contact' },
];

const MENU_LINKS = [
  { label: 'Home',               href: '/',           image: '/images/site/hero-poster.webp',          note: 'MJ Logistics Enterprise' },
  { label: 'Auto Parts',         href: '/shop',       image: '/images/homepage/detail.webp',           note: 'Genuine parts, verified fit' },
  { label: 'Stationery & Office',href: '/stationery', image: '/homepage/office.webp',                  note: 'Workplace supplies' },
  { label: 'MJ Mining',          href: '/mining',     image: '/images/mining/gold.webp',               note: 'Gold & diamonds' },
  { label: 'MJ Solar',           href: '/solar',      image: '/images/site/solar-art.svg',            note: 'Energy systems' },
  { label: 'About',              href: '/divisions',  image: '/images/homepage/industrial.webp',       note: 'How we work' },
  { label: 'Contact',            href: '/contact',    image: '/images/site/forklift.webp',             note: 'Start an enquiry' },
];

/* ─── Component ──────────────────────────────────────────────────────────── */
export const SiteHeader: React.FC = () => {
  const { navigate, currentPath, currentUser, cartCount } = useApp();
  const [atTop, setAtTop] = useState(true);
  const [hidden, setHidden] = useState(false);
  const [darkHero, setDarkHero] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [preview, setPreview] = useState(0);
  const [query, setQuery] = useState('');

  const menuRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const menuBtnRef = useRef<HTMLButtonElement>(null);
  const focusSearchOnOpen = useRef(false);

  /* Which theme sits under the header at the top of this page? */
  useEffect(() => {
    const id = requestAnimationFrame(() => setDarkHero(!!document.querySelector('[data-hero="dark"]')));
    return () => cancelAnimationFrame(id);
  }, [currentPath]);

  /* Hide on scroll down, reveal on scroll up */
  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setAtTop(y < 40);
      if (Math.abs(y - last) > 6) {
        setHidden(y > last && y > 160);
        last = y;
      }
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* Close on route change */
  useEffect(() => { setMenuOpen(false); }, [currentPath]);

  /* Menu open/close animation, scroll lock, Escape */
  useEffect(() => {
    const el = menuRef.current;
    if (!el) return;
    const lenis = getLenis();
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (menuOpen) {
      lenis?.stop();
      document.body.style.overflow = 'hidden';
      el.style.visibility = 'visible';
      const tl = gsap.timeline();
      if (reduce) {
        tl.fromTo(el, { opacity: 0 }, { opacity: 1, duration: 0.2 });
      } else {
        tl.fromTo(el, { clipPath: 'circle(0% at 100% 0%)' }, { clipPath: 'circle(150% at 100% 0%)', duration: 0.9, ease: 'expo.inOut' })
          .fromTo(el.querySelectorAll('[data-menu-item]'), { yPercent: 110 }, { yPercent: 0, duration: 0.9, ease: 'expo.out', stagger: 0.05 }, 0.35)
          .fromTo(el.querySelectorAll('[data-menu-fade]'), { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.7, ease: 'expo.out', stagger: 0.06 }, 0.5);
      }
      if (focusSearchOnOpen.current) {
        focusSearchOnOpen.current = false;
        window.setTimeout(() => searchRef.current?.focus(), 450);
      }
      const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setMenuOpen(false); };
      window.addEventListener('keydown', onKey);
      return () => { window.removeEventListener('keydown', onKey); tl.kill(); };
    }
    lenis?.start();
    document.body.style.overflow = '';
    if (el.style.visibility === 'visible') {
      const tl = gsap.to(el, reduce
        ? { opacity: 0, duration: 0.2, onComplete: () => { el.style.visibility = 'hidden'; } }
        : { clipPath: 'circle(0% at 100% 0%)', duration: 0.7, ease: 'expo.inOut', onComplete: () => { el.style.visibility = 'hidden'; } });
      menuBtnRef.current?.focus();
      return () => { tl.kill(); };
    }
  }, [menuOpen]);

  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    setQuery('');
    setMenuOpen(false);
    navigate(`/search?q=${encodeURIComponent(q)}`);
  }, [navigate, query]);

  const onDarkBg = menuOpen || (darkHero && atTop);
  const solid = !atTop && !menuOpen;
  const isActive = (href: string) => (href === '/' ? currentPath === '/' : currentPath.startsWith(href));

  const iconBtn = `relative grid h-11 w-11 place-items-center rounded-full transition-colors ${
    onDarkBg ? 'text-paper hover:bg-white/10' : 'text-ink hover:bg-ink/5'
  }`;

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-[120] transition-transform duration-500 ease-[cubic-bezier(.16,1,.3,1)] ${
          hidden && !menuOpen ? '-translate-y-[120%]' : 'translate-y-0'
        }`}
      >
        <div className={`transition-[padding] duration-500 ${solid ? 'px-3 pt-3 sm:px-4' : 'px-0 pt-0'}`}>
        <div
          className={`mx-auto flex items-center justify-between transition-all duration-500 ease-[cubic-bezier(.16,1,.3,1)] ${
            solid
              ? 'h-16 max-w-[1320px] rounded-full border border-ink/5 bg-paper/85 px-3 pl-5 shadow-[0_10px_40px_-12px_rgba(4,38,29,.25)] backdrop-blur-xl'
              : 'h-20 max-w-[1440px] px-5 sm:px-8'
          }`}
        >
          {/* Logo */}
          <Link href="/" className="relative z-10 shrink-0" aria-label="MJ Logistics Enterprise — home">
            <span className="relative block h-8 w-[170px] sm:h-9 sm:w-[190px]">
              <LogoLockup variant="color" className={`absolute inset-0 h-full w-auto transition-opacity duration-300 ${onDarkBg ? 'opacity-0' : 'opacity-100'}`} />
              <LogoLockup variant="reversed" className={`absolute inset-0 h-full w-auto transition-opacity duration-300 ${onDarkBg ? 'opacity-100' : 'opacity-0'}`} />
            </span>
          </Link>

          {/* Desktop links */}
          <nav className={`hidden items-center gap-1 lg:flex ${menuOpen ? 'invisible' : ''}`} aria-label="Main navigation">
            {NAV_LINKS.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={`group relative rounded-full px-4 py-2 text-[14.5px] font-medium transition-colors ${
                  onDarkBg ? 'text-paper/85 hover:text-paper' : 'text-ink/75 hover:text-ink'
                }`}
              >
                {link.label}
                <span
                  className={`absolute bottom-1 left-4 right-4 h-px origin-left bg-signal transition-transform duration-500 ease-[cubic-bezier(.16,1,.3,1)] ${
                    isActive(link.href) ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                  }`}
                />
              </Link>
            ))}
          </nav>

          {/* Right cluster */}
          <div className="relative z-10 flex items-center gap-1">
            <button
              type="button"
              className={`${iconBtn} hidden sm:grid`}
              aria-label="Search parts"
              onClick={() => { focusSearchOnOpen.current = true; setMenuOpen(true); }}
            >
              <Search className="h-[18px] w-[18px]" />
            </button>
            <Link href={currentUser ? '/account' : '/signin'} className={`${iconBtn} hidden sm:grid`} aria-label={currentUser ? 'My account' : 'Sign in'}>
              <User className="h-[18px] w-[18px]" />
            </Link>
            <Link href="/cart" className={iconBtn} aria-label={`Cart (${cartCount} items)`}>
              <ShoppingBag className="h-[18px] w-[18px]" />
              {cartCount > 0 && (
                <span className="absolute right-1 top-1 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-signal px-1 text-[10px] font-bold text-white">
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </Link>

            <span className="ml-1 hidden md:block">
              <Magnetic strength={0.25}>
                <Link href="/contact" className="btn btn-signal !h-11 !px-5 !text-[14px]">
                  Get a quote <ArrowUpRight className="btn-arrow h-4 w-4" />
                </Link>
              </Magnetic>
            </span>

            <button
              ref={menuBtnRef}
              type="button"
              onClick={() => setMenuOpen(o => !o)}
              aria-expanded={menuOpen}
              aria-controls="site-menu"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              className={`ml-1 grid h-11 w-11 place-items-center rounded-full transition-colors ${
                onDarkBg ? 'bg-paper text-ink' : 'bg-ink text-paper'
              }`}
            >
              <span className="relative block h-3 w-5">
                <span className={`absolute left-0 h-[1.5px] w-5 bg-current transition-all duration-500 ease-[cubic-bezier(.16,1,.3,1)] ${menuOpen ? 'top-1/2 -translate-y-1/2 rotate-45' : 'top-0'}`} />
                <span className={`absolute left-0 h-[1.5px] bg-current transition-all duration-500 ease-[cubic-bezier(.16,1,.3,1)] ${menuOpen ? 'top-1/2 w-5 -translate-y-1/2 -rotate-45' : 'bottom-0 w-3'}`} />
              </span>
            </button>
          </div>
        </div>
        </div>
      </header>

      {/* ── Full-screen menu ──────────────────────────────────────────────── */}
      <div
        id="site-menu"
        ref={menuRef}
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
        className="grain fixed inset-0 z-[110] overflow-y-auto bg-ink text-paper"
        style={{ visibility: 'hidden' }}
        data-lenis-prevent
      >
        <div className="mx-auto grid min-h-full max-w-[1440px] gap-10 px-5 pb-10 pt-28 sm:px-8 lg:grid-cols-[1.25fr_.75fr] lg:gap-16 lg:pt-32">
          <nav aria-label="Site sections">
            <ul>
              {MENU_LINKS.map((link, i) => (
                <li key={link.href} className="overflow-hidden border-b border-paper/10">
                  <Link
                    href={link.href}
                    data-menu-item
                    onMouseEnter={() => setPreview(i)}
                    onFocus={() => setPreview(i)}
                    onClick={() => setMenuOpen(false)}
                    className="group flex items-baseline gap-4 py-3 sm:gap-6 sm:py-4"
                  >
                    <span className="w-7 shrink-0 text-xs font-semibold tabular-nums text-mint/60">0{i + 1}</span>
                    <span
                      className={`font-display text-[clamp(1.9rem,5vw,4.2rem)] font-extrabold leading-none tracking-[-.035em] transition-all duration-500 ease-[cubic-bezier(.16,1,.3,1)] group-hover:translate-x-3 group-hover:text-signal ${
                        isActive(link.href) ? 'text-signal' : ''
                      }`}
                    >
                      {link.label}
                    </span>
                    <span className="ml-auto hidden text-sm text-paper/45 sm:block">{link.note}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex flex-col gap-8">
            <div data-menu-fade className="relative hidden aspect-[4/3] overflow-hidden rounded-3xl lg:block">
              {MENU_LINKS.map((link, i) => (
                <img
                  key={link.href}
                  src={link.image}
                  alt=""
                  loading="lazy"
                  className={`absolute inset-0 h-full w-full object-cover transition-all duration-700 ease-[cubic-bezier(.16,1,.3,1)] ${
                    preview === i ? 'scale-100 opacity-100' : 'scale-110 opacity-0'
                  }`}
                />
              ))}
              <div className="absolute inset-0 bg-gradient-to-t from-ink/70 to-transparent" />
              <p className="absolute bottom-5 left-6 eyebrow text-paper">{MENU_LINKS[preview].note}</p>
            </div>

            <form data-menu-fade onSubmit={handleSearch} className="relative" role="search">
              <label htmlFor="menu-search" className="eyebrow mb-3 block text-mint/70">Search the catalogue</label>
              <input
                id="menu-search"
                ref={searchRef}
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Brake pads, oil filter, OEM number…"
                className="h-14 w-full rounded-full border border-paper/20 bg-white/5 pl-6 pr-16 text-[15px] text-paper placeholder:text-paper/40 outline-none transition focus:border-signal"
              />
              <button type="submit" aria-label="Search" className="absolute bottom-1.5 right-1.5 grid h-11 w-11 place-items-center rounded-full bg-signal text-white">
                <Search className="h-4 w-4" />
              </button>
            </form>

            <div data-menu-fade className="grid grid-cols-2 gap-3 text-sm">
              <Link href={currentUser ? '/account' : '/signin'} onClick={() => setMenuOpen(false)} className="flex items-center gap-2 rounded-2xl border border-paper/15 px-4 py-3.5 transition hover:border-signal hover:text-signal">
                <User className="h-4 w-4" /> {currentUser ? 'My account' : 'Sign in'}
              </Link>
              <Link href="/cart" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 rounded-2xl border border-paper/15 px-4 py-3.5 transition hover:border-signal hover:text-signal">
                <ShoppingBag className="h-4 w-4" /> Cart{cartCount > 0 ? ` (${cartCount})` : ''}
              </Link>
            </div>

            <div data-menu-fade className="mt-auto flex flex-wrap items-end justify-between gap-4 border-t border-paper/10 pt-6 text-sm text-paper/55">
              <a href="mailto:info@mjlogisticsenterprise.com" className="link-draw text-paper/80">info@mjlogisticsenterprise.com</a>
              <span>Parts that fit. Delivered fast.</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
