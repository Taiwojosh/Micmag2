import React from 'react';
import { motion } from 'motion/react';
import { Mail, ShieldCheck, Award, Briefcase, Users, MapPin } from 'lucide-react';
import { usePageMeta } from '../utils/usePageMeta';

interface TeamMember {
  name: string;
  role: string;
  specialty: string;
  bio: string;
  email: string;
  branch: 'Oworonshoki HQ' | 'Sangotedo' | 'Alakija';
  bgGradient: string;
  textColor: string;
}

const teamMembers: TeamMember[] = [
  // Oworonshoki HQ
  {
    name: "Mrs. AJIKE FAKANDE",
    role: "Team Lead",
    specialty: "Architectural Specification & Formulations",
    bio: "Leads technical assessment, formulation matching, and high-performance paint specifications for corporate developers and client onboarding at the Oworonshoki HQ.",
    email: "ajike_remalia@yahoo.com",
    branch: "Oworonshoki HQ",
    bgGradient: "from-red-500/10 to-red-600/10",
    textColor: "text-red-700"
  },
  {
    name: "BOLANLE ARIBO",
    role: "Admin Manager",
    specialty: "Office Administration & Operations",
    bio: "Directs customer service workflows, administrative logistics, document controls, and accounts management at the main headquarters.",
    email: "bolamicmag@gmail.com",
    branch: "Oworonshoki HQ",
    bgGradient: "from-blue-500/10 to-blue-600/10",
    textColor: "text-blue-700"
  },
  {
    name: "MKPUMA KOSI",
    role: "Retail Manager",
    specialty: "Showroom Operations & Retail Sales",
    bio: "Oversees physical showroom setup, custom color consultations, walk-in client support, and retail sales inquiries.",
    email: "kosimicmag@gmail.com",
    branch: "Oworonshoki HQ",
    bgGradient: "from-amber-500/10 to-amber-600/10",
    textColor: "text-amber-700"
  },
  {
    name: "KUYE OLUDOLAPO BOLUWATIFE",
    role: "Accountant",
    specialty: "Financial Controls & Audit",
    bio: "Manages project bookkeeping, purchase ledgers, payment reconciliations, and financial auditing for all branch transactions.",
    email: "okuye.micmag@gmail.com",
    branch: "Oworonshoki HQ",
    bgGradient: "from-purple-500/10 to-purple-600/10",
    textColor: "text-purple-700"
  },
  // Sangotedo Branch
  {
    name: "AGASHI TEVASE ROSEMARY",
    role: "Admin Manager",
    specialty: "Branch Operations & Client Relations",
    bio: "Manages administrative schedules, customer advisory workflows, and business relations for the Sangotedo Island outlet.",
    email: "admmicmagsangotedo@gmail.com",
    branch: "Sangotedo",
    bgGradient: "from-emerald-500/10 to-emerald-600/10",
    textColor: "text-emerald-700"
  },
  {
    name: "NWANKWO BENITA CHINEDU",
    role: "Store Manager",
    specialty: "Inventory Auditing & Supply Chain logistics",
    bio: "Directs physical stock controls, dispatch planning, local order processing, and product quality checks in the Lekki-Sangotedo region.",
    email: "storemicmagsangotedo@gmail.com",
    branch: "Sangotedo",
    bgGradient: "from-teal-500/10 to-teal-600/10",
    textColor: "text-teal-700"
  },
  // Alakija Branch
  {
    name: "JOHN NICHOLAS",
    role: "Sales Executive",
    specialty: "Trade Accounts & Sales Advisory",
    bio: "Coordinates trade client relations, contractor pricing programs, and custom coating advice at the Alakija Store.",
    email: "nicholas.john7070@gmail.com",
    branch: "Alakija",
    bgGradient: "from-indigo-500/10 to-indigo-600/10",
    textColor: "text-indigo-700"
  }
];

const springTransition = { type: "spring", stiffness: 100, damping: 15 };

