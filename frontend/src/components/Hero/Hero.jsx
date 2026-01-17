import React from 'react';
import { motion } from 'framer-motion';
import HeroOverlay from './HeroOverlay';
import Navbar from '../Navbar/Navbar';
import { useRevealSequence } from '../../hooks/useRevealSequence';
import { videoVariants } from './HeroAnimations';

// 1. IMPORT THE VIDEO FILE
import heroVideo from '../../assets/video/hero-bg.mp4'; 

const Hero = () => {
  const { isClarified, triggerClarity } = useRevealSequence();

  return (
    <section className="relative w-full h-screen overflow-hidden bg-black">
      
      <Navbar isVisible={isClarified} />

      <motion.div 
        className="absolute inset-0 w-full h-full z-0"
        variants={videoVariants}
        initial="chaos"
        animate={isClarified ? "clarity" : "chaos"}
      >
        {/* 2. USE THE IMPORTED VARIABLE */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="object-cover w-full h-full opacity-60"
        >
          <source src={heroVideo} type="video/mp4" />
        </video>
        
        {/* Dark overlay to ensure text pops */}
        <div className="absolute inset-0 bg-black/40" />
      </motion.div>

      <HeroOverlay 
        isClarified={isClarified} 
        onTrigger={triggerClarity} 
      />

    </section>
  );
};

export default Hero;