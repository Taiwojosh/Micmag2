import React from 'react';
import { motion } from 'motion/react';
import { Mail, Linkedin, ShieldCheck, Award, Briefcase, Users, CheckCircle2 } from 'lucide-react';
import { usePageMeta } from '../utils/usePageMeta';

interface TeamMember {
  name: string;
  role: string;
  specialty: string;
  bio: string;
  email: string;
  bgGradient: string;
  textColor: string;
}

const teamMembers: TeamMember[] = [
  {
    name: "Mrs. Ajike Remalia",
    role: "Technical Desk Lead",
    specialty: "Architectural Specification & Formulations",
    bio: "Over 15 years directing corporate coating projects across Nigeria. Leading the technical assessment, formulation matching, and high-performance paint solutions for premium estate developers.",
    email: "ajike_remalia@yahoo.com",
    bgGradient: "from-red-500/10 to-red-600/10",
    textColor: "text-red-700"
  },
  {
    name: "Mr. Ayodeji Olowo",
    role: "Operations Director",
    specialty: "Corporate Strategy & Project Controls",
    bio: "Supervises corporate contract execution, trade alliances, and high-volume project coordination from our Oworonshoki headquarters.",
    email: "olowo_ayodeji@micmaghomes.com",
    bgGradient: "from-blue-500/10 to-blue-600/10",
    textColor: "text-blue-700"
  },
  {
    name: "Miss Bola",
    role: "Store Manager and Colors Consultant",
    specialty: "Inventory Auditing & Custom Color Consultations",
    bio: "Manages physical showroom inventory and color selection, helping walk-in clients and professional contractors select and tint premium formulations.",
    email: "bola_store@micmaghomes.com",
    bgGradient: "from-amber-500/10 to-amber-600/10",
    textColor: "text-amber-700"
  },
  {
    name: "Miss Kosi",
    role: "Sales Consultant",
    specialty: "Retail Accounts & Client Advisory",
    bio: "Provides advisory service for home decorators and designers, managing retail orders and assisting customers in finding precise coating specifications.",
    email: "kosi_color@micmaghomes.com",
    bgGradient: "from-purple-500/10 to-purple-600/10",
    textColor: "text-purple-700"
  },
  {
    name: "Mr. Ifeoluwa",
    role: "Technical Support Specialist",
    specialty: "Substrate Integrity & Application Advisory",
    bio: "Conducts technical diagnostics, plaster checks, and screeding advice to support correct coating compliance on site.",
    email: "ifeoluwa_logistics@micmaghomes.com",
    bgGradient: "from-emerald-500/10 to-emerald-600/10",
    textColor: "text-emerald-700"
  },
  {
    name: "Mr. Jeseph",
    role: "Logistics Coordinator",
    specialty: "Dispatch Operations & Supply Chain Transport",
    bio: "Supervises physical dispatch logistics, delivery route planning, and prompt order distribution from the HQ hub.",
    email: "jeseph_tech@micmaghomes.com",
    bgGradient: "from-neutral-500/10 to-neutral-600/10",
    textColor: "text-neutral-700"
  }
];

const springTransition = { type: "spring", stiffness: 100, damping: 15 };

