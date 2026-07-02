import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { useLocation } from 'react-router-dom';
import Hero from '../components/Hero';
import About from '../components/About';
import CoreValues from '../components/CoreValues';
import WhyMicmag from '../components/WhyMicmag';
import FAQ from '../components/FAQ';
import Testimonials from '../components/Testimonials';
import ServiceLocations from '../components/ServiceLocations';
import LeadForm from '../components/LeadForm';

export default function HomePage() {
  const { pathname } = useLocation();

  useEffect(() => {
    const pathIdMap: Record<string, string> = {
      '/about': 'about',
      '/core-values': 'core-values',
      '/why': 'why',
      '/locations': 'service-locations',
    };

    const targetId = pathIdMap[pathname];
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
    } else if (pathname === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [pathname]);

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
