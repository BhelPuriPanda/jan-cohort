import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// 1. Import the navigation hook
import { useNavigate } from 'react-router-dom';
import PrimaryButton from '../Buttons/PrimaryButton';
import { containerVariants, letterVariants } from './HeroAnimations';

const TypingText = ({ text, delayStart = 0, className }) => {
  const letters = Array.from(text);

  return (
    <motion.div
      className={className}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {letters.map((letter, index) => (
        <motion.span key={index} variants={letterVariants}>
          {letter}
        </motion.span>
      ))}
    </motion.div>
  );
};

const HeroOverlay = ({ isClarified, onTrigger }) => {
  // 2. Initialize the hook
  const navigate = useNavigate();

  return (
    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-4">
      <AnimatePresence mode="wait">
        
        {/* State 1: Chaos / Initial Trigger */}
        {!isClarified && (
          <motion.button
            key="trigger"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
            transition={{ duration: 0.8 }}
            onClick={onTrigger}
            className="group relative px-10 py-5 bg-transparent border border-white/20 text-white text-lg tracking-widest font-light rounded-sm overflow-hidden"
          >
            <span className="relative z-10 group-hover:font-normal transition-all duration-500">
              CLICK FOR CLARITY
            </span>
            <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl" />
          </motion.button>
        )}

        {/* State 2: Clarity Sequence */}
        {isClarified && (
          <div className="flex flex-col items-center">
            
            {/* Phase 2: The Title */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <TypingText 
                text="Clarity." 
                className="font-cursive text-8xl md:text-[11rem] italic tracking-normal text-white mb-8"
              />
            </motion.div>

            {/* Phase 3: The Manifesto */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 1 }}
              className="max-w-xl mx-auto"
            >
              <p className="text-lg md:text-xl text-gray-300 font-light leading-relaxed">
                <span className="block mb-2 text-white font-medium">Dismantling the chaos of hiring.</span>
                <span className="typing-cursor">We turn unstructured resumes into crystal-clear data points.</span>
              </p>
            </motion.div>

            {/* Phase 4: CTA */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5, duration: 0.8 }}
              className="mt-12"
            >
               {/* 3. Add the navigation logic here */}
               <PrimaryButton onClick={() => navigate('/signup')}>
                 Begin Trial
               </PrimaryButton>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HeroOverlay;