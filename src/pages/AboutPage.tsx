import Navbar from '../components/Navigation';
import About from '../components/About';
import Footer from '../components/Footer';
import SEO from '../components/SEO';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <SEO
        title="About Spice Krewe | Memphis private chefs & food trucks"
        description="Spice Krewe is Memphis's booking platform for private chefs and food trucks — verified pros, AI concierge, secure payment."
        path="/about"
        ogTitle="About Spice Krewe | Memphis private chefs & food trucks"
        ogDescription="Spice Krewe is Memphis's booking platform for private chefs and food trucks — verified pros, AI concierge, secure payment."
      />
      <Navbar />
      <About />
      <Footer />
    </div>
  );
}
