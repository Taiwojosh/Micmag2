import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Search, Clock, Calendar, ArrowRight, BookOpen, ShieldCheck, Sparkles, MessageCircle, Calculator } from 'lucide-react';
import { BLOG_POSTS, BlogPost } from '../data/blogPosts';
import { usePageMeta } from '../utils/usePageMeta';
import { openWhatsApp } from '../utils/whatsapp';

const CATEGORIES = [
  'All Articles',
  'Cost & Estimating',
  'Paint Systems',
  'Sanitary Ware',
  'Authenticity Guides',
] as const;

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All Articles');
  const [searchQuery, setSearchQuery] = useState('');

  usePageMeta({
    title: 'Architectural Journal & Guides',
    description: 'Expert guides on Sandtex paint coverage, genuine CAP Plc verification, Ideal Standard sanitary ware, and building cost estimation in Nigeria.',
    ogTitle: 'Micmag Architectural Journal — Paint & Sanitary Ware Guides Nigeria',
  });

  const filteredPosts = useMemo(() => {
    return BLOG_POSTS.filter((post) => {
      const matchesCategory =
        selectedCategory === 'All Articles' || post.category === selectedCategory;
      const matchesSearch =
        searchQuery.trim() === '' ||
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const featuredPost = BLOG_POSTS[0];

  const handleConsultantClick = () => {
    openWhatsApp(
      '2347052940445',
      'Hello Micmag! 👋 I was reading your Architectural Journal and would like expert advice on my building project.'
    );
  };

  return (
    <div className="min-h-screen bg-[#faf9f5] pt-28 pb-20 font-sans selection:bg-amber-500/20 selection:text-amber-900">
      {/* ─── Hero Section ────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#0a1224] via-[#0d1629] to-[#121e38] text-white py-16 sm:py-24 px-4 sm:px-6 lg:px-8 border-b border-amber-500/20">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#c9a84c_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-amber-400/30 text-amber-300 text-xs font-semibold uppercase tracking-wider mb-6">
            <Sparkles size={13} className="text-amber-400" />
            <span>Micmag Architectural Journal</span>
          </div>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-bold tracking-tight text-white mb-6 leading-[1.15]">
            Finishing Intelligence, <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-100">
              Technical Guides & Estimators
            </span>
          </h1>
          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed mb-8">
            Expert insights for Nigerian homeowners, architects, and developers. Learn authentic Sandtex paint coverage, sanitary engineering, and budgeting strategies.
          </p>

          {/* Search bar */}
          <div className="max-w-xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search guides (e.g. Sandtex coverage, fake paint, Lekki duplex)..."
              className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all shadow-xl"
            />
          </div>
        </div>
      </section>

      {/* ─── Main Content Container ───────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap transition-all duration-200 ${
                selectedCategory === cat
                  ? 'bg-[#1a2c5b] text-white shadow-md shadow-blue-900/20'
                  : 'bg-white text-slate-700 hover:bg-neutral-100 border border-neutral-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* ─── Featured Post Spotlight (shown when no search filter active) ── */}
        {!searchQuery && selectedCategory === 'All Articles' && featuredPost && (
          <section className="my-10">
            <Link
              to={`/blog/${featuredPost.slug}`}
              className="group block relative rounded-3xl overflow-hidden bg-white border border-neutral-200 shadow-xl hover:shadow-2xl transition-all duration-300"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
                <div className="lg:col-span-7 relative h-72 sm:h-96 lg:h-auto overflow-hidden">
                  <img
                    src={featuredPost.coverImage}
                    alt={featuredPost.coverImageAlt}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute top-4 left-4 bg-[#1a2c5b]/90 backdrop-blur-md text-amber-300 font-bold text-xs uppercase tracking-wider px-3 py-1.5 rounded-full border border-amber-400/30">
                    Featured Guide
                  </div>
                </div>
                <div className="lg:col-span-5 p-6 sm:p-10 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-3 text-xs text-slate-500 mb-3">
                      <span className="font-semibold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md">
                        {featuredPost.category}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock size={12} /> {featuredPost.readTime}
                      </span>
                    </div>
                    <h2 className="text-xl sm:text-3xl font-serif font-bold text-slate-900 group-hover:text-amber-700 transition-colors leading-snug mb-3">
                      {featuredPost.title}
                    </h2>
                    <p className="text-sm sm:text-base text-slate-600 line-clamp-3 leading-relaxed mb-6">
                      {featuredPost.excerpt}
                    </p>
                  </div>
                  <div className="pt-6 border-t border-neutral-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={featuredPost.author.avatar}
                        alt={featuredPost.author.name}
                        className="w-9 h-9 rounded-full object-cover border border-neutral-200"
                      />
                      <div>
                        <p className="text-xs font-bold text-slate-900">{featuredPost.author.name}</p>
                        <p className="text-[11px] text-slate-500">{featuredPost.publishedAt}</p>
                      </div>
                    </div>
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 group-hover:translate-x-1 transition-transform">
                      Read Guide <ArrowRight size={14} />
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          </section>
        )}

        {/* ─── Articles Grid ────────────────────────────────────────── */}
        <section className="my-10">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl sm:text-2xl font-serif font-bold text-slate-900">
              {selectedCategory === 'All Articles' ? 'Latest Publications' : selectedCategory}
            </h3>
            <span className="text-xs text-slate-500 font-medium">
              Showing {filteredPosts.length} article{filteredPosts.length !== 1 ? 's' : ''}
            </span>
          </div>

          {filteredPosts.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-neutral-200 p-8">
              <BookOpen className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <h4 className="text-lg font-bold text-slate-800 mb-1">No matching articles found</h4>
              <p className="text-sm text-slate-500 max-w-md mx-auto mb-6">
                Try searching for different keywords or switch categories to explore other guides.
              </p>
              <button
                onClick={() => {
                  setSelectedCategory('All Articles');
                  setSearchQuery('');
                }}
                className="px-5 py-2.5 rounded-full bg-[#1a2c5b] text-white text-xs font-semibold hover:bg-blue-900 transition-colors"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post) => (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="group flex flex-col bg-white rounded-3xl overflow-hidden border border-neutral-200 shadow-md hover:shadow-xl transition-all duration-300"
                >
                  <Link to={`/blog/${post.slug}`} className="relative block h-56 overflow-hidden bg-slate-100">
                    <img
                      src={post.coverImage}
                      alt={post.coverImageAlt}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                    />
                    <div className="absolute top-3 left-3 bg-[#1a2c5b]/90 backdrop-blur-md text-amber-300 font-semibold text-[11px] px-2.5 py-1 rounded-full border border-amber-400/20">
                      {post.category}
                    </div>
                  </Link>

                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 text-[11px] text-slate-500 mb-2.5">
                        <span className="flex items-center gap-1">
                          <Calendar size={11} /> {post.publishedAt}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock size={11} /> {post.readTime}
                        </span>
                      </div>
                      <Link to={`/blog/${post.slug}`}>
                        <h4 className="text-lg font-serif font-bold text-slate-900 group-hover:text-amber-700 transition-colors leading-snug mb-2.5">
                          {post.title}
                        </h4>
                      </Link>
                      <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed mb-4">
                        {post.excerpt}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-neutral-100 flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={post.author.avatar}
                          alt={post.author.name}
                          className="w-7 h-7 rounded-full object-cover border border-neutral-200"
                        />
                        <span className="text-xs font-semibold text-slate-800 truncate max-w-[130px]">
                          {post.author.name}
                        </span>
                      </div>
                      <Link
                        to={`/blog/${post.slug}`}
                        className="inline-flex items-center gap-1 text-xs font-bold text-amber-700 group-hover:translate-x-1 transition-transform"
                      >
                        Read <ArrowRight size={13} />
                      </Link>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          )}
        </section>

        {/* ─── Bottom CTA Banner ────────────────────────────────────── */}
        <section className="my-16 relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#0d1629] via-[#1a2c5b] to-[#0a1224] text-white p-8 sm:p-12 shadow-2xl border border-amber-500/30">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold uppercase tracking-wider mb-4 border border-amber-400/30">
                <ShieldCheck size={14} />
                <span>Authorized CAP Plc & Ideal Standard Partner</span>
              </div>
              <h3 className="text-2xl sm:text-4xl font-serif font-bold text-white mb-4">
                Need an Itemized Paint Estimate or Verified Quote for Your Site?
              </h3>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
                Send your building elevation or floor plan to our technical desk. We calculate exact 20L drum requirements and specify genuine Sandtex formulations directly from the factory.
              </p>
            </div>
            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3">
              <button
                onClick={handleConsultantClick}
                className="w-full flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-900/30 transition-all active:scale-[0.98]"
              >
                <MessageCircle size={17} />
                <span>Inquire on WhatsApp</span>
              </button>
              <Link
                to="/showroom"
                className="w-full flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-sm backdrop-blur-md transition-all active:scale-[0.98]"
              >
                <Calculator size={17} className="text-amber-400" />
                <span>Open Paint Calculator</span>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
