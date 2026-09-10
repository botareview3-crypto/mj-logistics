import React, { useState, useEffect } from 'react';
import { Menu, X, Wrench, ArrowUpRight } from 'lucide-react';
import { useApp } from '../lib/AppContext';

// Chrome for the corporate/marketing pages (landing page, MJ Mining) — kept
// deliberately separate from the shop's <Header> (search bar, vehicle
// selector, cart). A visitor reading about the mining division has no use
// for "select your vehicle"; a visitor on the landing page hasn't chosen a
// division yet. See pages/_app.tsx for the routing that picks between them.

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/shop', label: 'Marketplace' },
  { href: '/mining', label: 'MJ Mining' },
];

export const SiteHeader: React.FC = () => {
  const { navigate, currentPath, currentUser } = useApp();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const go = (href: string) => {
    setIsMobileOpen(false);
    navigate(href);
  };

  const isActive = (href: string) => (href === '/' ? currentPath === '/' : currentPath.startsWith(href));

  return (
    <header className={`sticky top-0 z-40 bg-[#0B1220] transition-shadow duration-300 ${isScrolled || isMobileOpen ? 'shadow-lg shadow-black/20 border-b border-white/10' : 'border-b border-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-[72px]">
          <button type="button" onClick={() => go('/')} className="flex items-center gap-2.5 text-left cursor-pointer group shrink-0">
            <div className="w-8 h-8 sm:w-9 sm:h-9 bg-white rounded-md flex items-center justify-center text-[#0077C7] shadow-sm"><Wrench className="w-5 h-5 transform -rotate-12" /></div>
            <span className="text-white font-bold text-base sm:text-lg tracking-tight">MJ Logistics <span className="text-white/50 font-medium">Enterprise</span></span>
          </button>

          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map(link => (
              <button
                key={link.href}
                type="button"
                onClick={() => go(link.href)}
                className={`px-4 py-2 text-sm font-semibold rounded-full transition-colors cursor-pointer ${isActive(link.href) ? 'text-white bg-white/10' : 'text-white/70 hover:text-white hover:bg-white/5'}`}
              >
                {link.label}
              </button>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-3 shrink-0">
            <button type="button" onClick={() => go(currentUser ? '/account' : '/login')} className="text-sm font-semibold text-white/80 hover:text-white px-3 py-2 transition-colors cursor-pointer">
              {currentUser ? 'My Account' : 'Sign In'}
            </button>
            <button type="button" onClick={() => go('/shop')} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white text-[#0B1220] text-sm font-bold hover:bg-slate-100 transition-colors cursor-pointer">
              <span>Shop Parts</span><ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <button type="button" onClick={() => setIsMobileOpen(o => !o)} aria-expanded={isMobileOpen} aria-label="Toggle menu" className="md:hidden p-2 -mr-2 text-white cursor-pointer">
            {isMobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {isMobileOpen && (
        <div className="md:hidden border-t border-white/10 bg-[#0B1220]">
          <div className="px-4 sm:px-6 py-3 flex flex-col">
            {NAV_LINKS.map(link => (
              <button key={link.href} type="button" onClick={() => go(link.href)} className={`text-left py-3 text-base font-semibold border-b border-white/5 cursor-pointer ${isActive(link.href) ? 'text-white' : 'text-white/70'}`}>
                {link.label}
              </button>
            ))}
            <button type="button" onClick={() => go(currentUser ? '/account' : '/login')} className="text-left py-3 text-base font-semibold text-white/70 border-b border-white/5 cursor-pointer">
              {currentUser ? 'My Account' : 'Sign In'}
            </button>
            <button type="button" onClick={() => go('/shop')} className="mt-4 mb-2 w-full text-center py-3 rounded-full bg-white text-[#0B1220] text-sm font-bold cursor-pointer">
              Shop Parts
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
