import React from 'react';
import { motion } from 'framer-motion';

const PrimaryButton = ({ children, onClick, className = "" }) => {
  return (
    <motion.button
      onClick={onClick}
      whileHover="hover"
      whileTap="tap"
      initial="initial"
      className={`relative group overflow-hidden rounded-full bg-white px-10 py-5 font-mono text-sm font-bold uppercase tracking-widest text-black shadow-lg transition-all duration-300 hover:shadow-[0_0_30px_rgba(45,212,191,0.4)] ${className}`}
    >
      {/* 1. The Fill Animation (Slides up from bottom) */}
      <motion.div
        variants={{
          initial: { y: "100%" },
          hover: { y: "0%" },
        }}
        transition={{ duration: 0.4, ease: [0.2, 1, 0.3, 1] }} // "Apple-like" easing
        className="absolute inset-0 bg-gradient-to-tr from-teal-400 to-teal-500"
      />

      {/* 2. The Text (Relative z-index to stay on top of the fill) */}
      <span className="relative z-10 flex items-center gap-2 group-hover:text-white transition-colors duration-300">
        {children}
        {/* Optional Arrow that moves on hover */}
        <span className="material-symbols-outlined text-lg transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1">
          arrow_outward
        </span>
      </span>

    </motion.button>
  );
};

// Add Framer Motion variants to the button wrapper itself for scale
PrimaryButton.defaultProps = {
  variants: {
    hover: { scale: 1.05 },
    tap: { scale: 0.95 },
  }
};

export default PrimaryButton;