import React from 'react';
import { motion } from 'framer-motion';

const companies = [
  "Acme Corp.",
  "GlobalBank",
  "TechFlow",
  "Velocita"
];

// Animation: Staggered entrance for the list
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.2
    }
  }
};

// Animation: Individual item slide up + unblur
const itemVariants = {
  hidden: { opacity: 0, y: 20, filter: "blur(10px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.8, ease: [0.2, 0.65, 0.3, 0.9] }
  }
};

const TrustedBy = () => {
  return (
    <section className="relative z-10 py-24 border-t border-white/5 bg-black/50 backdrop-blur-sm">
      <div className="max-w-[1600px] mx-auto px-6 lg:px-16 grid grid-cols-1 md:grid-cols-4 gap-12 items-start">
        
        {/* Left column - Section label */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="col-span-1 border-l border-teal-400 pl-6 py-1"
        >
          <p className="text-[10px] font-mono uppercase tracking-[0.25em] text-teal-400 mb-4">
            01 — Trusted By
          </p>
          <p className="text-gray-400 text-sm font-light leading-relaxed max-w-[200px]">
            Powering the hiring intelligence of the world's most discerning teams.
          </p>
        </motion.div>
        
        {/* Right column - Company logos with Staggered Animation */}
        <motion.div 
          className="col-span-1 md:col-span-3 grid grid-cols-2 md:grid-cols-4 gap-x-12 gap-y-12 items-center"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {companies.map((company, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="group cursor-pointer opacity-60 hover:opacity-100 transition-opacity duration-500"
            >
              {/* Company name */}
              <span className="block text-2xl md:text-3xl font-serif italic text-white transition-colors duration-500">
                {company}
              </span>
              
              {/* Animated underline that expands on hover */}
              <div className="h-px w-0 group-hover:w-full bg-gradient-to-r from-teal-400 to-transparent transition-all duration-700 mt-2"></div>
            </motion.div>
          ))}
        </motion.div>

      </div>

      
    </section>
  );
};

export default TrustedBy;