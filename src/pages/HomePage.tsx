import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { useLocation } from 'react-router-dom';
import { usePageMeta } from '../utils/usePageMeta';
import Hero from '../components/Hero';
import About from '../components/About';
import CoreValues from '../components/CoreValues';
import WhyMicmag from '../components/WhyMicmag';
import FAQ from '../components/FAQ';
import Testimonials from '../components/Testimonials';
import ServiceLocations from '../components/ServiceLocations';
import LeadForm from '../components/LeadForm';

export default function HomePage() {
  const { hash } = useLocation();

  usePageMeta({
    title: 'Premium Sandtex Paints & Architectural Finishes in Lagos',
    description:
      'Micmag Homes & Fittings is Lagos\u2019 authorized Sandtex and Caplux dealer. ' +
      'Shop climate-proof exterior paints, interior emulsions, and industrial primers. ' +
      'Stores in Oworonshoki, Sangotedo, Alakija, Ikorodu, Ogombo & Bogije.',
    ogTitle: 'Micmag Homes & Fittings | Sandtex Paints Nigeria',
  });
  useEffect(() => {
    const hashIdMap: Record<string, string> = {
      '#about': 'about',
      '#core-values': 'core-values',
      '#why': 'why',
      '#locations': 'service-locations',
    };

    const targetId = hashIdMap[hash];
    if (targetId) {
      // Delay slightly to ensure component rendering is complete and heights are stable
      const timer = setTimeout(() => {
        const element = document.getElementById(targetId);
        if (element) {
          const headerOffset = 110; // match header offset for scrolling
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.scrollY - headerOffset;
          
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      }, 150);
      return () => clearTimeout(timer);
    } else if (!hash) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [hash]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.65, ease: "easeOut" }}
    >
      <Hero />
      <About />
      <CoreValues />
      <WhyMicmag />
      <FAQ />
      <Testimonials />
      <ServiceLocations />
      <LeadForm />
    </motion.div>
  );
}
