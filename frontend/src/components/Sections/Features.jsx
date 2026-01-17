import React from 'react';
import { motion } from 'framer-motion';

// --- Animation Variants ---
const slideFromLeft = {
  hidden: { x: -50, opacity: 0 },
  visible: { 
    x: 0, 
    opacity: 1,
    transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } 
  }
};

const slideFromRight = {
  hidden: { x: 50, opacity: 0 },
  visible: { 
    x: 0, 
    opacity: 1,
    transition: { duration: 1, ease: [0.16, 1, 0.3, 1] }
  }
};

const slideUp = {
  hidden: { y: 40, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: { duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }
  }
};

export default function Features() {
  return (
    <section className="py-40 relative overflow-hidden z-10 bg-black">
      {/* Background Ambience */}
      <div className="absolute top-1/4 right-0 w-[800px] h-[800px] bg-teal-900/5 rounded-full blur-[150px] pointer-events-none z-0"></div>
      
      <div className="max-w-[1600px] mx-auto px-6 lg:px-16 relative z-10">
        
        {/* --- Header --- */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-32 border-b border-white/5 pb-12">
          <h2 className="text-6xl md:text-8xl font-display font-semibold text-white leading-[0.9] tracking-tighter">
            Precision<br />
            <span className="font-cursive text-teal-400/80 font-normal tracking-normal text-7xl md:text-9xl ml-8">
              at scale.
            </span>
          </h2>
          <div className="mt-12 md:mt-0 max-w-sm pb-4">
            <p className="text-gray-500 font-sans text-sm leading-relaxed border-l border-white/10 pl-6">
              Our engine processes thousands of documents in seconds, separating signal from noise with unmatched clarity.
            </p>
          </div>
        </div>
        
        {/* --- Features Grid --- */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* Feature 1: Instant Parsing */}
          <motion.div 
            variants={slideFromLeft}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="md:col-span-7 bg-[#050505] border border-white/5 p-12 lg:p-16 rounded-[2rem] hover:border-white/10 transition-colors duration-700 group relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-teal-900/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
            <div className="relative z-10 flex flex-col h-full justify-between min-h-[400px]">
              <div>
                <span className="block font-cursive text-6xl text-teal-500/20 mb-8 group-hover:text-teal-500/40 transition-colors duration-500">01</span>
                <h3 className="text-4xl md:text-5xl font-display font-medium text-white mb-6 tracking-tight">Instant Parsing</h3>
                <p className="text-gray-400 font-sans font-light text-lg leading-relaxed max-w-md">
                  Convert complex PDFs and diverse document formats into structured JSON instantly. <span className="text-white">99.8% accuracy</span> on unstructured data.
                </p>
              </div>
              <div className="w-full h-px bg-white/5 mt-12 group-hover:bg-teal-500/30 transition-colors duration-500 origin-left"></div>
            </div>
          </motion.div>
          
          {/* Feature 2: Predictive Matching */}
          <motion.div 
            variants={slideFromRight}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="md:col-span-5 bg-[#050505] border border-white/5 p-12 lg:p-16 rounded-[2rem] hover:border-white/10 transition-colors duration-700 group relative"
          >
            <div className="absolute inset-0 bg-gradient-to-bl from-gray-800/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
            <div className="relative z-10">
              <span className="block font-cursive text-6xl text-gray-700/30 mb-8 group-hover:text-gray-600/50 transition-colors duration-500">02</span>
              <h3 className="text-4xl md:text-5xl font-display font-medium text-white mb-6 tracking-tight">Predictive Matching</h3>
              <p className="text-gray-400 font-sans font-light text-lg leading-relaxed mb-12">
                Our LLM engine understands role adjacency, identifying candidates who are a perfect match even if their keywords differ.
              </p>
            </div>
          </motion.div>
          
          {/* Feature 3: Bias Reduction */}
          <motion.div 
            variants={slideUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="md:col-span-12 bg-[#050505] border border-white/5 p-12 lg:p-16 rounded-[2rem] hover:border-white/10 transition-colors duration-700 group mt-2 flex flex-col md:flex-row items-center gap-16 overflow-hidden"
          >
            {/* Text Content */}
            <div className="flex-1 order-2 md:order-1 relative z-10">
              <span className="block font-cursive text-6xl text-teal-500/20 mb-8 group-hover:text-teal-500/40 transition-colors duration-500">03</span>
              <h3 className="text-4xl md:text-5xl font-display font-medium text-white mb-6 tracking-tight">Bias Reduction</h3>
              <p className="text-gray-400 font-sans font-light text-lg max-w-lg mb-10 leading-relaxed">
                Automatically redact PII and demographic data before it reaches your hiring managers. Focus purely on skills.
              </p>
              <a className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-white/50 hover:text-white transition-colors group-hover:translate-x-2 duration-300" href="#">
                <span>View Documentation</span>
                <span>→</span>
              </a>
            </div>
            
            {/* --- UPDATED: Interactive Grid Demo --- */}
            <div className="flex-1 w-full md:w-auto order-1 md:order-2 flex justify-center relative">
              {/* Background glow */}
              <div className="absolute inset-0 bg-gradient-to-l from-teal-500/10 to-transparent blur-3xl rounded-full"></div>
              
              {/* Demo container with grid pattern */}
              <div className="relative w-full max-w-md h-48 border border-white/10 rounded-xl overflow-hidden bg-black/40 backdrop-blur-sm group-hover:shadow-[0_0_50px_rgba(45,212,191,0.1)] transition-shadow duration-700">
                {/* Grid pattern background */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:20px_20px]"></div>
                
                {/* PII data that gets redacted on hover */}
                <div className="absolute top-1/4 left-1/4 px-3 py-1 bg-black border border-red-500/30 text-red-400 text-[10px] rounded opacity-60 blur-[1px] group-hover:opacity-0 transition-opacity duration-500 transform -rotate-6 font-mono">
                  Name: John Doe
                </div>
                <div className="absolute bottom-1/3 right-1/4 px-3 py-1 bg-black border border-red-500/30 text-red-400 text-[10px] rounded opacity-60 blur-[1px] group-hover:opacity-0 transition-opacity duration-500 transform rotate-3 font-mono">
                  Age: 34
                </div>
                
                {/* Success message that appears on hover */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="scale-0 group-hover:scale-100 transition-transform duration-500 cubic-bezier(0.34, 1.56, 0.64, 1)">
                    <div className="px-6 py-2 bg-teal-500/10 border border-teal-500 text-teal-400 text-xs font-mono tracking-widest rounded shadow-[0_0_20px_rgba(45,212,191,0.4)]">
                      DATA CLEANSED
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* --- End of Update --- */}

          </motion.div>
        </div>
      </div>
    </section>
  );
}