import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  Clock, 
  Calendar, 
  ArrowLeft, 
  Share2, 
  Check, 
  ChevronDown, 
  ShieldCheck, 
  MessageCircle, 
  Calculator, 
  Sparkles,
  ShoppingBag,
  ExternalLink,
  BookOpen
} from 'lucide-react';
import { getBlogPostBySlug, getRelatedBlogPosts } from '../data/blogPosts';
import { usePageMeta } from '../utils/usePageMeta';
import { openWhatsApp } from '../utils/whatsapp';

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [readingProgress, setReadingProgress] = useState(0);

  const post = slug ? getBlogPostBySlug(slug) : undefined;
  const relatedPosts = post ? getRelatedBlogPosts(post.id, 2) : [];

  usePageMeta({
    title: post ? post.title : 'Article Not Found',
    description: post ? post.metaDescription : 'Micmag Homes & Fittings architectural guides.',
    ogTitle: post ? post.title : 'Micmag Homes Journal',
    ogDescription: post ? post.excerpt : '',
  });

  // Track scroll progress
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        setReadingProgress((window.scrollY / totalHeight) * 100);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Structured Data injection for Article Schema
  useEffect(() => {
    if (!post) return;
    const scriptId = 'blog-article-schema';
    let script = document.getElementById(scriptId) as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement('script');
      script.id = scriptId;
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }
    script.text = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: post.title,
      description: post.metaDescription,
      image: post.coverImage,
      author: {
        '@type': 'Person',
        name: post.author.name,
      },
      publisher: {
        '@type': 'Organization',
        name: 'Micmag Homes & Fittings',
        logo: {
          '@type': 'ImageObject',
          url: 'https://micmaghomes.com/Logo.png',
        },
      },
      datePublished: post.publishedAt,
      dateModified: post.updatedAt,
    });

    return () => {
      const existing = document.getElementById(scriptId);
      if (existing) existing.remove();
    };
  }, [post]);

  if (!post) {
    return (
      <div className="min-h-screen bg-[#faf9f5] pt-36 pb-20 px-4 text-center">
        <div className="max-w-md mx-auto bg-white p-8 rounded-3xl border border-neutral-200 shadow-xl">
          <BookOpen className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-900 mb-2">Article Not Found</h2>
          <p className="text-sm text-slate-600 mb-6">
            The guide you are looking for may have moved or been updated.
          </p>
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#1a2c5b] text-white text-xs font-semibold hover:bg-blue-900 transition-colors"
          >
            <ArrowLeft size={14} /> Back to Journal Hub
          </Link>
        </div>
      </div>
    );
  }

  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';

  const handleCopyLink = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleShareWhatsApp = () => {
    const text = `Read this guide from Micmag Homes: "${post.title}"\n${currentUrl}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleConsultantInquiry = (productName?: string) => {
    const text = productName
      ? `Hello Micmag! 👋 I was reading your article "${post.title}" and would like pricing and availability for ${productName}.`
      : `Hello Micmag! 👋 I was reading your article "${post.title}" and would like to consult with an authorized specialist for my building project.`;
    openWhatsApp('2347052940445', text);
  };

  return (
    <div className="min-h-screen bg-[#faf9f5] pt-24 pb-20 font-sans selection:bg-amber-500/20 selection:text-amber-900">
      {/* ─── Reading Progress Bar ─────────────────────────────────── */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-neutral-200 z-[120]">
        <div
          className="h-full bg-gradient-to-r from-amber-500 via-amber-400 to-[#1a2c5b] transition-all duration-150"
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      {/* ─── Article Header ───────────────────────────────────────── */}
      <header className="bg-gradient-to-b from-[#0a1224] via-[#0d1629] to-[#121e38] text-white pt-12 pb-16 px-4 sm:px-6 lg:px-8 border-b border-amber-500/20">
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-xs text-slate-400 mb-8 overflow-x-auto scrollbar-none">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <Link to="/blog" className="hover:text-white transition-colors">Journal</Link>
            <span>/</span>
            <span className="text-amber-300 font-semibold">{post.category}</span>
          </nav>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-amber-400/30 text-amber-300 text-xs font-semibold uppercase tracking-wider mb-5">
            <Sparkles size={12} className="text-amber-400" />
            <span>{post.category}</span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-serif font-bold text-white tracking-tight leading-[1.2] mb-6">
            {post.title}
          </h1>

          <p className="text-base sm:text-xl text-slate-300 leading-relaxed mb-8">
            {post.subtitle}
          </p>

          {/* Author and Metadata Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-white/10 text-xs">
            <div className="flex items-center gap-3">
              <img
                src={post.author.avatar}
                alt={post.author.name}
                className="w-11 h-11 rounded-full object-cover border-2 border-amber-400/40"
              />
              <div>
                <p className="font-bold text-white text-sm">{post.author.name}</p>
                <p className="text-slate-400">{post.author.role}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-slate-300">
              <span className="flex items-center gap-1.5">
                <Calendar size={13} className="text-amber-400" /> {post.publishedAt}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Clock size={13} className="text-amber-400" /> {post.readTime}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* ─── Main Content Container ───────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* ─── Left / Main Column (8 cols) ─────────────────────────── */}
          <article className="lg:col-span-8">
            {/* Cover Image */}
            <div className="rounded-3xl overflow-hidden shadow-2xl border border-neutral-200 bg-white mb-10">
              <img
                src={post.coverImage}
                alt={post.coverImageAlt}
                className="w-full h-72 sm:h-96 lg:h-[480px] object-cover"
              />
              <div className="p-3.5 bg-neutral-50 border-t border-neutral-200 text-slate-500 text-xs text-center italic">
                {post.coverImageAlt}
              </div>
            </div>

            {/* Social Share Bar */}
            <div className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-neutral-200 shadow-sm mb-10">
              <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Share2 size={14} className="text-amber-600" /> Share this architectural guide:
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleShareWhatsApp}
                  className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <MessageCircle size={13} /> WhatsApp
                </button>
                <button
                  onClick={handleCopyLink}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  {copied ? (
                    <>
                      <Check size={13} className="text-emerald-600" />
                      <span className="text-emerald-600">Copied!</span>
                    </>
                  ) : (
                    <>Copy Link</>
                  )}
                </button>
              </div>
            </div>

            {/* Article Body Sections */}
            <div className="space-y-12">
              {post.sections.map((section, idx) => (
                <section key={idx} id={`section-${idx}`} className="space-y-4">
                  {section.heading && (
                    <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 pt-2 tracking-tight">
                      {section.heading}
                    </h2>
                  )}

                  {section.subheading && (
                    <h3 className="text-lg sm:text-xl font-bold text-slate-800">
                      {section.subheading}
                    </h3>
                  )}

                  {section.paragraphs.map((p, pIdx) => (
                    <p key={pIdx} className="text-base sm:text-lg text-slate-700 leading-relaxed">
                      {p}
                    </p>
                  ))}

                  {/* Callout Box */}
                  {section.callout && (
                    <div
                      className={`p-6 rounded-2xl border my-6 ${
                        section.callout.type === 'tip'
                          ? 'bg-amber-50/70 border-amber-200 text-amber-950'
                          : section.callout.type === 'warning'
                          ? 'bg-red-50/70 border-red-200 text-red-950'
                          : 'bg-blue-50/70 border-blue-200 text-blue-950'
                      }`}
                    >
                      <h4 className="font-bold text-sm uppercase tracking-wider mb-2 flex items-center gap-2">
                        <Sparkles size={15} />
                        {section.callout.title}
                      </h4>
                      <p className="text-sm leading-relaxed">{section.callout.text}</p>
                    </div>
                  )}

                  {/* Comparison Table */}
                  {section.table && (
                    <div className="my-6 overflow-x-auto rounded-2xl border border-neutral-200 shadow-sm bg-white">
                      <table className="w-full text-left text-xs sm:text-sm">
                        <thead className="bg-[#1a2c5b] text-white">
                          <tr>
                            {section.table.headers.map((h, hIdx) => (
                              <th key={hIdx} className="p-3.5 sm:p-4 font-bold">
                                {h}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-200">
                          {section.table.rows.map((row, rIdx) => (
                            <tr key={rIdx} className={rIdx % 2 === 0 ? 'bg-white' : 'bg-neutral-50'}>
                              {row.map((cell, cIdx) => (
                                <td key={cIdx} className="p-3.5 sm:p-4 text-slate-700 font-medium">
                                  {cell}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* Pull Quote */}
                  {section.quote && (
                    <figure className="my-8 p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border-l-4 border-amber-600">
                      <blockquote className="text-lg sm:text-xl font-serif italic text-slate-900 leading-snug mb-3">
                        “{section.quote.text}”
                      </blockquote>
                      <figcaption className="text-xs font-bold text-amber-800 uppercase tracking-wider">
                        — {section.quote.caption}
                      </figcaption>
                    </figure>
                  )}
                </section>
              ))}
            </div>

            {/* ─── Interactive Calculator & Showroom Promo Card ─────── */}
            <div className="my-14 p-8 rounded-3xl bg-gradient-to-br from-[#0d1629] to-[#1a2c5b] text-white shadow-xl border border-amber-500/30">
              <div className="flex items-center gap-2 text-amber-300 text-xs font-bold uppercase tracking-wider mb-3">
                <Calculator size={15} />
                <span>Interactive Tool</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-serif font-bold text-white mb-3">
                Ready to Calculate Your Project’s Sandtex Drums?
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed mb-6">
                Use our digital paint calculator to estimate exact drum counts based on your wall dimensions, or test Sandtex paint hues in 5 realistic architectural settings.
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <Link
                  to="/showroom"
                  className="px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition-all shadow-lg active:scale-95 flex items-center gap-2"
                >
                  <Sparkles size={14} /> Launch Digital Showroom
                </Link>
                <button
                  onClick={() => handleConsultantInquiry()}
                  className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2"
                >
                  <MessageCircle size={14} /> Get Quote on WhatsApp
                </button>
              </div>
            </div>

            {/* ─── Frequently Asked Questions (FAQ Accordion) ───────── */}
            {post.faqs && post.faqs.length > 0 && (
              <section className="my-14">
                <h3 className="text-2xl font-serif font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <span>Frequently Asked Questions</span>
                </h3>
                <div className="space-y-3">
                  {post.faqs.map((faq, fIdx) => {
                    const isOpen = openFaqIndex === fIdx;
                    return (
                      <div
                        key={fIdx}
                        className="rounded-2xl border border-neutral-200 bg-white overflow-hidden shadow-sm transition-all"
                      >
                        <button
                          onClick={() => setOpenFaqIndex(isOpen ? null : fIdx)}
                          className="w-full text-left p-5 flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-slate-900 hover:text-amber-700 transition-colors"
                        >
                          <span>{faq.question}</span>
                          <ChevronDown
                            size={18}
                            className={`flex-shrink-0 transition-transform duration-200 ${
                              isOpen ? 'rotate-180 text-amber-600' : 'text-slate-400'
                            }`}
                          />
                        </button>
                        {isOpen && (
                          <div className="px-5 pb-5 text-sm text-slate-600 leading-relaxed border-t border-neutral-100 pt-3">
                            {faq.answer}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* ─── Recommended Products Section ─────────────────────── */}
            {post.relatedProducts && post.relatedProducts.length > 0 && (
              <section className="my-14 pt-8 border-t border-neutral-200">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-serif font-bold text-slate-900">
                      Specified Products in This Guide
                    </h3>
                    <p className="text-xs text-slate-500">
                      Original CAP Plc & Ideal Standard inventory available for direct dispatch in Lagos.
                    </p>
                  </div>
                  <Link
                    to="/collections"
                    className="text-xs font-bold text-amber-700 hover:underline flex items-center gap-1"
                  >
                    View All Catalog <ExternalLink size={12} />
                  </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {post.relatedProducts.map((prod, pIdx) => (
                    <div
                      key={pIdx}
                      className="bg-white rounded-2xl border border-neutral-200 p-4 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div>
                        <div className="h-32 rounded-xl overflow-hidden bg-slate-50 flex items-center justify-center mb-3">
                          <img
                            src={prod.image}
                            alt={prod.name}
                            className="max-h-28 object-contain"
                          />
                        </div>
                        <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider bg-amber-50 px-2 py-0.5 rounded">
                          {prod.category}
                        </span>
                        <h4 className="font-bold text-sm text-slate-900 mt-1 mb-1">{prod.name}</h4>
                        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-4">
                          {prod.summary}
                        </p>
                      </div>
                      <button
                        onClick={() => handleConsultantInquiry(prod.name)}
                        className="w-full py-2 px-3 rounded-xl bg-[#1a2c5b] hover:bg-blue-900 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <ShoppingBag size={12} /> Order on WhatsApp
                      </button>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </article>

          {/* ─── Right Column / Sticky Sidebar (4 cols) ──────────────── */}
          <aside className="lg:col-span-4 space-y-6">
            <div className="sticky top-28 space-y-6">
              {/* Quick Table of Contents Card */}
              <div className="bg-white rounded-3xl p-6 border border-neutral-200 shadow-md">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
                  <BookOpen size={14} className="text-amber-600" />
                  <span>Article Contents</span>
                </h4>
                <nav className="space-y-2.5 text-xs">
                  {post.sections.map((section, sIdx) => {
                    if (!section.heading) return null;
                    return (
                      <a
                        key={sIdx}
                        href={`#section-${sIdx}`}
                        className="block text-slate-700 hover:text-amber-700 transition-colors line-clamp-1 font-medium"
                      >
                        • {section.heading}
                      </a>
                    );
                  })}
                </nav>
              </div>

              {/* Authorized Certification Badge Card */}
              <div className="bg-gradient-to-br from-amber-50 to-amber-100/60 rounded-3xl p-6 border border-amber-200 text-amber-950">
                <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider text-amber-800 mb-2">
                  <ShieldCheck size={16} className="text-amber-700" />
                  <span>Authorized Distributor</span>
                </div>
                <h4 className="font-serif font-bold text-base text-slate-900 mb-2">
                  100% Genuine Guarantee
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  Micmag Homes & Fittings is officially certified by CAP Plc for Sandtex paint and authorized for Ideal Standard sanitary ware in Nigeria.
                </p>
                <div className="text-[11px] text-slate-500 border-t border-amber-200/80 pt-3">
                  Direct factory dispatches to Lekki, Ikeja, Ikoyi, Victoria Island, and nationwide.
                </div>
              </div>

              {/* Direct WhatsApp Consultant Card */}
              <div className="bg-gradient-to-br from-[#0d1629] to-[#1a2c5b] text-white rounded-3xl p-6 shadow-xl border border-amber-500/20">
                <h4 className="font-serif font-bold text-lg text-white mb-2">
                  Speak to a Paint Specialist
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed mb-5">
                  Have specific wall dimensions or elevation drawings? Our licensed technical consultants verify your BOQ at zero cost.
                </p>
                <button
                  onClick={() => handleConsultantInquiry()}
                  className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/30 transition-all active:scale-95"
                >
                  <MessageCircle size={15} />
                  <span>Chat on WhatsApp</span>
                </button>
              </div>

              {/* Related Articles in Sidebar */}
              {relatedPosts.length > 0 && (
                <div className="bg-white rounded-3xl p-6 border border-neutral-200 shadow-md">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
                    Related Publications
                  </h4>
                  <div className="space-y-4">
                    {relatedPosts.map((rPost) => (
                      <Link
                        key={rPost.id}
                        to={`/blog/${rPost.slug}`}
                        className="group block text-xs space-y-1"
                      >
                        <span className="text-[10px] font-bold text-amber-700 uppercase">
                          {rPost.category}
                        </span>
                        <h5 className="font-bold text-slate-900 group-hover:text-amber-700 transition-colors leading-snug line-clamp-2">
                          {rPost.title}
                        </h5>
                        <p className="text-[11px] text-slate-500">{rPost.readTime}</p>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
