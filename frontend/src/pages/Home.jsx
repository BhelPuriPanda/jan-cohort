import React from 'react';
import Hero from '../components/Hero/Hero';
import Features from '../components/Sections/Features';
import TrustedBy from '../components/Sections/TrustedBy';
import ContextMatch from '../components/Sections/ContextMatch';
import Team from '../components/Sections/Team';
import Footer from '../components/Footer/Footer';



const Home = () => {
  return (
    <main className="bg-black min-h-screen text-white selection:bg-teal-500/30">
      <section id="home">
        <Hero />
      </section>
      <section id="manifesto">
        <TrustedBy />
        <Features />
      </section>
      <section id="intelligence">
        <ContextMatch />
      </section>
      <Team />
      <Footer />
    </main>
  );
};

export default Home;
