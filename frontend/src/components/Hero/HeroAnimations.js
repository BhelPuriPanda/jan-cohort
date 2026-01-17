export const videoVariants = {
  chaos: {
    filter: "blur(24px) brightness(0.6) saturate(0)",
    scale: 1.1,
  },
  clarity: {
    filter: "blur(0px) brightness(0.9) saturate(1)",
    scale: 1,
    transition: { duration: 1.5, ease: [0.16, 1, 0.3, 1] } // iOS-like ease
  }
};

export const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05, delayChildren: 0.3 }
  }
};

export const letterVariants = {
  hidden: { opacity: 0, y: 10, filter: "blur(4px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { type: "spring", stiffness: 200, damping: 20 }
  }
};

export const navVariants = {
  hidden: { y: -100, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: { duration: 0.8, ease: "circOut", delay: 2.5 } // Late arrival
  }
};