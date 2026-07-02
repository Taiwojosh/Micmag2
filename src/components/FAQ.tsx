import React from 'react';
import { motion } from 'motion/react';

const faqs = [
  {
    question: 'What is the relationship between Micmag and Sandtex?',
    answer: 'Micmag is an authorized premium dealer of Sandtex (Portland Paints) coatings and CAPLUX surface preparation preps and industrial primers. We serve as the specialized trade hub and direct distributor for both legendary brands across Nigeria.'
  },
  {
    question: 'How do I choose the right paint for my surface?',
    answer: 'Our experts provide consultation considering your indoor/outdoor environments, lighting, and desired finish. We guide you through the SANDTEX range for optimal durability, texture, and color longevity.'
  },
  {
    question: 'Do you offer custom color tinting and on-site consultations?',
    answer: 'Yes, our technical team offers precision automated color tinting, on-site substrate moisture checks, screeding checks, and detailed coating specifications for commercial and residential projects directly from our Oworonshoki HQ and depots.'
  },
  {
    question: 'Where can I get Micmag Service?',
    answer: 'Currently, the full physical color catalogs, textured paint boards, and custom tinting stations are active at our Oworonshoki Headquarters. Our other regional outlets operate as fully stocked distribution depots and express collection points for the complete Sandtex paint and Caplux surface prep ranges.'
  }
];

const springTransition = {
  type: "spring",
  stiffness: 70,
  damping: 17,
  mass: 0.9
};

const staggerContainer = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.12
    }
  }
};

const fadeInUpVariant = {
  initial: { opacity: 0, y: 35 },
  animate: { opacity: 1, y: 0, transition: springTransition }
};

export default function FAQ() {
  return (
    <section id="faq" className="py-20 px-5 md:px-[5%] bg-brand-cream/50 overflow-hidden">
      <div className="max-w-3xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={springTransition}
          className="text-center mb-16"
        >
          <span className="text-brand-red text-xs font-semibold tracking-[0.15em] uppercase mb-4 block">
            Common Questions
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-brand-charcoal">
            Frequently Asked Queries
          </h2>
        </motion.div>

        <motion.div 
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: "-80px" }}
          className="space-y-4"
        >
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              variants={fadeInUpVariant}
            >
              <details
                className="group bg-white border-2 border-[#1c1917] rounded-2xl p-6 shadow-[3px_3px_0px_0px_#1e3a5f] hover:shadow-[5px_5px_0px_0px_#1e3a5f] [&[open]]:shadow-[4px_4px_0px_0px_#d32f2f] transition-all duration-300 text-left"
              >
                <summary className="font-bold text-brand-charcoal cursor-pointer flex justify-between items-center text-[1.05rem] marker:content-['']">
                  {faq.question}
                  <span className="text-brand-red font-bold text-xl transition-transform duration-300 group-[[open]]:rotate-45">+</span>
                </summary>
                <p className="mt-4 text-brand-mid leading-relaxed font-light text-[0.95rem]">
                  {faq.answer}
                </p>
              </details>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