export default function TeamPage() {
  usePageMeta({
    title: 'Our Team',
    description: 'Meet the Micmag technical and leadership team. Specialists in architectural coatings, surface preparation, and premium European fittings across Lagos.',
    ogTitle: 'Micmag Team | Technical & Leadership Specialists',
  });
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="pt-24 min-h-screen bg-[#F5F4F0]"
    >
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-[#000082] via-[#1e3a5f] to-[#d32f2f] text-white py-20 px-5 md:px-[5%] relative overflow-hidden border-b-2 border-[#1c1917]">
        <div className="absolute inset-0 bg-gradient-to-r from-[#000082] via-transparent to-[#d32f2f]/30 opacity-70" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.15),transparent_65%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
        <div className="max-w-7xl mx-auto relative z-10 space-y-4 text-left">
          <span className="text-[#7598f3] text-xs font-bold tracking-[0.25em] uppercase flex items-center gap-2">
            <Users className="w-4 h-4 text-[#7598f3]" />
            Micmag Professionals
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight">
            Our Leadership &amp;<br />
            Technical Consultants
          </h1>
          <p className="max-w-2xl text-neutral-300 text-sm sm:text-base leading-relaxed font-light">
            Meet the experienced engineers, formulation specialists, and logistics coordinators directing our technical desk, ensuring every liter of premium Sandtex and Caplux coating meets project specifications nationwide.
          </p>
        </div>
      </div>

      {/* Corporate Promise / Core Competency Banner - Highly Responsive mobile carousel */}
      <div className="max-w-7xl mx-auto px-5 md:px-[5%] py-8 md:py-12 overflow-hidden">
        <div className="flex md:grid md:grid-cols-3 gap-6 overflow-x-auto md:overflow-x-visible snap-x snap-mandatory pb-4 md:pb-0 scrollbar-none bg-white border border-neutral-200 p-6 md:p-8 rounded-lg shadow-sm">
          <div className="flex gap-4 items-start text-left w-[285px] md:w-auto shrink-0 snap-center">
            <div className="bg-blue-50 p-3 rounded-full shrink-0">
              <ShieldCheck className="w-6 h-6 text-[#000082]" />
            </div>
            <div>
              <h3 className="font-bold text-neutral-900 text-xs sm:text-sm uppercase tracking-wider">Rigorous Certification</h3>
              <p className="text-xs text-neutral-600 mt-1">Every consultant is thoroughly trained on regional masonry challenges, moisture control, and chemical formulations.</p>
            </div>
          </div>
          <div className="flex gap-4 items-start text-left w-[285px] md:w-auto shrink-0 snap-center">
            <div className="bg-blue-50 p-3 rounded-full shrink-0">
              <Award className="w-6 h-6 text-[#000082]" />
            </div>
            <div>
              <h3 className="font-bold text-neutral-900 text-xs sm:text-sm uppercase tracking-wider">Premium Partners Only</h3>
              <p className="text-xs text-neutral-600 mt-1">Our technical coordinators direct operations strictly in alignment with Sandtex Trade and Caplux quality control.</p>
            </div>
          </div>
          <div className="flex gap-4 items-start text-left w-[285px] md:w-auto shrink-0 snap-center">
            <div className="bg-blue-50 p-3 rounded-full shrink-0">
              <Briefcase className="w-6 h-6 text-[#000082]" />
            </div>
            <div>
              <h3 className="font-bold text-neutral-900 text-xs sm:text-sm uppercase tracking-wider">Nationwide Logistical Supervision</h3>
              <p className="text-xs text-neutral-600 mt-1">Directly coordinating site delivery drops, multi-drum retrievals, and architectural consultations daily.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Team Profiles Grid */}
      <div className="max-w-7xl mx-auto px-5 md:px-[5%] pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {teamMembers.map((member, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ ...springTransition, delay: index * 0.1 }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="bg-white border-2 border-[#1c1917] rounded-2xl overflow-hidden shadow-[4px_4px_0px_0px_#000082] hover:shadow-[6px_6px_0px_0px_#000082] transition-all duration-200 flex flex-col h-full text-left"
            >
              {/* Decorative Header with Monogram Badge (No pictures) */}
              <div className={`p-6 bg-gradient-to-br ${member.bgGradient} border-b-2 border-[#1c1917] flex items-center justify-between relative overflow-hidden`}>
                <div className="absolute -right-6 -bottom-6 w-24 h-24 rounded-full bg-black/5 pointer-events-none" />
                <div className="flex items-center gap-4 relative z-10">
                  <div className={`w-14 h-14 rounded-full border-2 border-[#1c1917] bg-white flex items-center justify-center font-serif text-lg font-black ${member.textColor} shadow-[2px_2px_0px_0px_#1c1917] shrink-0`}>
                    {member.name.replace(/^(Mr|Mrs|Engr)\.?\s+/i, '').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <span className="text-[9px] font-mono uppercase font-bold tracking-wider text-[#d32f2f] bg-red-50 py-0.5 px-2 rounded border border-red-100">
                      Certified Partner
                    </span>
                    <h3 className="font-serif text-base sm:text-lg font-black text-[#000082] leading-tight mt-1">
                      {member.name}
                    </h3>
                  </div>
                </div>
              </div>

              <div className="p-6 flex-grow flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-mono uppercase font-bold tracking-wider text-neutral-600 bg-neutral-100 px-2 py-0.5 rounded">
                      {member.role}
                    </span>
                  </div>
                  <p className="text-xs font-mono uppercase tracking-wider text-[#1a6b3c] font-bold">
                    {member.specialty}
                  </p>
                  <p className="text-xs text-neutral-600 leading-relaxed font-light">
                    {member.bio}
                  </p>
                </div>

                <div className="pt-4 border-t border-neutral-100 flex items-center justify-between">
                  <a
                    href={`mailto:${member.email}`}
                    className="text-xs text-neutral-500 hover:text-[#000082] transition-colors flex items-center gap-1.5"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span className="truncate max-w-[150px]">{member.email}</span>
                  </a>
                  <a
                    href="#"
                    onClick={(e) => e.preventDefault()}
                    className="text-xs text-neutral-400 hover:text-[#000082] transition-colors"
                  >
                    <Linkedin className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
