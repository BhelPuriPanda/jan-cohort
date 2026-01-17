import React from 'react';

export default function Footer() {

  const footerSections = {
    Platform: ['Intelligence', 'Workflows', 'Security', 'Roadmap'],
    Company: ['Manifesto', 'Careers', 'Journal', 'Contact'],
    Legal: ['Privacy Policy', 'Terms of Service', 'Cookie Settings'],
  };

  return (
    <footer className="bg-black border-t border-white/5 pt-24 pb-12 relative overflow-hidden z-10">
      
      <div className="max-w-[1600px] mx-auto px-6 lg:px-16 relative z-20">
        
        {/* --- Top Section: Brand --- */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-24 border-b border-white/5 pb-16">
          <div className="max-w-xl">
            <h2 className="text-6xl md:text-9xl font-display font-extrabold text-white tracking-tighter leading-[0.85] mb-6">
              Clarity.
            </h2>
            <p className="text-lg md:text-xl text-gray-500 font-sans font-light tracking-wide max-w-sm">
              The intelligence layer for modern hiring teams.
            </p>
          </div>
        </div>

        {/* --- Middle Section: Grid --- */}
        <div className="grid grid-cols-2 md:grid-cols-12 gap-y-12 gap-x-8 mb-24">
          
          {/* Left Side: The "C." Logo & Description (Previously Empty/Spacer) */}
          <div className="col-span-2 md:col-span-6 pr-12">
            
            {/* --- REPLACED THE DIV WITH THE C. LOGO HERE --- */}
            <span className="font-sans font-extrabold text-3xl text-white tracking-tighter mb-6 block">
              C.
            </span>
            
            <p className="text-sm text-gray-500 leading-relaxed max-w-[240px]">
              Dismantling the chaos of modern hiring with precision engineering.
            </p>
          </div>

          {/* Right Side: Links */}
          {Object.entries(footerSections).map(([title, items]) => (
            <div key={title} className="col-span-1 md:col-span-2">
              <h4 className="font-mono text-[10px] text-teal-500 uppercase tracking-widest mb-8">
                {title}
              </h4>
              <ul className="space-y-4">
                {items.map((item) => (
                  <li key={item}>
                    <a href="#" className="text-sm font-sans text-gray-400 hover:text-white transition-colors duration-300 block w-fit hover:translate-x-1 transform transition-transform">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

        </div>

        {/* --- Bottom Section: Credits & Signature --- */}
        <div className="flex flex-col md:flex-row justify-between items-end md:items-center pt-8 border-t border-white/5">
          <div className="text-[10px] text-gray-600 font-mono uppercase tracking-widest mb-6 md:mb-0">
            © 2026 Clarity Intelligence Inc.
          </div>
          <div className="flex flex-col md:flex-row items-end md:items-center gap-4">
            <span className="text-[10px] text-gray-600 font-mono uppercase tracking-[0.2em]">
              Handcrafted by
            </span>
            <a href="#" className="group relative flex items-center">
              <span className="font-cursive text-3xl md:text-4xl text-transparent bg-clip-text bg-gradient-to-r from-teal-200 to-teal-500 group-hover:from-white group-hover:to-teal-200 transition-all duration-500 pb-2"
                    style={{ textShadow: '0 0 30px rgba(45,212,191,0.15)' }}>
                ThatsWhatSheCoded
              </span>
              <span className="absolute bottom-2 left-0 w-0 h-[1px] bg-gradient-to-r from-teal-400 to-transparent group-hover:w-full transition-all duration-700 ease-out"></span>
            </a>
          </div>
        </div>

      </div>

      <div className="absolute inset-0 opacity-[0.02] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] pointer-events-none"></div>

    </footer>
  );
}
