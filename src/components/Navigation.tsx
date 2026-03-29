import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDown, Menu, X } from 'lucide-react';
import SpiceKreweWordmark from './SpiceKreweWordmark';

const hireConversionLinks = [
  { to: '/guides/pricing-2025', label: '2025 service rates' },
  { to: '/hire/recipe-developer', label: 'Hire recipe developer' },
  { to: '/hire/food-stylist', label: 'Hire food stylist' },
  { to: '/hire/culinary-consultant', label: 'Hire culinary consultant' },
] as const;

const navLinks: { to: string; label: string; title?: string }[] = [
  { to: '/talent', label: 'Find talent' },
  { to: '/how-it-works', label: 'How it works' },
  { to: '/for-teams', label: 'For teams', title: 'Culinary R&D for food brands and restaurant groups' },
  { to: '/about', label: 'About' },
];

const linkClass =
  'text-sm font-medium text-sk-purple-light no-underline hover:opacity-90 transition-opacity';

/**
 * Spice Krewe shell — PEMBU-inspired max-width row + border, with Krewe branding and mobile sheet (Tier 2 merge).
 */
export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hireMenuOpen, setHireMenuOpen] = useState(false);
  const hireMenuRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  useEffect(() => {
    setMobileOpen(false);
    setHireMenuOpen(false);
  }, [location.pathname, location.search]);

  useEffect(() => {
    if (!hireMenuOpen) return;
    const onDocClick = (e: MouseEvent) => {
      if (hireMenuRef.current && !hireMenuRef.current.contains(e.target as Node)) {
        setHireMenuOpen(false);
      }
    };
    document.addEventListener('click', onDocClick);
    return () => document.removeEventListener('click', onDocClick);
  }, [hireMenuOpen]);

  return (
    <header className="sticky top-0 z-[100] border-b border-sk-purple-light/20 bg-sk-navy backdrop-blur-md">
      <nav className="relative mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-2.5 sm:px-6 lg:px-8 min-h-[56px]">
        <Link
          to="/"
          className="z-[2] shrink-0 no-underline flex items-center min-h-[44px]"
          aria-label="Spice Krewe home"
        >
          <SpiceKreweWordmark className="h-7 shrink-0 sm:h-8" />
        </Link>

        {/* Desktop center links */}
        <div className="pointer-events-none absolute inset-x-0 top-1/2 hidden -translate-y-1/2 justify-center lg:flex">
          <div className="pointer-events-auto flex items-center gap-8">
            {navLinks.map(({ to, label, title }) => (
              <Link key={to} to={to} className={linkClass} title={title}>
                {label}
              </Link>
            ))}
            <div ref={hireMenuRef} className="relative">
              <button
                type="button"
                className={`inline-flex items-center gap-1 ${linkClass} cursor-pointer border-0 bg-transparent p-0 font-[inherit]`}
                aria-expanded={hireMenuOpen}
                aria-haspopup="menu"
                aria-controls="sk-hire-funnel-menu"
                id="sk-hire-funnel-trigger"
                onClick={(e) => {
                  e.stopPropagation();
                  setHireMenuOpen((o) => !o);
                }}
              >
                Hire specialists
                <ChevronDown className={`h-4 w-4 shrink-0 transition-transform ${hireMenuOpen ? 'rotate-180' : ''}`} aria-hidden />
              </button>
              {hireMenuOpen ? (
                <div
                  id="sk-hire-funnel-menu"
                  role="menu"
                  aria-labelledby="sk-hire-funnel-trigger"
                  className="absolute left-0 top-full z-[120] mt-2 min-w-[240px] rounded-sk-md border border-sk-purple-light/25 bg-sk-navy py-2 shadow-xl"
                >
                  {hireConversionLinks.map(({ to, label }) => (
                    <Link
                      key={to}
                      to={to}
                      role="menuitem"
                      className="block px-4 py-2.5 text-sm font-medium text-sk-purple-light no-underline hover:bg-white/10"
                      onClick={() => setHireMenuOpen(false)}
                    >
                      {label}
                    </Link>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        </div>

        <div className="z-10 ml-auto flex items-center gap-2 sm:gap-3">
          <Link
            to="/login"
            className="hidden min-h-[44px] items-center rounded-sk-sm border border-sk-purple-light/40 px-4 py-2.5 text-[13px] text-sk-purple-light no-underline sm:inline-flex"
          >
            Log in
          </Link>
          <Link
            to="/hire"
            className="inline-flex min-h-[44px] items-center rounded-sk-sm bg-sk-purple px-4 py-2.5 text-[13px] font-bold text-white no-underline shadow-md shadow-sk-purple/40"
          >
            Post a project
          </Link>

          <button
            type="button"
            className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-md border border-sk-purple-light/35 bg-sk-purple/35 text-white lg:hidden"
            aria-expanded={mobileOpen}
            aria-controls="sk-mobile-nav"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            onClick={() => setMobileOpen((o) => !o)}
          >
            {mobileOpen ? (
              <X size={22} className="text-white" strokeWidth={2} aria-hidden />
            ) : (
              <Menu size={22} className="text-white" strokeWidth={2} aria-hidden />
            )}
          </button>
        </div>
      </nav>

      {mobileOpen ? (
        <div
          id="sk-mobile-nav"
          className="border-t border-sk-purple-light/15 bg-sk-navy px-4 pb-5 pt-3 lg:hidden"
        >
          <div className="mx-auto flex max-w-7xl flex-col gap-1">
            {navLinks.map(({ to, label, title }) => (
              <Link
                key={to}
                to={to}
                onClick={() => setMobileOpen(false)}
                className={`rounded-sk-md px-3 py-3.5 ${linkClass}`}
                title={title}
              >
                {label}
              </Link>
            ))}
            <p className="mt-3 px-3 text-[11px] font-bold uppercase tracking-wider text-sk-gold">Hire specialists</p>
            {hireConversionLinks.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                onClick={() => setMobileOpen(false)}
                className={`rounded-sk-md px-3 py-3.5 ${linkClass}`}
              >
                {label}
              </Link>
            ))}
            <Link
              to="/login"
              onClick={() => setMobileOpen(false)}
              className="mt-2 rounded-sk-md border border-sk-purple-light/35 px-3 py-3.5 text-sm font-semibold text-sk-purple-light no-underline"
            >
              Log in
            </Link>
            <Link
              to="/hire"
              onClick={() => setMobileOpen(false)}
              className="mt-3 flex min-h-[44px] w-full items-center justify-center rounded-sk-sm bg-sk-purple px-4 py-2.5 text-[13px] font-bold text-white no-underline shadow-md shadow-sk-purple/40"
            >
              Post a project
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  );
}
