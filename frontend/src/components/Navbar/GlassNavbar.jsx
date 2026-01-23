import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const GlassNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const scrollToSection = (id) => {
    if (location.pathname !== '/') {
      navigate('/');
      // Allow time for navigation to complete
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      } else if (id === 'home') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto pointer-events-auto">
      <div className="relative flex items-center justify-between px-2 py-2 bg-[#0a0a0a]/60 backdrop-blur-xl border border-white/5 rounded-full shadow-2xl">

        {/* Left: Logo (Clickable -> Home) */}
        <div
          onClick={() => scrollToSection('home')}
          className="flex items-center justify-center w-12 h-12 cursor-pointer hover:opacity-80 transition-opacity"
        >
          <span className="text-2xl font-bold text-white font-serif italic tracking-tighter">C.</span>
        </div>

        {/* Center: Links */}
        <div className="hidden md:flex items-center gap-12 text-[11px] font-medium tracking-[0.2em] text-gray-300">
          <button
            onClick={() => scrollToSection('manifesto')}
            className="hover:text-white transition-colors duration-300 relative group uppercase bg-transparent border-none cursor-pointer"
          >
            MANIFESTO
            <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-white transition-all duration-300 group-hover:w-full"></span>
          </button>
          <button
            onClick={() => scrollToSection('intelligence')}
            className="hover:text-white transition-colors duration-300 relative group uppercase bg-transparent border-none cursor-pointer"
          >
            INTELLIGENCE
            <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-white transition-all duration-300 group-hover:w-full"></span>
          </button>
          <button
            onClick={() => scrollToSection('team')}
            className="hover:text-white transition-colors duration-300 relative group uppercase bg-transparent border-none cursor-pointer"
          >
            TEAM
            <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-white transition-all duration-300 group-hover:w-full"></span>
          </button>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-3">
          <div
            onClick={() => navigate('/signup')}
            className="group flex items-center justify-center w-12 h-12 bg-white rounded-full text-black hover:scale-105 transition-transform duration-300 cursor-pointer shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_25px_rgba(45,212,191,0.4)]"
          >
            <ArrowUpRight
              strokeWidth={2.5}
              size={20}
              className="transition-transform duration-300 group-hover:rotate-45"
            />
          </div>
        </div>

      </div>
    </div>
  );
};

export default GlassNavbar;