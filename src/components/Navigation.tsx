import { useState } from 'react';
import { Menu, X } from 'lucide-react';

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white shadow-lg fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <img
              src="/assets/images/brand/SpiceKrewe_Logo_Transparent_background.png"
              alt="Spice Krewe"
              className="h-16 w-auto"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const parent = target.parentElement;
                if (parent) {
                  const textSpan = document.createElement('span');
                  textSpan.className = 'text-2xl font-bold bg-gradient-to-r from-spice-purple to-spice-blue bg-clip-text text-transparent';
                  textSpan.textContent = 'Spice Krewe';
                  parent.appendChild(textSpan);
                }
              }}
            />
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <a href="#about" className="text-gray-700 hover:text-spice-purple transition-colors duration-200 font-medium">
              About
            </a>
            <a href="#events" className="text-gray-700 hover:text-spice-purple transition-colors duration-200 font-medium">
              Events
            </a>
            <a href="#contact" className="text-gray-700 hover:text-spice-purple transition-colors duration-200 font-medium">
              Contact
            </a>
            <button className="bg-gradient-to-r from-spice-purple to-spice-blue text-white px-6 py-2 rounded-full font-semibold hover:shadow-lg transition-all duration-200">
              Join Us
            </button>
          </div>

          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-spice-purple transition-colors duration-200"
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <a
              href="#about"
              className="block px-3 py-2 text-gray-700 hover:text-spice-purple hover:bg-gray-50 rounded-md transition-colors duration-200"
              onClick={() => setIsOpen(false)}
            >
              About
            </a>
            <a
              href="#events"
              className="block px-3 py-2 text-gray-700 hover:text-spice-purple hover:bg-gray-50 rounded-md transition-colors duration-200"
              onClick={() => setIsOpen(false)}
            >
              Events
            </a>
            <a
              href="#contact"
              className="block px-3 py-2 text-gray-700 hover:text-spice-purple hover:bg-gray-50 rounded-md transition-colors duration-200"
              onClick={() => setIsOpen(false)}
            >
              Contact
            </a>
            <button className="w-full text-left px-3 py-2 bg-gradient-to-r from-spice-purple to-spice-blue text-white rounded-md font-semibold">
              Join Us
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
