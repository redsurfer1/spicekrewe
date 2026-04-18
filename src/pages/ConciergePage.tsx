import { useLocation, useNavigate } from 'react-router-dom';
import { ConciergeForm } from '../components/ConciergeForm';
import SEO from '../components/SEO';
import { useAuth } from '../lib/auth/useAuth';
import { useCity } from '../context/CityContext';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import { CalendarDays, FileText, ShieldCheck } from 'lucide-react';

const DARK_BG = '#1a162e';
const ACCENT = '#5e35b1';

export default function ConciergePage() {
  const { citySlug, cityDisplayName } = useCity();
  const { buyerId, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSignIn = () => {
    navigate('/login', { state: { from: location.pathname + location.search } });
  };

  const handleCreateAccount = () => {
    navigate('/login', {
      state: { defaultTab: 'register', from: location.pathname + location.search },
    });
  };

  if (loading) {
    return (
      <>
        <Navigation />
        <main
          className="min-h-screen flex items-center justify-center"
          style={{ background: DARK_BG }}
        >
          <p className="text-white/60 text-sm animate-pulse">Checking your session…</p>
        </main>
        <Footer />
      </>
    );
  }

  if (buyerId) {
    return (
      <>
        <SEO
          title={`Event Concierge — ${cityDisplayName} | Spice Krewe`}
          description="Tell us about your event — our concierge connects you with a vetted private chef or food truck in minutes."
        />
        <Navigation />
        <main className="min-h-screen" style={{ background: DARK_BG }}>
          <ConciergeForm citySlug={citySlug} cityDisplayName={cityDisplayName} buyerId={buyerId} />
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <SEO
        title={`Event Concierge — ${cityDisplayName} | Spice Krewe`}
        description="Tell us about your event — our concierge connects you with a vetted private chef or food truck in minutes."
      />
      <Navigation />

      <main
        className="min-h-screen flex flex-col"
        style={{ background: DARK_BG }}
      >
        <section className="flex-1 flex flex-col items-center justify-center px-4 py-20 sm:py-28">
          <div className="w-full max-w-lg">
            <div className="text-center mb-10">
              <p
                className="text-xs font-bold uppercase tracking-widest mb-4"
                style={{ color: '#f5a623', fontFamily: '"Barlow Condensed", system-ui, sans-serif' }}
              >
                Event Concierge
              </p>
              <h1
                className="text-4xl sm:text-5xl font-extrabold text-white leading-tight mb-4"
                style={{ fontFamily: '"Barlow Condensed", system-ui, sans-serif' }}
              >
                Start Your Culinary Journey
              </h1>
              <p className="text-white/60 text-base leading-relaxed max-w-sm mx-auto">
                Private chefs and food trucks, matched to your event in {cityDisplayName} — curated by the Spice Krewe concierge team.
              </p>
            </div>

            <div
              className="rounded-2xl p-8 sm:p-10 border"
              style={{
                background: 'rgba(255,255,255,0.04)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                borderColor: 'rgba(255,255,255,0.10)',
              }}
            >
              <h2
                className="text-2xl font-bold text-white mb-2"
                style={{ fontFamily: '"Barlow Condensed", system-ui, sans-serif' }}
              >
                Personalize Your Event Brief
              </h2>
              <p className="text-white/55 text-sm leading-relaxed mb-8">
                Sign in to save your event details, track your match status, and access your custom Technical Requirements Document (TRD).
              </p>

              <ul className="space-y-3 mb-8">
                {[
                  { icon: CalendarDays, text: 'Save and revisit your event brief anytime' },
                  { icon: FileText, text: 'Receive your personalized TRD within 24 hours' },
                  { icon: ShieldCheck, text: 'Matched exclusively to Spice Krewe verified talent' },
                ].map(({ icon: Icon, text }) => (
                  <li key={text} className="flex items-start gap-3">
                    <span
                      className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full"
                      style={{ background: `${ACCENT}33` }}
                    >
                      <Icon size={13} style={{ color: '#a78bfa' }} />
                    </span>
                    <span className="text-sm text-white/70 leading-snug">{text}</span>
                  </li>
                ))}
              </ul>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={handleSignIn}
                  className="flex-1 py-3 px-6 rounded-xl text-sm font-bold text-white transition-opacity hover:opacity-90 active:scale-[0.98]"
                  style={{ background: ACCENT, fontFamily: '"Barlow Condensed", system-ui, sans-serif', fontSize: '0.9375rem' }}
                >
                  Sign in
                </button>
                <button
                  type="button"
                  onClick={handleCreateAccount}
                  className="flex-1 py-3 px-6 rounded-xl text-sm font-bold transition-colors border hover:bg-white/10 active:scale-[0.98]"
                  style={{
                    color: 'white',
                    borderColor: 'rgba(255,255,255,0.20)',
                    fontFamily: '"Barlow Condensed", system-ui, sans-serif',
                    fontSize: '0.9375rem',
                  }}
                >
                  Create a free account
                </button>
              </div>

              <p className="text-center text-white/30 text-xs mt-6">
                Free to use &middot; No commitment required &middot; Spice Krewe concierge
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
