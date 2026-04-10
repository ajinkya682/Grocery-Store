// src/pages/Home.jsx
import { useEffect } from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal';
import HeroSection       from '../sections/HeroSection';
import CategoriesSection from '../sections/CategoriesSection';
import MasalaBanner      from '../sections/MasalaBanner';
import FeaturedProducts  from '../sections/FeaturedProducts';
import OrderSteps        from '../sections/OrderSteps';
import WhatsAppCTA       from '../sections/WhatsAppCTA';

const Home = () => {
  useScrollReveal();

  // Re-trigger reveal after route re-entry
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  return (
    <main id="home-page">
      <HeroSection />
      <CategoriesSection />
      <MasalaBanner />
      <FeaturedProducts />
      <OrderSteps />
      <WhatsAppCTA />
    </main>
  );
};

export default Home;