export default function TeamPage() {
  usePageMeta({
    title: 'Our Team',
    description: 'Meet the Micmag technical and leadership team. Specialists in architectural coatings, surface preparation, and premium European fittings across Lagos.',
    ogTitle: 'Micmag Team | Technical & Leadership Specialists',
  });

  const branches = [
    {
      id: 'oworo',
      name: 'Oworonshoki Headquarters',
      subtitle: 'Main Showroom & Corporate Office Desk',
      members: teamMembers.filter(m => m.branch === 'Oworonshoki HQ')
    },
    {
      id: 'sangotedo',
      name: 'Sangotedo Island Store',
      subtitle: 'Lekki Peninsula Paint & texture Depot',
      members: teamMembers.filter(m => m.branch === 'Sangotedo')
    },
    {
      id: 'alakija',
      name: 'Alakija Store',
      subtitle: 'Festac & Badagry Expressway Direct Contractor Outlet',
      members: teamMembers.filter(m => m.branch === 'Alakija')
    }
  ];

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
            Meet the experienced managers, accountants, and coordinators directing our branches, ensuring every premium coating and luxury fitting order is handled with maximum care and professionalism.
          </p>
        </div>
      </div>

      {/* Corporate Competency Banner */}
      <div className="max-w-7xl mx-auto px-5 md:px-[5%] py-8 md:py-12 overflow-hidden">
        <div className="flex md:grid md:grid-cols-3 gap-6 overflow-x-auto md:overflow-x-visible snap-x snap-mandatory pb-4 md:pb-0 scrollbar-none bg-white border border-neutral-200 p-6 md:p-8 rounded-lg shadow-sm">
          <div className="flex gap-4 items-start text-left w-[285px] md:w-auto shrink-0 snap-center">
            <div className="bg-blue-50 p-3 rounded-full shrink-0">
              <ShieldCheck className="w-6 h-6 text-[#000082]" />
            </div>
            <div>
              <h3 className="font-bold text-neutral-900 text-xs sm:text-sm uppercase tracking-wider">Direct Verification</h3>
              <p className="text-xs text-neutral-600 mt-1">Every branch is linked directly to our main systems, offering unified stock checks, tinting consistency, and pricing controls.</p>
            </div>
          </div>
          <div className="flex gap-4 items-start text-left w-[285px] md:w-auto shrink-0 snap-center">
            <div className="bg-blue-50 p-3 rounded-full shrink-0">
              <Award className="w-6 h-6 text-[#000082]" />
            </div>
            <div>
              <h3 className="font-bold text-neutral-900 text-xs sm:text-sm uppercase tracking-wider">Expert Advisory</h3>
              <p className="text-xs text-neutral-600 mt-1">Our team handles calculations for paint coverages, substrate screeding compatibility, and custom color card alignment.</p>
            </div>
          </div>
          <div className="flex gap-4 items-start text-left w-[285px] md:w-auto shrink-0 snap-center">
            <div className="bg-blue-50 p-3 rounded-full shrink-0">
              <Briefcase className="w-6 h-6 text-[#000082]" />
            </div>
            <div>
              <h3 className="font-bold text-neutral-900 text-xs sm:text-sm uppercase tracking-wider">Prompt Order Fulfillment</h3>
              <p className="text-xs text-neutral-600 mt-1">Efficient transport and stock management across Oworonshoki, Sangotedo, and Alakija for rapid deliveries.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Grouped Branch Team Sections */}
      <div className="max-w-7xl mx-auto px-5 md:px-[5%] pb-24 space-y-16">
        {branches.map((branch) => (
          <div key={branch.id} className="space-y-6 text-left">
            {/* Branch Header */}
            <div className="border-b-2 border-[#1c1917] pb-3 flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
              <h2 className="font-serif text-xl sm:text-2xl font-black text-[#000082] flex items-center gap-2">
                <MapPin className="w-5 h-5 text-[#d32f2f]" />
                {branch.name}
              </h2>
              <span className="font-mono text-[10px] text-neutral-500 uppercase tracking-widest">
                {branch.subtitle}
              </span>
            </div>

            {/* Branch Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {branch.members.map((member, idx) => (
                <motion.div
                  key={member.name}
                  initial={{ opacity: 0, y: 35 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ ...springTransition, delay: idx * 0.1 }}
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}
                  className="bg-white border-2 border-[#1c1917] rounded-2xl overflow-hidden shadow-[4px_4px_0px_0px_#000082] hover:shadow-[6px_6px_0px_0px_#000082] transition-all duration-200 flex flex-col h-full"
                >
                  {/* Decorative Header with Monogram Badge */}
                  <div className={`p-6 bg-gradient-to-br ${member.bgGradient} border-b-2 border-[#1c1917] flex items-center justify-between relative overflow-hidden`}>
                    <div className="absolute -right-6 -bottom-6 w-24 h-24 rounded-full bg-black/5 pointer-events-none" />
                    <div className="flex items-center gap-4 relative z-10">
                      <div className={`w-14 h-14 rounded-full border-2 border-[#1c1917] bg-white flex items-center justify-center font-serif text-lg font-black ${member.textColor} shadow-[2px_2px_0px_0px_#1c1917] shrink-0`}>
                        {member.name.replace(/^(Mr|Mrs|Engr)\.?\s+/i, '').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <span className="text-[9px] font-mono uppercase font-bold tracking-wider text-[#d32f2f] bg-red-50 py-0.5 px-2 rounded border border-red-100">
                          Official Team
                        </span>
                        <h3 className="font-serif text-base sm:text-lg font-black text-[#000082] leading-tight mt-1">
                          {member.name}
                        </h3>
                      </div>
                    </div>
                  </div>

                  {/* Body Content */}
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

                    {/* Email Contact info */}
                    <div className="pt-4 border-t border-neutral-100">
                      <a
                        href={`mailto:${member.email}`}
                        className="text-xs text-neutral-500 hover:text-[#000082] transition-colors flex items-center gap-1.5"
                      >
                        <Mail className="w-3.5 h-3.5" />
                        <span className="truncate">{member.email}</span>
                      </a>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
