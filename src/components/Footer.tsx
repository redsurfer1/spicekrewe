import type { CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Youtube, Heart } from 'lucide-react';

const linkMuted: CSSProperties = {
  color: 'rgba(255,255,255,0.72)',
  textDecoration: 'none',
  fontSize: 14,
};
const linkHoverClass = 'hover:opacity-100 transition-opacity';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="py-12"
      style={{
        background: 'var(--sk-navy)',
        color: '#fff',
        borderTop: '1px solid rgba(185, 158, 232, 0.2)',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-10 mb-10">
          <div className="md:col-span-2">
            <div className="text-2xl sm:text-3xl font-sans mb-4 font-semibold tracking-tight">
              <span style={{ color: '#fff' }}>Spice </span>
              <span style={{ color: 'var(--sk-muted-purple)' }}>Krewe</span>
            </div>
            <p className="mb-6 max-w-md" style={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.65, fontSize: 15 }}>
              Culinary IP and intelligence on demand: vetted professionals, secure collaboration, and a single path from
              brief to delivery.
            </p>
            <div className="flex gap-3">
              <a
                href="#"
                className="p-3 rounded-full transition-colors duration-200 hover:bg-white/10"
                style={{ background: 'rgba(77, 47, 145, 0.45)' }}
                aria-label="Facebook"
              >
                <Facebook size={20} className="text-white" />
              </a>
              <a
                href="#"
                className="p-3 rounded-full transition-colors duration-200 hover:bg-white/10"
                style={{ background: 'rgba(77, 47, 145, 0.45)' }}
                aria-label="Instagram"
              >
                <Instagram size={20} className="text-white" />
              </a>
              <a
                href="#"
                className="p-3 rounded-full transition-colors duration-200 hover:bg-white/10"
                style={{ background: 'rgba(77, 47, 145, 0.45)' }}
                aria-label="Twitter"
              >
                <Twitter size={20} className="text-white" />
              </a>
              <a
                href="#"
                className="p-3 rounded-full transition-colors duration-200 hover:bg-white/10"
                style={{ background: 'rgba(77, 47, 145, 0.45)' }}
                aria-label="Youtube"
              >
                <Youtube size={20} className="text-white" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-sm uppercase tracking-wider mb-4" style={{ color: 'var(--sk-gold)' }}>
              Marketplace
            </h3>
            <ul className="space-y-3">
              <li>
                <Link to="/talent" className={`opacity-90 ${linkHoverClass}`} style={linkMuted}>
                  Find talent
                </Link>
              </li>
              <li>
                <Link to="/hire" className={`opacity-90 ${linkHoverClass}`} style={linkMuted}>
                  Post a project
                </Link>
              </li>
              <li>
                <Link to="/for-teams" className={`opacity-90 ${linkHoverClass}`} style={linkMuted}>
                  For teams
                </Link>
              </li>
              <li>
                <Link to="/join" className={`opacity-90 ${linkHoverClass}`} style={linkMuted}>
                  Join as a professional
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-sm uppercase tracking-wider mb-4" style={{ color: 'var(--sk-gold)' }}>
              Company
            </h3>
            <ul className="space-y-3">
              <li>
                <Link to="/" className={`opacity-90 ${linkHoverClass}`} style={linkMuted}>
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className={`opacity-90 ${linkHoverClass}`} style={linkMuted}>
                  About
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" className={`opacity-90 ${linkHoverClass}`} style={linkMuted}>
                  How it works
                </Link>
              </li>
            </ul>
            <h3 className="font-bold text-sm uppercase tracking-wider mt-8 mb-4" style={{ color: 'var(--sk-gold)' }}>
              Contact
            </h3>
            <ul className="space-y-2" style={{ color: 'rgba(255,255,255,0.7)', fontSize: 14 }}>
              <li>123 Community Street</li>
              <li>Memphis, TN 38107</li>
              <li className="mt-3">
                <a href="mailto:hello@spicekrewe.com" style={{ color: 'var(--sk-muted-purple)' }} className="underline-offset-2 hover:underline">
                  hello@spicekrewe.com
                </a>
              </li>
              <li>901-295-9491</li>
            </ul>
          </div>
        </div>

        <div
          className="pt-8 flex flex-col sm:flex-row justify-between items-center gap-4"
          style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}
        >
          <p className="text-sm flex items-center gap-2" style={{ color: 'rgba(255,255,255,0.55)' }}>
            {currentYear} Spice Krewe. Made with <Heart size={16} style={{ color: 'var(--sk-muted-purple)' }} /> for our community.
          </p>
          <div className="flex gap-6 text-sm" style={{ color: 'rgba(255,255,255,0.55)' }}>
            <a href="#" className="hover:text-white transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
