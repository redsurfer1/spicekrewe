import Navbar from '../components/Navigation';
import Footer from '../components/Footer';
import SEO from '../components/SEO';

export default function JoinAsProf() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <SEO title="Join as a professional – Spice Krewe" path="/join" />
      <Navbar />
      <main
        style={{
          flex: 1,
          padding: '64px 32px',
          textAlign: 'center',
          background: '#f8f6fc',
        }}
      >
        <h1
          style={{
            fontSize: 28,
            fontWeight: 600,
            color: '#1a1a2e',
            marginBottom: 12,
          }}
        >
          Join as a professional
        </h1>
        <p
          style={{
            color: '#6b5a88',
            maxWidth: 420,
            margin: '0 auto',
            lineHeight: 1.6,
          }}
        >
          Apply to the Spice Krewe verified network. Credentialing and onboarding steps will appear here.
        </p>
      </main>
      <Footer />
    </div>
  );
}
