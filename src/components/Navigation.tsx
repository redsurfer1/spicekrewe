import { useEffect, useState, type CSSProperties } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const linkStyle: CSSProperties = {
  color: 'var(--sk-muted-purple)',
  textDecoration: 'none',
  fontSize: 14,
  fontWeight: 500,
};

const postProjectCta: CSSProperties = {
  fontSize: 13,
  minHeight: 44,
  padding: '10px 16px',
  display: 'inline-flex',
  alignItems: 'center',
  boxSizing: 'border-box',
  borderRadius: 'var(--sk-radius-sm)',
  background: 'linear-gradient(180deg, var(--sk-purple-mid) 0%, var(--sk-purple) 100%)',
  color: '#fff',
  textDecoration: 'none',
  fontWeight: 700,
  border: '2px solid var(--sk-gold)',
  boxShadow: '0 4px 16px rgba(77, 47, 145, 0.38)',
};

const navLinks: { to: string; label: string; title?: string }[] = [
  { to: '/talent', label: 'Find talent' },
  { to: '/how-it-works', label: 'How it works' },
  { to: '/for-teams', label: 'For teams', title: 'Culinary R&D for food brands and restaurant groups' },
  { to: '/about', label: 'About' },
];

/**
 * Spice Krewe shell — PEMBU-inspired max-width row + border, with Krewe branding and mobile sheet (Tier 2 merge).
 */
export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname, location.search]);

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: 'rgba(26, 26, 46, 0.92)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(185, 158, 232, 0.18)',
      }}
    >
      <nav
        className="relative max-w-7xl mx-auto flex items-center justify-between gap-4 px-4 sm:px-6 lg:px-8"
        style={{ minHeight: 56, paddingTop: 10, paddingBottom: 10 }}
      >
        <Link
          to="/"
          style={{
            fontSize: 17,
            fontWeight: 600,
            color: '#fff',
            textDecoration: 'none',
            letterSpacing: '-0.02em',
            flexShrink: 0,
            zIndex: 2,
          }}
        >
          Spice <span style={{ color: 'var(--sk-muted-purple)' }}>Krewe</span>
        </Link>

        {/* Desktop center links */}
        <div className="hidden lg:flex absolute inset-x-0 top-1/2 -translate-y-1/2 pointer-events-none justify-center">
          <div className="flex items-center gap-8 pointer-events-auto">
            {navLinks.map(({ to, label, title }) => (
              <Link key={to} to={to} style={linkStyle} title={title}>
                {label}
              </Link>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 ml-auto z-10">
          <Link
            to="/login"
            className="hidden sm:inline-flex"
            style={{
              fontSize: 13,
              minHeight: 44,
              padding: '10px 16px',
              display: 'inline-flex',
              alignItems: 'center',
              boxSizing: 'border-box',
              borderRadius: 'var(--sk-radius-sm)',
              border: '0.5px solid rgba(179, 153, 232, 0.4)',
              color: '#d9ccf4',
              textDecoration: 'none',
              background: 'transparent',
            }}
          >
            Log in
          </Link>
          <Link to="/hire" style={postProjectCta}>
            Post a project
          </Link>

          <button
            type="button"
            className="lg:hidden flex items-center justify-center rounded-md"
            style={{
              minWidth: 44,
              minHeight: 44,
              border: '1px solid rgba(185, 158, 232, 0.35)',
              background: 'rgba(77, 47, 145, 0.35)',
              color: '#fff',
            }}
            aria-expanded={mobileOpen}
            aria-controls="sk-mobile-nav"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            onClick={() => setMobileOpen((o) => !o)}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {mobileOpen ? (
        <div
          id="sk-mobile-nav"
          className="lg:hidden border-t"
          style={{
            borderColor: 'rgba(185, 158, 232, 0.15)',
            background: 'var(--sk-navy)',
            padding: '12px 16px 20px',
          }}
        >
          <div className="flex flex-col gap-1 max-w-7xl mx-auto">
            {navLinks.map(({ to, label, title }) => (
              <Link
                key={to}
                to={to}
                onClick={() => setMobileOpen(false)}
                style={{
                  ...linkStyle,
                  padding: '14px 12px',
                  borderRadius: 'var(--sk-radius-md)',
                  color: '#fff',
                }}
                title={title}
              >
                {label}
              </Link>
            ))}
            <Link
              to="/login"
              onClick={() => setMobileOpen(false)}
              style={{
                marginTop: 8,
                padding: '14px 12px',
                fontSize: 14,
                fontWeight: 600,
                color: 'var(--sk-muted-purple)',
                textDecoration: 'none',
                borderRadius: 'var(--sk-radius-md)',
                border: '1px solid rgba(179, 153, 232, 0.35)',
              }}
            >
              Log in
            </Link>
            <Link
              to="/hire"
              onClick={() => setMobileOpen(false)}
              style={{
                ...postProjectCta,
                marginTop: 12,
                width: '100%',
                justifyContent: 'center',
              }}
            >
              Post a project
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  );
}
