import Navbar from '../components/Navigation';
import About from '../components/About';
import Footer from '../components/Footer';
import SEO from '../components/SEO';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <SEO title="About Spice Krewe – Hire Vetted Culinary Professionals" path="/about" />
      <Navbar />
      <About />
      <Footer />
    </div>
  );
}
