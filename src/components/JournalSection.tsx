import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Clock, ArrowRight, BookOpen, Sparkles, MessageCircle, Calculator, ShieldCheck } from 'lucide-react';
import { BLOG_POSTS } from '../data/blogPosts';
import { openWhatsApp } from '../utils/whatsapp';

export default function JournalSection() {
  const featuredPosts = BLOG_POSTS.slice(0, 3);

  const handleWhatsAppConsult = () => {
    openWhatsApp(
      '2347052940445',
      'Hello Micmag! 👋 I was reading your Architectural Journal guides and would like assistance calculating paint requirements for my building project.'
    );
  };

  return (
    <section id="architectural-journal" className="py-24 px-5 md:px-[5%] bg-[#0a1122] text-white relative overflow-hidden border-b border-white/10">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-amber-500/5 rounded-full filter blur-[120px] pointer-events-none" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/5 rounded-full filter blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10 text-left">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div className="space-y-3 max-w-2xl">
            <span className="text-amber-400 text-xs font-bold tracking-[0.25em] uppercase flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              The Architectural Journal
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
              Finishing Intelligence <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-100">
                & Builder Estimating Guides
              </span>
            </h2>
            <p className="text-sm sm:text-base text-slate-300 font-light leading-relaxed">
              Cut through guesswork and counterfeit materials. Explore verified Sandtex drum coverage rates, substrate preparation protocols, and European sanitary ware engineering.
            </p>
          </div>

          <div className="flex-shrink-0">
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs uppercase tracking-wider backdrop-blur-md transition-all group"
            >
              <span>Explore All Guides</span>
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* 3-Column Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredPosts.map((post, idx) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              className="group flex flex-col bg-[#131b2e] rounded-3xl overflow-hidden border border-white/10 hover:border-amber-400/40 shadow-xl hover:shadow-2xl transition-all duration-300"
            >
              {/* Cover Image */}
              <Link to={`/blog/${post.slug}`} className="relative block h-52 overflow-hidden bg-slate-900">
                <img
                  src={post.coverImage}
                  alt={post.coverImageAlt}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out opacity-90 group-hover:opacity-100"
                />
                <div className="absolute top-3 left-3 bg-[#0d1629]/90 backdrop-blur-md text-amber-300 font-bold text-[10px] uppercase tracking-wider px-3 py-1 rounded-full border border-amber-400/30">
                  {post.category}
                </div>
              </Link>

              {/* Card Body */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center gap-2 text-[11px] text-slate-400 mb-2.5 font-mono">
                    <span className="flex items-center gap-1">
                      <Clock size={11} className="text-amber-400" /> {post.readTime}
                    </span>
                    <span>•</span>
                    <span>{post.publishedAt}</span>
                  </div>

                  <Link to={`/blog/${post.slug}`}>
                    <h3 className="font-serif text-lg sm:text-xl font-bold text-white group-hover:text-amber-300 transition-colors leading-snug line-clamp-2 mb-2.5">
                      {post.title}
                    </h3>
                  </Link>

                  <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed font-light">
                    {post.excerpt}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img
                      src={post.author.avatar}
                      alt={post.author.name}
                      className="w-7 h-7 rounded-full object-cover border border-white/20"
                    />
                    <span className="text-[11px] font-semibold text-slate-300 truncate max-w-[120px]">
                      {post.author.name}
                    </span>
                  </div>

                  <Link
                    to={`/blog/${post.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-300 group-hover:translate-x-1 transition-transform"
                  >
                    <span>Read Guide</span>
                    <ArrowRight size={13} />
                  </Link>
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        {/* Quick Consultation Conversion Strip */}
        <div className="mt-16 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-white/5 via-white/10 to-white/5 border border-white/15 backdrop-blur-md flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-400/30 flex items-center justify-center text-amber-400 flex-shrink-0">
              <Calculator size={22} />
            </div>
            <div>
              <h4 className="font-serif font-bold text-base sm:text-lg text-white">
                Need an Itemized Paint Bill of Quantities (BOQ)?
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed font-light">
                Send your elevation plan to our Lagos technical desk for exact 20L drum estimation and genuine CAP Plc factory wholesale pricing.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <button
              onClick={handleWhatsAppConsult}
              className="flex-1 md:flex-initial flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-emerald-950/30 transition-all active:scale-95"
            >
              <MessageCircle size={15} />
              <span>Inquire on WhatsApp</span>
            </button>
            <Link
              to="/showroom"
              className="flex-1 md:flex-initial flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs uppercase tracking-wider transition-all active:scale-95"
            >
              <Sparkles size={14} className="text-amber-400" />
              <span>Open 3D Studio</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
