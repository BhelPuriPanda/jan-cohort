import React, { useEffect, useRef } from 'react';
import { motion, useInView, useMotionValue, useTransform, animate } from 'framer-motion';
import contextVisual from '../../assets/images/context-match.jpg';

// --- Sub-component: The Animated Counter ---
const Counter = ({ value }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));

  useEffect(() => {
    if (isInView) {
      // Counts up to 'value' over 2.5 seconds with a smooth ease
      const controls = animate(count, value, { duration: 2.5, ease: [0.16, 1, 0.3, 1] });
      return controls.stop;
    }
  }, [isInView, value, count]);

  return <motion.span ref={ref}>{rounded}</motion.span>;
};

export default function ContextMatch() {
  const features = [
    { number: '01', title: 'Entity Extraction' },
    { number: '02', title: 'Taxonomy Mapping' },
    { number: '03', title: 'Confidence Scoring' },
  ];

  return (
    <section className="py-32 bg-black border-t border-white/5 relative overflow-hidden z-10">
      
      {/* Background: Subtle Static Grain (Optional) */}
      <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] pointer-events-none"></div>

      <div className="max-w-[1600px] mx-auto px-6 lg:px-16 grid grid-cols-1 lg:grid-cols-2 gap-24 items-center relative z-10">
        
        {/* --- LEFT: Image Container (Replaces 3D Mouse Container) --- */}
        <div className="relative flex justify-center items-center perspective-[1200px]">
          
          <div className="relative w-[360px] h-[460px] rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl group cursor-default">
            
            {/* Ambient Glow Behind (Appears on Hover) */}
            <div className="absolute inset-0 bg-teal-500/10 blur-[40px] opacity-0 group-hover:opacity-50 transition-opacity duration-700"></div>

            {/* The Image */}
            {/* Replace this src with your chosen local image or Pinterest find */}
            <img 
              src={contextVisual} 
              alt="Contextual Accuracy Visualization" 
              className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700 ease-out"
            />

            {/* Dark Gradient Overlay for Text Readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>

            {/* Overlay Content */}
            <div className="absolute bottom-10 left-0 right-0 text-center z-10">
              
              {/* The Big Counter */}
              <div className="flex justify-center items-start text-7xl font-display font-medium text-white tracking-tighter leading-none">
                <Counter value={98} />
                <span className="text-2xl text-teal-400 mt-2 font-light">%</span>
              </div>
              
              {/* Label */}
              <div className="mt-2 text-sm font-mono text-teal-400/80 uppercase tracking-widest">
                Accuracy Score
              </div>

              {/* Decorative Line */}
              <div className="w-12 h-0.5 bg-white/20 mx-auto mt-6 rounded-full"></div>

            </div>

          </div>
        </div>
        
        {/* --- RIGHT: Text Content (Unchanged) --- */}
        <div className="space-y-12">
          
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="border-l border-teal-500/50 pl-8"
          >
            <h2 className="text-5xl md:text-7xl font-display font-semibold text-white leading-[0.9] mb-8">
              See what <br />
              <span className="font-cursive text-gray-500 font-normal opacity-80">others miss.</span>
            </h2>
            <p className="text-xl text-gray-400 font-light leading-relaxed max-w-lg">
              Standard keyword searches fail to capture context. Clarity understands that a "Project Manager" in construction has different transferrable skills than one in software development.
            </p>
          </motion.div>

          {/* Interactive List */}
          <div className="grid grid-cols-1 gap-8 pl-8">
            {features.map((feature, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2, duration: 0.6 }}
                viewport={{ once: true }}
                className="flex items-center gap-8 group cursor-default"
              >
                {/* Number */}
                <div className="font-mono text-sm text-teal-500/40 group-hover:text-teal-400 transition-colors duration-500">
                  {feature.number}
                </div>
                
                {/* Line Animation */}
                <div className="h-px flex-1 bg-white/10 relative overflow-hidden">
                  <div className="absolute inset-0 bg-teal-500/50 -translate-x-full group-hover:translate-x-0 transition-transform duration-700 ease-[0.16,1,0.3,1]"></div>
                </div>
                
                {/* Title */}
                <div className="text-sm font-sans uppercase tracking-[0.2em] text-gray-400 group-hover:text-white transition-colors duration-500">
                  {feature.title}
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}