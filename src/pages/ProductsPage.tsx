import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  SlidersHorizontal, 
  Trash2, 
  FileText, 
  ShoppingBag, 
  Check, 
  Sparkles, 
  CheckCircle2, 
  X, 
  Volume2, 
  Info, 
  PhoneCall, 
  ArrowRight,
  Database
} from 'lucide-react';
import { PAINT_PRODUCTS, FITTINGS_PRODUCTS, PaintProduct, FittingProduct } from '../data/productsData';
import { CAPLUX_PRODUCTS } from '../data/capluxProducts';
import { openWhatsApp } from '../utils/whatsapp';
import ProductDetailModal from '../components/ProductDetailModal';

// Unified format for catalog products
interface StandardProduct {
  id: string;
  name: string;
  desc: string;
  brand: 'sandtex' | 'caplux' | 'micmag';
  tag: string;
  coverage?: string;
  image: string;
  fallback: string;
  rawItem: any;
}

interface CartItem {
  product: StandardProduct;
  quantity: number;
  selectedSize?: string;
}

export default function ProductsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBrand, setSelectedBrand] = useState<'all' | 'sandtex' | 'caplux' | 'micmag'>('all');
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'name-asc' | 'name-desc' | 'brand'>('name-asc');
  
  // Cart / Inquiry Basket State
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  // Detail Modal State
  const [activeModalItem, setActiveModalItem] = useState<any | null>(null);
  
  // Mobile Filter Drawer State
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Compile unified catalog
  const unifiedCatalog = useMemo(() => {
    const list: StandardProduct[] = [];
    
    PAINT_PRODUCTS.forEach((p, idx) => {
      list.push({
        id: `sandtex-${idx}`,
        name: p.name,
        desc: p.desc,
        brand: 'sandtex',
        tag: p.tag,
        coverage: p.coverage,
        image: p.image,
        fallback: p.fallback,
        rawItem: p
      });
    });

    CAPLUX_PRODUCTS.forEach((p, idx) => {
      list.push({
        id: `caplux-${idx}`,
        name: p.name,
        desc: p.desc,
        brand: 'caplux',
        tag: p.tag,
        coverage: p.coverage,
        image: p.image,
        fallback: p.fallback,
        rawItem: p
      });
    });

    FITTINGS_PRODUCTS.forEach((p, idx) => {
      list.push({
        id: `micmag-${idx}`,
        name: p.name,
        desc: p.desc,
        brand: 'micmag',
        tag: p.tag,
        image: p.image,
        fallback: p.fallback,
        rawItem: p
      });
    });

    return list;
  }, []);

  // Extract all unique tags
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    unifiedCatalog.forEach(p => {
      if (p.tag) tags.add(p.tag);
    });
    return Array.from(tags);
  }, [unifiedCatalog]);

  // Filter & sort catalog items
  const filteredCatalog = useMemo(() => {
    let result = unifiedCatalog.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            p.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            p.tag.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesBrand = selectedBrand === 'all' || p.brand === selectedBrand;
      const matchesTag = selectedTag === 'all' || p.tag === selectedTag;
      
      return matchesSearch && matchesBrand && matchesTag;
    });

    // Apply sorting
    if (sortBy === 'name-asc') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'name-desc') {
      result.sort((a, b) => b.name.localeCompare(a.name));
    } else if (sortBy === 'brand') {
      result.sort((a, b) => a.brand.localeCompare(b.brand));
    }

    return result;
  }, [unifiedCatalog, searchQuery, selectedBrand, selectedTag, sortBy]);

  // Basket Handlers
  const handleAddToBasket = (product: StandardProduct) => {
    setCart(prev => {
      const existingIndex = prev.findIndex(item => item.product.id === product.id);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += 1;
        return updated;
      }
      return [...prev, { product, quantity: 1 }];
    });
    // Open the cart automatically to give prompt user feedback
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (productId: string, delta: number) => {
    setCart(prev => {
      return prev.map(item => {
        if (item.product.id === productId) {
          const nextQty = item.quantity + delta;
          return nextQty > 0 ? { ...item, quantity: nextQty } : item;
        }
        return item;
      }).filter(item => item.quantity > 0);
    });
  };

  const handleRemoveFromBasket = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const handleClearBasket = () => {
    setCart([]);
  };

  // Coverage Estimates inside checkout basket
  const totalEstimatedCoverage = useMemo(() => {
    let sqm = 0;
    cart.forEach(item => {
      if (item.product.brand === 'sandtex' || item.product.brand === 'caplux') {
        // Simple extraction of coverage numbers (e.g. "8-10 m²/L" or "10-12 m²/L")
        const coverageStr = item.product.coverage || '';
        const match = coverageStr.match(/(\d+)\s*-\s*(\d+)|(\d+)/);
        if (match) {
          const minCov = parseInt(match[1] || match[3] || '8');
          // Assume 20L size is typical for drums
          const sizeMultiplier = item.product.name.includes('4L') ? 4 : 20;
          sqm += minCov * sizeMultiplier * item.quantity;
        } else {
          sqm += 150 * item.quantity; // Default fallback coverage for a 20L drum
        }
      }
    });
    return sqm;
  }, [cart]);

  // Submit Inquiry to WhatsApp (Professional Format)
  const handleSubmitInquiry = () => {
    if (cart.length === 0) return;

    let text = `*MICMAG HOMES & FITTINGS - E-COMMERCE QUOTE INQUIRY*\n`;
    text += `===================================\n`;
    text += `I have built an e-commerce estimate and would like to receive the official trade pricing, availability, and delivery options for the following item(s):\n\n`;

    cart.forEach((item, idx) => {
      const brandLabel = item.product.brand.toUpperCase();
      text += `${idx + 1}. [${brandLabel}] *${item.product.name}*\n`;
      text += `   - Quantity: ${item.quantity} unit(s)\n`;
      if (item.product.coverage) {
        text += `   - Factory Coverage Spec: ${item.product.coverage}\n`;
      }
      text += `\n`;
    });

    if (totalEstimatedCoverage > 0) {
      text += `===================================\n`;
      text += `*Estimated Base Project Coverage*: ~${totalEstimatedCoverage} sq. meters total.\n`;
    }

    text += `Please check stock at Oworonshoki Headquarters and advise on the next logistics steps.\n`;
    text += `Thank you!`;

    openWhatsApp('2347052940445', text);
  };

  return (
    <div className="pt-24 min-h-screen bg-[#F5F4F0] relative">
      
      {/* Banner / Header */}
      <div className="bg-[#000650] text-white py-16 px-5 md:px-[5%] relative overflow-hidden border-b border-neutral-800">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(117,152,243,0.15),transparent_60%)]" />
        <div className="max-w-7xl mx-auto relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="space-y-3 text-left">
            <span className="text-[#7598f3] text-xs font-bold tracking-[0.25em] uppercase flex items-center gap-1.5">
              <ShoppingBag className="w-4 h-4 text-[#7598f3]" />
              Trade Portal
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-none">
             Catalog
            </h1>
            <p className="max-w-xl text-neutral-300 text-xs sm:text-sm leading-relaxed font-light">
              Add products directly to your technical cart, estimate overall building coverage, and export your itemized list straight to our central distribution desk.
            </p>
          </div>
          
          {/* Quick Basket Summary Button */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="self-start md:self-center bg-white text-[#000650] px-6 py-4 rounded-full font-bold uppercase text-[11px] tracking-wider shadow-lg hover:bg-neutral-100 transition-all flex items-center gap-2.5 cursor-pointer shrink-0"
          >
            <ShoppingBag className="w-4 h-4 text-brand-red" />
            <span>My Cart ({cart.reduce((sum, item) => sum + item.quantity, 0)})</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-5 md:px-[5%] py-8 md:py-12">
        
        {/* Mobile Filter & Search Trigger Bar - Highly Responsive & Premium */}
        <div className="lg:hidden flex flex-col sm:flex-row gap-3 mb-6 w-full">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Search premium formulations..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-neutral-200 rounded-lg py-3.5 pl-10 pr-4 text-xs font-sans text-neutral-800 placeholder-neutral-400 focus:outline-none focus:border-neutral-400 shadow-sm"
            />
            <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-[15px]" />
          </div>
          <div className="flex gap-2.5">
            <button 
              onClick={() => setShowMobileFilters(true)}
              className="flex-1 sm:flex-initial bg-white border border-neutral-200 py-3.5 px-5 rounded-lg text-xs font-bold uppercase tracking-wider text-neutral-800 flex items-center justify-center gap-2 shadow-sm transition-all hover:bg-neutral-50 active:scale-95 cursor-pointer"
            >
              <SlidersHorizontal className="w-4 h-4 text-[#000082]" />
              <span>Filter & Sort { (selectedBrand !== 'all' || selectedTag !== 'all') && '•' }</span>
            </button>
            <button
              onClick={() => setIsCartOpen(true)}
              className="bg-[#000082] text-white py-3.5 px-5 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition-all hover:bg-[#0000a0] active:scale-95 cursor-pointer shrink-0"
            >
              <ShoppingBag className="w-4 h-4 text-brand-yellow" />
              <span>Cart ({cart.reduce((sum, item) => sum + item.quantity, 0)})</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Sidebar Filters - Hidden on Mobile, Shown on Desktop */}
          <div className="hidden lg:block lg:col-span-1 space-y-6 text-left">
            
            {/* Search */}
            <div className="bg-white border border-neutral-200 p-5 rounded-lg space-y-3 shadow-sm">
              <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-400 block">
                Direct Search
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="e.g. VME, Putty, Satin..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-md py-2.5 pl-10 pr-4 text-xs font-sans text-neutral-800 placeholder-neutral-400 focus:outline-none focus:border-neutral-400"
                />
                <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3" />
              </div>
            </div>

            {/* Brand Catalog Filter */}
            <div className="bg-white border border-neutral-200 p-5 rounded-lg space-y-4 shadow-sm">
              <div className="flex items-center justify-between border-b border-neutral-100 pb-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-400">
                  Brand Catalogs
                </span>
                <SlidersHorizontal className="w-3.5 h-3.5 text-neutral-400" />
              </div>
              
              <div className="space-y-1.5">
                {[
                  { id: 'all', label: 'All Catalogs' },
                  { id: 'sandtex', label: 'Sandtex Paint System' },
                  { id: 'caplux', label: 'Caplux Preparation' },
                  { id: 'micmag', label: 'Micmag Specialty & Prep' }
                ].map(b => (
                  <button
                    key={b.id}
                    onClick={() => {
                      setSelectedBrand(b.id as any);
                      setSelectedTag('all'); // Reset tag filter on brand switch
                    }}
                    className={`w-full text-left px-3.5 py-2.5 rounded text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-between cursor-pointer ${
                      selectedBrand === b.id
                        ? 'bg-neutral-900 text-white shadow'
                        : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-950'
                    }`}
                  >
                    <span>{b.label}</span>
                    {selectedBrand === b.id && <Check className="w-3.5 h-3.5" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Section / Category Filters */}
            <div className="bg-white border border-neutral-200 p-5 rounded-lg space-y-4 shadow-sm">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-400 block border-b border-neutral-100 pb-2">
                Filter by Coating Tag
              </span>
              <div className="flex flex-wrap gap-1.5">
                <button
                  onClick={() => setSelectedTag('all')}
                  className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider border transition-colors cursor-pointer ${
                    selectedTag === 'all'
                      ? 'bg-[#000082] text-white border-[#000082]'
                      : 'bg-neutral-50 border-neutral-200 text-neutral-600 hover:border-neutral-300'
                  }`}
                >
                  All Categories
                </button>
                {allTags.map(tag => (
                  <button
                    key={tag}
                    onClick={() => setSelectedTag(tag)}
                    className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider border transition-colors cursor-pointer ${
                      selectedTag === tag
                        ? 'bg-[#000082] text-white border-[#000082]'
                        : 'bg-neutral-50 border-neutral-200 text-neutral-600 hover:border-neutral-300'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Sort Dropdown */}
            <div className="bg-white border border-neutral-200 p-5 rounded-lg space-y-3 shadow-sm">
              <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-400 block">
                Sort Hierarchy
              </label>
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value as any)}
                className="w-full bg-neutral-50 border border-neutral-200 rounded-md py-2.5 px-3.5 text-xs font-sans text-neutral-800 focus:outline-none focus:border-neutral-400"
              >
                <option value="name-asc">Alphabetical (A - Z)</option>
                <option value="name-desc">Alphabetical (Z - A)</option>
                <option value="brand">Sort by Brand Catalog</option>
              </select>
            </div>

          </div>

          {/* Product Cards Grid Area */}
          <div className="lg:col-span-3 space-y-8 text-left">
            
            {/* Filter Pills Summary */}
            <div className="flex flex-wrap items-center justify-between gap-4 bg-white border border-neutral-200/80 px-5 py-4 rounded-lg shadow-sm">
              <div className="text-xs text-neutral-600 font-light">
                Showing <span className="font-bold text-neutral-900">{filteredCatalog.length}</span> premium products
              </div>
              
              {(selectedBrand !== 'all' || selectedTag !== 'all' || searchQuery) && (
                <button
                  onClick={() => {
                    setSelectedBrand('all');
                    setSelectedTag('all');
                    setSearchQuery('');
                  }}
                  className="text-xs font-bold text-brand-red hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Clear All Filters</span>
                </button>
              )}
            </div>

            {/* E-commerce grid */}
            {filteredCatalog.length === 0 ? (
              <div className="bg-white border border-neutral-200 p-16 rounded-lg text-center space-y-4 shadow-sm">
                <Database className="w-12 h-12 text-neutral-300 mx-auto" />
                <h3 className="font-serif text-lg font-bold text-neutral-800">No Matching Products</h3>
                <p className="text-xs text-neutral-500 max-w-sm mx-auto font-light">
                  No formulations or fittings matched your specific filter. Please expand your query or clear filters to view entire catalog.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredCatalog.map(p => (
                  <motion.div
                    key={p.id}
                    layout
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35 }}
                    className="bg-white border border-neutral-200 rounded-lg overflow-hidden flex flex-col justify-between h-full shadow-sm hover:shadow-md hover:border-neutral-300 transition-all group"
                  >
                    
                    {/* Visual Asset Section */}
                    <div className="relative h-48 bg-neutral-50 border-b border-neutral-100 overflow-hidden flex items-center justify-center p-4">
                      <img
                        src={p.image}
                        alt={p.name}
                        onError={(e) => {
                          e.currentTarget.src = p.fallback;
                        }}
                        className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
                        referrerPolicy="no-referrer"
                      />
                      
                      {/* Brand Label Badge */}
                      <div className="absolute top-3 left-3">
                        <span className={`text-[9px] font-mono uppercase tracking-wider font-bold px-2.5 py-1 rounded-full text-white shadow-sm ${
                          p.brand === 'sandtex' 
                            ? 'bg-[#d32f2f]' 
                            : p.brand === 'caplux' 
                              ? 'bg-amber-600' 
                              : 'bg-[#000082]'
                        }`}>
                          {p.brand === 'sandtex' ? 'Sandtex Trade' : p.brand === 'caplux' ? 'Caplux' : 'Micmag'}
                        </span>
                      </div>
                      
                      {/* Standard Category Tag Badge */}
                      <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm border border-neutral-200/60 px-2.5 py-1 rounded">
                        <span className="text-[8.5px] font-mono text-neutral-600 font-bold uppercase tracking-wider">
                          {p.tag}
                        </span>
                      </div>
                    </div>

                    {/* Meta/Content Section */}
                    <div className="p-5 flex-grow flex flex-col justify-between space-y-4">
                      
                      <div className="space-y-2">
                        <h3 className="font-serif text-base font-bold text-neutral-900 leading-tight group-hover:text-[#000082] transition-colors">
                          {p.name}
                        </h3>
                        
                        {/* Interactive professional star indicator */}
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map(star => (
                            <span key={star} className="text-yellow-500 text-xs">★</span>
                          ))}
                          <span className="text-[9.5px] font-mono text-neutral-400 font-bold ml-1">5.0 Trade Certified</span>
                        </div>

                        <p className="text-xs text-neutral-500 leading-relaxed font-light line-clamp-3">
                          {p.desc}
                        </p>
                      </div>

                      {/* Technical specifications info row */}
                      <div className="pt-3 border-t border-neutral-100 space-y-2">
                        
                        {p.coverage && (
                          <div className="flex justify-between items-center text-[10.5px]">
                            <span className="text-neutral-400 font-light">Theoretical Yield:</span>
                            <span className="font-mono font-bold text-neutral-800">{p.coverage}</span>
                          </div>
                        )}
                        
                        <div className="flex justify-between items-center text-[10.5px]">
                          <span className="text-neutral-400 font-light">Trade Price Status:</span>
                          <span className="font-bold text-green-600 uppercase tracking-wide">Approved Trade Rates</span>
                        </div>

                        <div className="flex justify-between items-center text-[10.5px]">
                          <span className="text-neutral-400 font-light">Stock Status:</span>
                          <span className="font-bold text-neutral-700 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                            HQ Ready
                          </span>
                        </div>

                      </div>

                    </div>

                    {/* Interactive Action Row */}
                    <div className="p-5 pt-0 grid grid-cols-2 gap-2">
                      
                      {p.rawItem.tdsSpec ? (
                        <button
                          onClick={() => setActiveModalItem(p.rawItem)}
                          className="bg-neutral-50 border border-neutral-200 hover:bg-neutral-100 text-neutral-700 py-2.5 rounded text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>Specs (TDS)</span>
                        </button>
                      ) : (
                        <div className="bg-neutral-50 text-neutral-400 border border-neutral-200/50 py-2.5 rounded text-[9px] font-bold uppercase tracking-wider text-center flex items-center justify-center">
                          <span>Solid Quality</span>
                        </div>
                      )}

                      <button
                        onClick={() => handleAddToBasket(p)}
                        className="bg-[#000082] hover:bg-[#000650] text-white py-2.5 rounded text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-1 shadow-sm cursor-pointer"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>Inquire</span>
                      </button>

                    </div>

                  </motion.div>
                ))}
              </div>
            )}

          </div>

        </div>
      </div>

      {/* Floating E-Commerce Drawer Panel */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="fixed inset-0 bg-black z-50 cursor-pointer"
            />
            
            {/* Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col justify-between"
            >
              
              {/* Drawer Title Block */}
              <div className="bg-[#000650] text-white p-5 flex justify-between items-center border-b border-neutral-800">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-[#7598f3]" />
                  <h3 className="font-serif text-lg font-bold">My Cart</h3>
                  <span className="bg-brand-red text-white text-[10px] font-mono px-2 py-0.5 rounded-full">
                    {cart.reduce((sum, item) => sum + item.quantity, 0)}
                  </span>
                </div>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="text-neutral-400 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Drawer Content list */}
              <div className="flex-grow overflow-y-auto p-5 space-y-4">
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center space-y-3 py-16">
                     <ShoppingBag className="w-12 h-12 text-neutral-200" />
                    <p className="text-xs text-neutral-500 font-light">Your cart is currently empty.</p>
                    <button
                      onClick={() => setIsCartOpen(false)}
                      className="text-xs font-bold text-[#000082] uppercase hover:underline cursor-pointer"
                    >
                      Browse Catalogs
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    
                    {cart.map(item => (
                      <div 
                        key={item.product.id} 
                        className="bg-neutral-50 border border-neutral-200 p-4 rounded-lg flex gap-4 items-start text-left relative"
                      >
                        <div className="w-12 h-12 bg-white rounded border border-neutral-200 overflow-hidden shrink-0 flex items-center justify-center p-1.5">
                          <img
                            src={item.product.image}
                            alt={item.product.name}
                            onError={(e) => {
                              e.currentTarget.src = item.product.fallback;
                            }}
                            className="max-h-full max-w-full object-contain"
                          />
                        </div>
                        
                        <div className="flex-grow space-y-1.5 pr-6">
                          <span className={`text-[8px] font-mono uppercase font-bold tracking-wider px-1.5 py-0.5 rounded text-white ${
                            item.product.brand === 'sandtex' 
                              ? 'bg-[#d32f2f]' 
                              : item.product.brand === 'caplux' 
                                ? 'bg-amber-600' 
                                : 'bg-[#000082]'
                          }`}>
                            {item.product.brand.toUpperCase()}
                          </span>
                          <h4 className="font-serif text-sm font-bold text-neutral-900 leading-tight">
                            {item.product.name}
                          </h4>
                          
                          {/* Quantity Selector */}
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => handleUpdateQuantity(item.product.id, -1)}
                              className="w-6 h-6 border border-neutral-300 rounded-full flex items-center justify-center text-neutral-600 hover:bg-neutral-200 text-xs font-bold shrink-0 cursor-pointer"
                            >
                              -
                            </button>
                            <span className="text-xs font-mono font-bold text-neutral-800 w-4 text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => handleUpdateQuantity(item.product.id, 1)}
                              className="w-6 h-6 border border-neutral-300 rounded-full flex items-center justify-center text-neutral-600 hover:bg-neutral-200 text-xs font-bold shrink-0 cursor-pointer"
                            >
                              +
                            </button>
                          </div>
                        </div>

                        {/* Trash Button */}
                        <button
                          onClick={() => handleRemoveFromBasket(item.product.id)}
                          className="absolute top-4 right-4 text-neutral-400 hover:text-[#d32f2f] transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}

                    {/* Interactive Yield Estimator */}
                    {totalEstimatedCoverage > 0 && (
                      <div className="bg-blue-50 border border-blue-200/80 p-4 rounded-lg space-y-2">
                        <div className="flex items-center gap-1.5 text-xs text-[#000082] font-bold">
                          <Info className="w-4 h-4 text-[#000082]" />
                          <span>Technical Coverage Estimator</span>
                        </div>
                        <p className="text-[11px] text-neutral-600 leading-normal font-light">
                          Based on standard coating guidelines, your selected items are estimated to cover roughly <span className="font-bold text-neutral-900">~{totalEstimatedCoverage} sq. meters</span> of masonry surface under single-layer application parameters.
                        </p>
                      </div>
                    )}

                  </div>
                )}
              </div>

              {/* Drawer Footer controls */}
              {cart.length > 0 && (
                <div className="bg-neutral-50 border-t border-neutral-200 p-5 space-y-3.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-neutral-500 font-light">Total Inquiry Items:</span>
                    <span className="font-mono font-bold text-neutral-900">
                      {cart.reduce((sum, item) => sum + item.quantity, 0)} units
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={handleClearBasket}
                      className="border border-neutral-300 hover:bg-neutral-100 text-neutral-600 py-3 rounded text-[10px] font-bold uppercase tracking-wider cursor-pointer"
                    >
                      Reset Cart
                    </button>
                    <button
                      onClick={handleSubmitInquiry}
                      className="col-span-2 bg-[#000082] hover:bg-[#000650] text-white py-3 rounded text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 shadow cursor-pointer"
                    >
                      <PhoneCall className="w-3.5 h-3.5" />
                      <span>Submit Quote Order</span>
                    </button>
                  </div>
                </div>
              )}

            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Mobile Filters Drawer - Highly Responsive and Polished */}
      <AnimatePresence>
        {showMobileFilters && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowMobileFilters(false)}
              className="fixed inset-0 bg-black/60 z-[120] lg:hidden"
            />
            {/* Drawer Panel */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="fixed inset-x-0 bottom-0 max-h-[85vh] bg-white rounded-t-2xl z-[130] shadow-2xl flex flex-col lg:hidden text-left overflow-hidden border-t border-neutral-200"
            >
              {/* Header */}
              <div className="px-5 py-4 border-b border-neutral-100 flex items-center justify-between bg-neutral-50 shrink-0">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-[#000082]" />
                  <span className="text-xs font-black uppercase tracking-wider text-neutral-900">
                    Filter &amp; Sort Products
                  </span>
                </div>
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="p-1 rounded-full hover:bg-neutral-200 text-neutral-500 hover:text-neutral-900 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Scrollable content */}
              <div className="p-5 overflow-y-auto space-y-6 flex-grow">
                {/* Brand Selection */}
                <div className="space-y-3">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-400 block border-b border-neutral-100 pb-1.5">
                    Brand Catalogs
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: 'all', label: 'All Catalogs' },
                      { id: 'sandtex', label: 'Sandtex Paint' },
                      { id: 'caplux', label: 'Caplux Prep' },
                      { id: 'micmag', label: 'Micmag Sanitary' }
                    ].map(b => (
                      <button
                        key={b.id}
                        onClick={() => {
                          setSelectedBrand(b.id as any);
                          setSelectedTag('all'); // Reset tag
                        }}
                        className={`text-left px-3.5 py-3 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all flex items-center justify-between border cursor-pointer ${
                          selectedBrand === b.id
                            ? 'bg-[#000082] text-white border-[#000082] shadow-sm'
                            : 'bg-neutral-50 border-neutral-200 text-neutral-600'
                        }`}
                      >
                        <span className="truncate">{b.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Coating Categories */}
                <div className="space-y-3">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-400 block border-b border-neutral-100 pb-1.5">
                    Coating Categories
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    <button
                      onClick={() => setSelectedTag('all')}
                      className={`px-3 py-2 rounded-full text-[10px] font-bold uppercase tracking-wider border transition-colors cursor-pointer ${
                        selectedTag === 'all'
                          ? 'bg-[#000082] text-white border-[#000082]'
                          : 'bg-neutral-50 border-neutral-200 text-neutral-600'
                      }`}
                    >
                      All Categories
                    </button>
                    {allTags.map(tag => (
                      <button
                        key={tag}
                        onClick={() => setSelectedTag(tag)}
                        className={`px-3 py-2 rounded-full text-[10px] font-bold uppercase tracking-wider border transition-colors cursor-pointer ${
                          selectedTag === tag
                            ? 'bg-[#000082] text-white border-[#000082]'
                            : 'bg-neutral-50 border-neutral-200 text-neutral-600'
                        }`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sort Preference */}
                <div className="space-y-3">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-400 block border-b border-neutral-100 pb-1.5">
                    Sort Hierarchy
                  </span>
                  <div className="grid grid-cols-1 gap-2">
                    {[
                      { id: 'name-asc', label: 'Alphabetical (A - Z)' },
                      { id: 'name-desc', label: 'Alphabetical (Z - A)' },
                      { id: 'brand', label: 'Sort by Brand Catalog' }
                    ].map(opt => (
                      <button
                        key={opt.id}
                        onClick={() => setSortBy(opt.id as any)}
                        className={`text-left px-4 py-3 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-between border cursor-pointer ${
                          sortBy === opt.id
                            ? 'bg-[#000082] text-white border-[#000082] shadow-sm'
                            : 'bg-neutral-50 border-neutral-200 text-neutral-600'
                        }`}
                      >
                        <span>{opt.label}</span>
                        {sortBy === opt.id && <Check className="w-4 h-4 text-brand-yellow" />}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Footer controls inside drawer */}
              <div className="bg-neutral-50 border-t border-neutral-200 p-4 shrink-0 grid grid-cols-2 gap-3.5">
                <button
                  onClick={() => {
                    setSelectedBrand('all');
                    setSelectedTag('all');
                    setSearchQuery('');
                    setShowMobileFilters(false);
                  }}
                  className="bg-white border border-neutral-300 text-neutral-600 py-3.5 rounded-lg text-xs font-bold uppercase tracking-wider cursor-pointer hover:bg-neutral-100 transition-colors"
                >
                  Clear All
                </button>
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="bg-[#000082] text-white py-3.5 rounded-lg text-xs font-bold uppercase tracking-wider shadow cursor-pointer hover:bg-[#0000a0] transition-colors"
                >
                  Apply Filters
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* TDS Detail Specifications Modal */}
      {activeModalItem && (
        <ProductDetailModal
          isOpen={true}
          onClose={() => setActiveModalItem(null)}
          item={activeModalItem}
          type="product"
        />
      )}

      {/* Floating Inquiry Basket Icon (Beside WhatsApp on desktop, on top on mobile) */}
      <button
        onClick={() => setIsCartOpen(true)}
        className="fixed z-[90] bg-[#000082] text-white w-14 h-14 rounded-full flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 border-2 border-[#1c1917] cursor-pointer bottom-[104px] right-8 md:bottom-8 md:right-[104px]"
        title="Open Cart"
      >
        <ShoppingBag className="w-6 h-6 text-white" />
        {cart.reduce((sum, item) => sum + item.quantity, 0) > 0 && (
          <span className="absolute -top-1 -right-1 bg-[#d32f2f] text-white text-[10px] font-mono font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-[#1c1917] shadow-sm">
            {cart.reduce((sum, item) => sum + item.quantity, 0)}
          </span>
        )}
      </button>

    </div>
  );
}
