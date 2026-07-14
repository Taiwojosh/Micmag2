import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  SlidersHorizontal, 
  Trash2, 
  ShoppingBag, 
  Check, 
  X, 
  Info, 
  PhoneCall, 
  Database,
  MapPin
} from 'lucide-react';
import { PAINT_PRODUCTS, FITTINGS_PRODUCTS, PaintProduct, FittingProduct } from '../data/productsData';
import { CAPLUX_PRODUCTS } from '../data/capluxProducts';
import { openWhatsApp } from '../utils/whatsapp';
import { usePageMeta } from '../utils/usePageMeta';
import ProductDetailModal, { OrderLineItem } from '../components/ProductDetailModal';

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
  rawItem: PaintProduct | FittingProduct | (typeof import('../data/capluxProducts'))['CAPLUX_PRODUCTS'][number];
}

interface CartItem {
  lineId: string; // unique per addition
  product: StandardProduct;
  color: string | null;  // color name
  size: string | null;   // '4L' | '20L' | null for fittings
  quantity: number;
}

export default function ProductsPage() {
  const [searchQuery, setSearchQuery] = useState('');

  usePageMeta({
    title: 'Products & Collections',
    description: 'Browse Micmag’s full catalog of Sandtex premium paints, Caplux surface preparation systems, and luxury European bathroom fittings. Available in Lagos.',
    ogTitle: 'Micmag Products — Sandtex Paints, Caplux Primers & European Fittings',
  });
  const [selectedBrand, setSelectedBrand] = useState<'all' | 'sandtex' | 'caplux' | 'micmag'>('all');
  
  // Cart / Inquiry Basket State
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [orderRegion, setOrderRegion] = useState('');

  // Detail Modal State — stores the StandardProduct (not rawItem)
  const [activeModalProduct, setActiveModalProduct] = useState<StandardProduct | null>(null);
  
  const [sortBy, setSortBy] = useState<'name-asc' | 'name-desc' | 'brand'>('brand');
  
  // Mobile Filter Drawer State (search only)
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

  // Filter & sort catalog items
  const filteredCatalog = useMemo(() => {
    let result = unifiedCatalog.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            p.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            p.tag.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesBrand = selectedBrand === 'all' || p.brand === selectedBrand;
      
      return matchesSearch && matchesBrand;
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
  }, [unifiedCatalog, searchQuery, selectedBrand, sortBy]);

  // Basket Handlers
  // Add a line item from the modal (supports duplicates with different color/size)
  const handleAddToOrder = (lineItem: OrderLineItem) => {
    setCart(prev => [
      ...prev,
      {
        lineId: `${lineItem.productId}-${Date.now()}`,
        product: unifiedCatalog.find(p => p.id === lineItem.productId) || activeModalProduct!,
        color: lineItem.color?.name ?? null,
        size: lineItem.size,
        quantity: lineItem.quantity,
      }
    ]);
    setIsCartOpen(true);
  };

  const handleRemoveFromBasket = (lineId: string) => {
    setCart(prev => prev.filter(item => item.lineId !== lineId));
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

  // Submit multi-product order to WhatsApp
  const handleSubmitInquiry = () => {
    if (cart.length === 0) return;

    // Group line items by product name
    const grouped = new Map<string, CartItem[]>();
    cart.forEach(item => {
      const key = item.product.name;
      if (!grouped.has(key)) grouped.set(key, []);
      grouped.get(key)!.push(item);
    });

    let text = `*MICMAG HOMES & FITTINGS — ORDER ENQUIRY*\n`;
    text += `===================================\n\n`;
    text += `Hello Micmag team! I'd like to place a paint/fittings order for the following:\n\n`;

    let idx = 1;
    grouped.forEach((lines, productName) => {
      const lineDescs = lines.map(l => {
        const parts: string[] = [`${l.quantity}×`];
        if (l.color) parts.push(l.color);
        if (l.size) parts.push(l.size);
        return parts.join(' ');
      });
      text += `${idx}. *${productName}* — ${lineDescs.join(', ')}\n`;
      idx++;
    });

    if (orderRegion) {
      text += `\n📍 *Delivery Location:* ${orderRegion}\n`;
    }
    text += `\nPlease confirm availability, pricing, and next steps. Thank you!`;

    openWhatsApp('2347052940445', text);
  };

  return (
    <div className="pt-24 min-h-screen bg-brand-cream relative">
      
      {/* Banner / Header */}
      <div className="relative text-white py-16 px-5 md:px-[5%] overflow-hidden border-b border-neutral-900 bg-neutral-950">
        <div className="absolute inset-0 animated-gradient-bg opacity-25 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="space-y-3 text-left">
            <span className="text-amber-500 text-xs font-bold tracking-[0.25em] uppercase flex items-center gap-1.5">
              <ShoppingBag className="w-4 h-4 text-amber-500" />
              Trade Portal
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-none">
             Catalogue
            </h1>
            <p className="max-w-xl text-neutral-300 text-xs sm:text-sm leading-relaxed font-light">
              Add products directly to your technical cart, estimate overall building coverage, and export your itemized list straight to our central distribution desk.
            </p>
          </div>
          
          {/* Quick Basket Summary Button */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="self-start md:self-center bg-white text-micmag-blue-deep px-6 py-4 rounded-full font-bold uppercase text-[11px] tracking-wider shadow-lg hover:bg-neutral-100 transition-all flex items-center gap-2.5 cursor-pointer shrink-0"
          >
            <ShoppingBag className="w-4 h-4 text-brand-red" />
            <span>My Cart ({cart.reduce((sum, item) => sum + item.quantity, 0)})</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-5 md:px-[5%] py-8 md:py-12">
            {/* Inline Brand Chips — Mobile-first, shown on all screen sizes */}
        <div className="flex flex-wrap gap-2 mb-6 px-0">
          {[
            { id: 'all', label: 'All Products', color: 'bg-neutral-700' },
            { id: 'sandtex', label: 'Sandtex Paint', color: 'bg-micmag-red' },
            { id: 'caplux', label: 'Caplux Prep', color: 'bg-amber-600' },
            { id: 'micmag', label: 'Sanitary & Fittings', color: 'bg-micmag-blue' },
          ].map(b => (
            <button
              key={b.id}
              onClick={() => setSelectedBrand(b.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-wider border transition-all cursor-pointer ${
                selectedBrand === b.id
                  ? `${b.color} text-white border-transparent shadow-sm`
                  : 'bg-white text-neutral-600 border-neutral-200 hover:border-neutral-400'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${b.color} shrink-0 ${selectedBrand === b.id ? 'bg-white/60' : ''}`} />
              {b.label}
            </button>
          ))}
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

            {/* Brand Catalogue Filter */}
            <div className="bg-white border border-neutral-200 p-5 rounded-lg space-y-4 shadow-sm">
              <div className="flex items-center justify-between border-b border-neutral-100 pb-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-400">
                  Brand Catalogues
                </span>
                <SlidersHorizontal className="w-3.5 h-3.5 text-neutral-400" />
              </div>
              
              <div className="space-y-1.5">
                {[
                  { id: 'all', label: 'All Catalogues' },
                  { id: 'sandtex', label: 'Sandtex Paint System' },
                  { id: 'caplux', label: 'Caplux Preparation' },
                  { id: 'micmag', label: 'Sanitary & Fittings' }
                ].map(b => (
                  <button
                    key={b.id}
                    onClick={() => {
                      setSelectedBrand(b.id as any);
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
                <option value="brand">Sort by Brand Catalogue</option>
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
              
              {(selectedBrand !== 'all' || searchQuery) && (
                <button
                  onClick={() => {
                    setSelectedBrand('all');
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
                    onClick={() => setActiveModalProduct(p)}
                    className="bg-white border border-neutral-200 rounded-lg overflow-hidden flex flex-col justify-between h-full shadow-sm hover:shadow-md hover:border-neutral-300 transition-all group cursor-pointer"
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
                            ? 'bg-micmag-red' 
                            : p.brand === 'caplux' 
                              ? 'bg-amber-600' 
                              : 'bg-micmag-blue'
                        }`}>
                          {p.brand === 'sandtex' ? 'Sandtex' : p.brand === 'caplux' ? 'Caplux' : 'Micmag'}
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
                        <h3 className="font-serif text-base font-bold text-neutral-900 leading-tight group-hover:text-micmag-blue transition-colors">
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

                    </div>

                    {/* Interactive Action Row */}
                    <div className="p-5 pt-0">
                      
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveModalProduct(p);
                        }}
                        className="w-full bg-micmag-red hover:brightness-110 text-white py-2.5 rounded text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-1 shadow-sm cursor-pointer transition-all"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>Inquire / Order</span>
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
              <div className="bg-micmag-blue-deep text-white p-5 flex justify-between items-center border-b border-neutral-800">
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
                      className="text-xs font-bold text-micmag-blue uppercase hover:underline cursor-pointer"
                    >
                      Browse Catalogue
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    
                  {cart.map(item => (
                      <div 
                        key={item.lineId} 
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
                        
                        <div className="flex-grow space-y-1 pr-6">
                          <span className={`text-[8px] font-mono uppercase font-bold tracking-wider px-1.5 py-0.5 rounded text-white ${
                            item.product.brand === 'sandtex' 
                              ? 'bg-micmag-red' 
                              : item.product.brand === 'caplux' 
                                ? 'bg-amber-600' 
                                : 'bg-micmag-blue'
                          }`}>
                            {item.product.brand.toUpperCase()}
                          </span>
                          <h4 className="font-serif text-sm font-bold text-neutral-900 leading-tight">
                            {item.product.name}
                          </h4>
                          <div className="flex flex-wrap gap-1.5 mt-1">
                            {item.size && (
                              <span className="text-[9px] font-mono bg-neutral-100 border border-neutral-200 px-2 py-0.5 rounded font-bold text-neutral-600">
                                {item.size}
                              </span>
                            )}
                            {item.color && (
                              <span className="text-[9px] font-mono bg-neutral-100 border border-neutral-200 px-2 py-0.5 rounded font-bold text-neutral-600">
                                {item.color}
                              </span>
                            )}
                            <span className="text-[9px] font-mono bg-neutral-100 border border-neutral-200 px-2 py-0.5 rounded font-bold text-neutral-600">
                              Qty: {item.quantity}
                            </span>
                          </div>
                        </div>

                        {/* Remove Button */}
                        <button
                          onClick={() => handleRemoveFromBasket(item.lineId)}
                          className="absolute top-4 right-4 text-neutral-400 hover:text-micmag-red transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}

                    {/* Interactive Yield Estimator */}
                    {totalEstimatedCoverage > 0 && (
                      <div className="bg-blue-50 border border-blue-200/80 p-4 rounded-lg space-y-2">
                        <div className="flex items-center gap-1.5 text-xs text-micmag-blue font-bold">
                          <Info className="w-4 h-4 text-micmag-blue" />
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

                  <div className="space-y-3">
                    {/* Location selector */}
                    <select
                      value={orderRegion}
                      onChange={(e) => setOrderRegion(e.target.value)}
                      className="w-full border border-neutral-200 rounded-lg py-2.5 px-3.5 text-xs font-mono text-neutral-700 focus:outline-none focus:border-micmag-blue bg-white"
                    >
                      <option value="">📍 Select Delivery Location</option>
                      <option value="Lagos Mainland">Lagos Mainland</option>
                      <option value="Lagos Island">Lagos Island</option>
                    </select>

                    <div className="grid grid-cols-3 gap-2">
                      <button
                        onClick={handleClearBasket}
                        className="border border-neutral-300 hover:bg-neutral-100 text-neutral-600 py-3 rounded text-[10px] font-bold uppercase tracking-wider cursor-pointer"
                      >
                        Clear All
                      </button>
                      <button
                        onClick={handleSubmitInquiry}
                        className="col-span-2 bg-micmag-red hover:brightness-110 text-white py-3 rounded text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 shadow cursor-pointer transition-all"
                      >
                        <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-white shrink-0" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.455 5.703 1.456h.004c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
                        <span>Send Order via WhatsApp</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

            </motion.div>
          </>
        )}
      </AnimatePresence>


      {/* Product Detail Modal */}
      {activeModalProduct && (
        <ProductDetailModal
          isOpen={true}
          onClose={() => setActiveModalProduct(null)}
          item={activeModalProduct.rawItem}
          type="product"
          brand={activeModalProduct.brand}
          productId={activeModalProduct.id}
          onAddToOrder={handleAddToOrder}
        />
      )}

      {/* Floating Inquiry Basket Icon (Beside WhatsApp on desktop, on top on mobile) */}
      <button
        onClick={() => setIsCartOpen(true)}
        className="fixed z-[90] bg-micmag-blue text-white w-14 h-14 rounded-full flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 border-2 border-brand-charcoal cursor-pointer bottom-[104px] right-8 md:bottom-8 md:right-[104px]"
        title="Open Cart"
      >
        <ShoppingBag className="w-6 h-6 text-white" />
        {cart.reduce((sum, item) => sum + item.quantity, 0) > 0 && (
          <span className="absolute -top-1 -right-1 bg-micmag-red text-white text-[10px] font-mono font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-brand-charcoal shadow-sm">
            {cart.reduce((sum, item) => sum + item.quantity, 0)}
          </span>
        )}
      </button>

    </div>
  );
}
