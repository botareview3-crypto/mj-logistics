import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, Wrench, ArrowUpRight, Phone, Search, ShoppingCart, User, ChevronDown, Globe } from 'lucide-react';
import { useApp } from '../lib/AppContext';

// Professional header for corporate/marketing pages with full navigation structure
// Based on enterprise website standards with utility bar, dropdown navigation, and comprehensive menu

const NAV_ITEMS = [
  { label: 'Home', href: '/' },
  {
    label: 'Products & Services',
    hasDropdown: true,
    items: [
      { label: 'Auto Parts', href: '/shop', description: 'Verified fitment data & marketplace' },
      { label: 'Industrial Equipment', href: '/catalog', description: 'Heavy-duty machinery & components' },
      { label: 'Mining', href: '/mining', description: 'Diamond & gold responsible sourcing' }
    ]
  },
  { label: 'Divisions', href: '/divisions' },
  { label: 'Advantages', href: '/advantages' },
  { label: 'Request Info', href: '/contact' }
];

export const SiteHeader: React.FC = () => {
  const { navigate, currentPath, currentUser, cartCount } = useApp();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [desktopDropdownOpen, setDesktopDropdownOpen] = useState(false);
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState(-1);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDesktopDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const go = (href: string) => {
    setIsMobileOpen(false);
    setDesktopDropdownOpen(false);
    setMobileDropdownOpen(-1);
    navigate(href);
  };

  const isActive = (href: string) => (href === '/' ? currentPath === '/' : currentPath.startsWith(href));

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
  };

  return (
    <header className="sticky top-0 z-50 bg-white">
      {/* Top Utility Bar */}
      <div className="bg-[#004494] text-white text-xs py-2 px-4 sm:px-6 lg:px-8 border-b border-white/10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4 sm:gap-6">
            <div className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-sky-200" />
              <span className="font-medium">+1 (800) 655-4321</span>
            </div>
            <div className="hidden sm:flex items-center gap-2">
              <Globe className="w-3.5 h-3.5 text-sky-200" />
              <span className="font-medium">EN</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button type="button" onClick={() => go(currentUser ? '/account' : '/signin')} className="flex items-center gap-1.5 hover:text-sky-200 transition-colors cursor-pointer">
              <User className="w-3.5 h-3.5" />
              <span className="font-medium">{currentUser ? 'Account' : 'Sign In'}</span>
            </button>
            <button type="button" onClick={() => go('/cart')} className="flex items-center gap-1.5 hover:text-sky-200 transition-colors cursor-pointer relative">
              <ShoppingCart className="w-3.5 h-3.5" />
              <span className="font-medium">Cart</span>
              {cartCount > 0 && <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-bold">{cartCount}</span>}
            </button>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className={`bg-white border-b border-slate-200 transition-shadow duration-300 ${isScrolled ? 'shadow-md' : ''}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-[72px]">
            {/* Logo */}
            <button type="button" onClick={() => go('/')} className="flex items-center gap-2.5 text-left cursor-pointer group shrink-0">
              <div className="w-8 h-8 sm:w-9 sm:h-9 bg-[#0056b3] rounded-md flex items-center justify-center text-white shadow-sm"><Wrench className="w-5 h-5 transform -rotate-12" /></div>
              <span className="text-slate-900 font-bold text-base sm:text-lg tracking-tight">MJ Logistics <span className="text-[#0056b3] font-medium">Enterprise</span></span>
            </button>

            {/* Main Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {NAV_ITEMS.map((item) => (
                <div key={item.label} className="relative" ref={item.hasDropdown ? dropdownRef : null}>
                  {item.hasDropdown ? (
                    <>
                      <button
                        type="button"
                        onClick={() => setDesktopDropdownOpen(!desktopDropdownOpen)}
                        className="flex items-center gap-1 px-4 py-2 text-sm font-semibold text-slate-700 hover:text-[#0056b3] transition-colors cursor-pointer"
                      >
                        {item.label}
                        <ChevronDown className={`w-4 h-4 transition-transform ${desktopDropdownOpen ? 'rotate-180' : ''}`} />
                      </button>
                      {desktopDropdownOpen && (
                        <div className="absolute top-full left-0 mt-1 w-64 bg-white rounded-lg shadow-xl border border-slate-200 py-2 z-50">
                          {item.items?.map((subItem) => (
                            <button
                              key={subItem.label}
                              type="button"
                              onClick={() => go(subItem.href)}
                              className="w-full text-left px-4 py-2 hover:bg-slate-50 transition-colors cursor-pointer group"
                            >
                              <div className="text-sm font-semibold text-slate-900 group-hover:text-[#0056b3]">{subItem.label}</div>
                              <div className="text-xs text-slate-500">{subItem.description}</div>
                            </button>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={() => go(item.href || '#')}
                      className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-[#0056b3] transition-colors cursor-pointer"
                    >
                      {item.label}
                    </button>
                  )}
                </div>
              ))}
            </nav>

            {/* Right Utilities */}
            <div className="hidden lg:flex items-center gap-3 shrink-0">
              {/* Search */}
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search..."
                  className="w-48 px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0056b3] focus:border-transparent"
                />
                <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#0056b3] cursor-pointer">
                  <Search className="w-4 h-4" />
                </button>
              </form>

              {/* CTA Button */}
              <button
                type="button"
                onClick={() => go('/contact')}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0056b3] hover:bg-[#004494] text-white text-sm font-bold rounded-lg transition-colors cursor-pointer"
              >
                <span>Get Quote</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              type="button"
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              aria-expanded={isMobileOpen}
              aria-label="Toggle menu"
              className="lg:hidden p-2 text-slate-700 cursor-pointer"
            >
              {isMobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileOpen && (
        <div className="lg:hidden bg-white border-t border-slate-200">
          <div className="px-4 sm:px-6 py-4">
            {/* Mobile Search */}
            <form onSubmit={handleSearch} className="mb-4">
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className="w-full px-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0056b3]"
              />
            </form>

            {/* Mobile Navigation */}
            <div className="space-y-1">
              {NAV_ITEMS.map((item, index) => (
                <div key={item.label}>
                  {item.hasDropdown ? (
                    <div className="border-b border-slate-100">
                      <button
                        type="button"
                        onClick={() => setMobileDropdownOpen(mobileDropdownOpen === index ? -1 : index)}
                        className="w-full flex items-center justify-between py-3 text-base font-semibold text-slate-700 cursor-pointer"
                      >
                        {item.label}
                        <ChevronDown className={`w-4 h-4 transition-transform ${mobileDropdownOpen === index ? 'rotate-180' : ''}`} />
                      </button>
                      {mobileDropdownOpen === index && (
                        <div className="pl-4 pb-2 space-y-1">
                          {item.items?.map((subItem) => (
                            <button
                              key={subItem.label}
                              type="button"
                              onClick={() => go(subItem.href)}
                              className="w-full text-left py-2 text-sm text-slate-600 hover:text-[#0056b3] cursor-pointer"
                            >
                              {subItem.label}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => go(item.href || '#')}
                      className="w-full text-left py-3 text-base font-semibold text-slate-700 border-b border-slate-100 cursor-pointer"
                    >
                      {item.label}
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Mobile Utility Items */}
            <div className="mt-4 pt-4 border-t border-slate-200 space-y-2">
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Phone className="w-4 h-4" />
                <span>+1 (800) 655-4321</span>
              </div>
              <button
                type="button"
                onClick={() => go(currentUser ? '/account' : '/signin')}
                className="flex items-center gap-2 text-sm font-semibold text-slate-700 cursor-pointer"
              >
                <User className="w-4 h-4" />
                <span>{currentUser ? 'My Account' : 'Sign In'}</span>
              </button>
              <button
                type="button"
                onClick={() => go('/cart')}
                className="flex items-center gap-2 text-sm font-semibold text-slate-700 cursor-pointer relative"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>Cart</span>
                {cartCount > 0 && <span className="ml-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">{cartCount}</span>}
              </button>
            </div>

            {/* Mobile CTA */}
            <button
              type="button"
              onClick={() => go('/contact')}
              className="mt-4 w-full inline-flex items-center justify-center gap-2 px-5 py-3 bg-[#0056b3] text-white text-sm font-bold rounded-lg cursor-pointer"
            >
              <span>Get Quote</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
