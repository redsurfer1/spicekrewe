import Navbar from '../components/Navigation';
import Footer from '../components/Footer';
import SEO from '../components/SEO';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-sk-body-bg">
      <SEO title="Privacy Policy – Spice Krewe" path="/privacy" />
      <Navbar />
      <main className="flex-1 mx-auto w-full max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-sk-navy mb-2">Privacy Policy</h1>
        <p className="text-sm text-sk-text-subtle mb-8">Last updated: March 2026</p>

        <div className="max-w-none text-sk-text-muted space-y-6 leading-relaxed">
          <section>
            <h2 className="text-lg font-semibold text-sk-navy">Overview</h2>
            <p>
              Spice Krewe (“we”, “us”) respects your privacy. This policy describes how we collect, use, and
              safeguard information when you use our website and services, including project briefs and talent
              matching for food brands and restaurant groups.
            </p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-sk-navy">Information we process</h2>
            <p>
              We may process contact details, project descriptions, and related business information that you
              submit through forms. Payment data is handled by our payment processor (Stripe); we do not store
              full card numbers on our servers.
            </p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-sk-navy">Legal bases & consent</h2>
            <p>
              Where required by law (including GDPR), we rely on your consent or legitimate interests to
              respond to inquiries and operate our marketplace. You may withdraw consent for optional
              communications at any time by contacting us.
            </p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-sk-navy">Retention & security</h2>
            <p>
              We retain information only as long as needed for the purposes described here and apply
              administrative, technical, and organizational measures appropriate to the sensitivity of the
              data.
            </p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-sk-navy">Contact</h2>
            <p>
              Questions:{' '}
              <a href="mailto:hello@spicekrewe.com" className="text-sk-purple font-medium">
                hello@spicekrewe.com
              </a>
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
