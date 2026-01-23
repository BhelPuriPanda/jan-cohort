import React from 'react';
import { motion } from 'framer-motion';
import { Github, Linkedin } from 'lucide-react';

import suvanImg from '../../assets/team/Suvan.jpeg';
import advaithImg from '../../assets/team/advaith.jpeg';
import prabhatImg from '../../assets/team/prabhat.jpeg';
import swapnilImg from '../../assets/team/swapnil.jpeg';

// --- Animation Variants ---
const slideUp = {
    hidden: { y: 40, opacity: 0 },
    visible: (i) => ({
        y: 0,
        opacity: 1,
        transition: { duration: 0.8, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }
    })
};

const teamMembers = [
    {
        name: "Suvan",
        role: "Frontend Developer",
        bio: "Frontend Developer that Develops Experiences",
        image: suvanImg,
        linkedin: "https://www.linkedin.com/in/suvan-sethy-3b8720343/",
        github: "https://github.com/Suvxn"
    },
    {
        name: "Advaith",
        role: "Product Designer",
        bio: "Suvan asked me to write this, I'm just here for the equity.",
        image: advaithImg,
        linkedin: "https://www.linkedin.com/in/advaithsantosh/",
        github: "https://github.com/Advai05"
    },
    {
        name: "Prabhat",
        role: "AI Engineer",
        bio: "Langchain for breakfast, RAG for lunch, and fine-tuning for dinner.",
        image: prabhatImg,
        linkedin: "https://www.linkedin.com/in/prabhat-solanki-439568348/",
        github: "https://github.com/pBratt"
    },
    {
        name: "Swapnil",
        role: "Backend Developer",
        bio: "I write code that makes computers do things. Ded inside",
        image: swapnilImg,
        linkedin: "https://www.linkedin.com/in/swapnil-verma-nitr/",
        github: "https://github.com/BhelPuriPanda"
    }
];

export default function Team() {
    return (
        <section id="team" className="py-32 relative overflow-hidden bg-black z-10">
            {/* Background Ambience */}
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-teal-900/10 rounded-full blur-[120px] pointer-events-none z-0"></div>

            <div className="max-w-[1400px] mx-auto px-6 lg:px-16 relative z-10">

                {/* --- Header --- */}
                <div className="mb-24 text-center">
                    <h2 className="text-5xl md:text-7xl font-display font-semibold text-white tracking-tighter mb-6">
                        Meet the
                        <span className="font-cursive text-teal-400/80 font-normal ml-4 text-6xl md:text-8xl">Minds</span>
                    </h2>
                    <p className="text-gray-400 font-sans text-lg max-w-2xl mx-auto leading-relaxed">
                        Why are we here? Just to suffer?
                    </p>
                </div>


                {/* --- Team Grid --- */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {teamMembers.map((member, i) => (
                        <motion.div
                            key={i}
                            custom={i}
                            variants={slideUp}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: "-50px" }}
                            className="group relative bg-[#0a0a0a] border border-white/5 rounded-2xl overflow-hidden hover:border-teal-500/30 transition-colors duration-500"
                        >
                            <div className="aspect-[4/5] overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-700">
                                <img
                                    src={member.image}
                                    alt={member.name}
                                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                                />
                            </div>

                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-90"></div>

                            <div className="absolute bottom-0 left-0 w-full p-6">
                                <div className="flex justify-between items-end mb-1">
                                    <h3 className="text-xl font-display font-medium text-white">{member.name}</h3>
                                    <div className="flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 translate-y-2 group-hover:translate-y-0 transform">
                                        <a href={member.github} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                                            <Github size={18} />
                                        </a>
                                        <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-teal-400 transition-colors">
                                            <Linkedin size={18} />
                                        </a>
                                    </div>
                                </div>
                                <div className="text-teal-400 text-xs font-mono uppercase tracking-widest mb-3">{member.role}</div>
                                <p className="text-gray-400 text-sm leading-relaxed opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                                    {member.bio}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>

            </div>
        </section>
    );
}
