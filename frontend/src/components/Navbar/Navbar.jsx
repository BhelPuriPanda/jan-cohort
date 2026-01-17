import React from 'react';
import { motion } from 'framer-motion';
import GlassNavbar from './GlassNavbar';
import { navVariants } from '../Hero/HeroAnimations';

const Navbar = ({ isVisible }) => {
  return (
    <motion.nav 
      variants={navVariants}
      initial="hidden"
      animate={isVisible ? "visible" : "hidden"}
      // Added pointer-events-none to container so clicks pass through sides,
      // but GlassNavbar has pointer-events-auto to catch clicks.
      className="fixed top-8 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none"
    >
      <GlassNavbar />
    </motion.nav>
  );
};

export default Navbar;