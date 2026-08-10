export interface SwatchColor {
  id: string;
  name: string;
  hex: string;
  category: 'earth' | 'green' | 'blue' | 'neutral' | 'grey' | 'spice';
  code: string;
  productLine: string;
  desc: string;
  isDark?: boolean;
}

export interface ColorHarmony {
  id: string;
  name: string;
  tagline: string;
  description: string;
  mainWall: string; // hex
  accentWall: string; // hex
  ceiling: string; // hex
  trim: string; // hex
  accents: string; // hex
  tags: string[];
}

export type RoomTypeId = 'living-room' | 'master-bedroom' | 'dining-kitchen' | 'exterior-facade' | 'bathroom';

export interface RoomType {
  id: RoomTypeId;
  name: string;
  subtitle: string;
  icon: string;
  description: string;
  defaultColors: {
    mainWall: string;
    accentWall: string;
    ceiling: string;
    trim: string;
    accents: string;
  };
}

export type SurfaceKey = 'mainWall' | 'accentWall' | 'ceiling' | 'trim' | 'accents';

export interface SurfaceInfo {
  key: SurfaceKey;
  label: string;
  icon: string;
  desc: string;
  recommendedFinish: string;
}

export type LightingMode = 'daylight' | 'warm' | 'cool';
export type FinishType = 'matt' | 'silk' | 'textured' | 'gloss';

export const SURFACES: SurfaceInfo[] = [
  {
    key: 'mainWall',
    label: 'Main Wall',
    icon: '🎨',
    desc: 'Dominant 60% room wall surface',
    recommendedFinish: 'Sandtex Matt / Silk',
  },
  {
    key: 'accentWall',
    label: 'Accent / Feature Wall',
    icon: '🖌️',
    desc: '30% feature wall behind TV, headboard or art',
    recommendedFinish: 'Sandtex Silk / FineBuild',
  },
  {
    key: 'ceiling',
    label: 'Ceiling',
    icon: '🏛️',
    desc: 'Overhead ceiling & pop cornice',
    recommendedFinish: 'Sandtex Matt (Non-Reflective)',
  },
  {
    key: 'trim',
    label: 'Trim & Moulding',
    icon: '📐',
    desc: 'Skirting boards, architraves & door frames',
    recommendedFinish: 'Sandtex Gloss / Satin',
  },
  {
    key: 'accents',
    label: 'Accents & Furniture',
    icon: '🛋️',
    desc: 'Curtains, cushions & statement decor',
    recommendedFinish: 'Complementary Tone',
  },
];

export const ROOM_TYPES: RoomType[] = [
  {
    id: 'living-room',
    name: 'Modern Living Room',
    subtitle: 'Contemporary lounge with feature TV wall & lounge seating',
    icon: 'Sofa',
    description: 'Perfect for testing 60-30-10 color combinations in high-traffic family lounges.',
    defaultColors: {
      mainWall: '#e8d5b7', // Warm Sand
      accentWall: '#1a2c5b', // Midnight Blue
      ceiling: '#f8f9fa', // Brilliant White
      trim: '#ffffff', // Clean Trim
      accents: '#c9a84c', // Harvest Gold
    },
  },
  {
    id: 'master-bedroom',
    name: 'Master Bedroom Suite',
    subtitle: 'Serene sanctuary with upholstered headboard & warm ambient lights',
    icon: 'BedDouble',
    description: 'Experiment with relaxing, restful tones for restful sleep and cozy luxury.',
    defaultColors: {
      mainWall: '#b7c9a8', // Sage Mist
      accentWall: '#4a7c59', // Forest Fern
      ceiling: '#fffbeb', // Ivory Cream
      trim: '#f8f9fa', // White Trim
      accents: '#d4a96a', // Sahara Dust
    },
  },
  {
    id: 'dining-kitchen',
    name: 'Dining & Kitchen',
    subtitle: 'Open-concept culinary space with feature dining backdrop',
    icon: 'Utensils',
    description: 'Test appetizing warm tones, clean neutrals, and easy-wipe silk vinyl finishes.',
    defaultColors: {
      mainWall: '#fffbeb', // Ivory Cream
      accentWall: '#c4622d', // Terracotta
      ceiling: '#ffffff', // White
      trim: '#2c2c2c', // Charcoal
      accents: '#e07b39', // Sunset Amber
    },
  },
  {
    id: 'exterior-facade',
    name: 'Exterior Duplex Facade',
    subtitle: 'Contemporary architectural exterior with pillar accents',
    icon: 'Home',
    description: 'Test Sandtex Weathershield & FineBuild for durable, UV-resistant curb appeal.',
    defaultColors: {
      mainWall: '#8fa3b1', // Slate Cloud
      accentWall: '#2c2c2c', // Charcoal Noir
      ceiling: '#f8f9fa', // Eaves White
      trim: '#ffffff', // Architectural White Trim
      accents: '#c9a84c', // Gold/Bronze Accents
    },
  },
  {
    id: 'bathroom',
    name: 'Luxury Bathroom Suite',
    subtitle: 'Modern European sanitary suite with vanity feature zone',
    icon: 'Bath',
    description: 'Simulate moisture-resistant Caplux prep systems and elegant bathroom wall colors.',
    defaultColors: {
      mainWall: '#b8d4e8', // Sky Haze
      accentWall: '#1a2c5b', // Midnight Blue
      ceiling: '#ffffff', // Pure White
      trim: '#f8f9fa', // Trim
      accents: '#c9a84c', // Brushed Brass Fittings
    },
  },
];

export const SANDTEX_PALETTE: SwatchColor[] = [
  // ── Warm Earth & Terracottas ─────────────────────────────────────────────
  {
    id: 'stx-sahara-dust',
    name: 'Sahara Dust',
    hex: '#d4a96a',
    category: 'earth',
    code: 'STX-101',
    productLine: 'Sandtex Matt / Silk Vinyl',
    desc: 'Sun-drenched golden ochre inspired by West African landscapes.',
  },
  {
    id: 'stx-warm-sand',
    name: 'Warm Sand',
    hex: '#e8d5b7',
    category: 'earth',
    code: 'STX-102',
    productLine: 'Sandtex Matt',
    desc: 'Soft, welcoming beige neutral that balances daylight effortlessly.',
  },
  {
    id: 'stx-terracotta',
    name: 'Terracotta Clay',
    hex: '#c4622d',
    category: 'earth',
    code: 'STX-103',
    productLine: 'Sandtex Matt / FineBuild',
    desc: 'Rich baked clay with grounding warmth and Mediterranean charm.',
  },
  {
    id: 'stx-burnt-sienna',
    name: 'Burnt Sienna',
    hex: '#a0522d',
    category: 'earth',
    code: 'STX-104',
    productLine: 'Sandtex Silk Vinyl',
    desc: 'Deep russet tone, ideal for cozy reading corners and dining backdrops.',
  },
  {
    id: 'stx-harvest-gold',
    name: 'Harvest Gold',
    hex: '#c9a84c',
    category: 'earth',
    code: 'STX-105',
    productLine: 'Sandtex Silk / Gloss',
    desc: 'Signature Micmag luxury gold accent for trims and feature walls.',
  },
  {
    id: 'stx-sunset-amber',
    name: 'Sunset Amber',
    hex: '#e07b39',
    category: 'earth',
    code: 'STX-106',
    productLine: 'Sandtex Matt',
    desc: 'Lively, warm evening glow that infuses energy into open living areas.',
  },
  {
    id: 'stx-lemon-zest',
    name: 'Warm Honey',
    hex: '#e5b857',
    category: 'earth',
    code: 'STX-107',
    productLine: 'Sandtex Matt',
    desc: 'Radiant mellow yellow tone that brightens low-light corridors.',
  },

  // ── Botanical & Heritage Greens ──────────────────────────────────────────
  {
    id: 'stx-sage-mist',
    name: 'Sage Mist',
    hex: '#b7c9a8',
    category: 'green',
    code: 'STX-201',
    productLine: 'Sandtex Matt / Silk',
    desc: 'Gentle, organic muted sage for tranquil bedrooms and spa-like spaces.',
  },
  {
    id: 'stx-forest-fern',
    name: 'Forest Fern',
    hex: '#4a7c59',
    category: 'green',
    code: 'STX-202',
    productLine: 'Sandtex Matt / FineBuild',
    desc: 'Lush tropical green with earthy depth, great for feature walls.',
  },
  {
    id: 'stx-emerald-isle',
    name: 'Emerald Isle',
    hex: '#1a6b3c',
    category: 'green',
    code: 'STX-203',
    productLine: 'Sandtex Silk Vinyl',
    desc: 'Deep regal jewel green, evoking high-end executive luxury.',
  },
  {
    id: 'stx-tropical-leaf',
    name: 'Tropical Leaf',
    hex: '#2d6a4f',
    category: 'green',
    code: 'STX-204',
    productLine: 'Sandtex Matt',
    desc: 'Vibrant botanical shade paired beautifully with natural timber.',
  },
  {
    id: 'stx-olive-grove',
    name: 'Olive Grove',
    hex: '#606c38',
    category: 'green',
    code: 'STX-205',
    productLine: 'Sandtex Matt / Weathershield',
    desc: 'Sophisticated Mediterranean olive that adds timeless understated luxury.',
  },
  {
    id: 'stx-jade-whisper',
    name: 'Jade Whisper',
    hex: '#98c1a9',
    category: 'green',
    code: 'STX-206',
    productLine: 'Sandtex Silk Vinyl',
    desc: 'Pale ethereal sea-green that expands perception of room size.',
  },

  // ── Coastal & Royal Blues ────────────────────────────────────────────────
  {
    id: 'stx-sky-haze',
    name: 'Sky Haze',
    hex: '#b8d4e8',
    category: 'blue',
    code: 'STX-301',
    productLine: 'Sandtex Matt',
    desc: 'Airy, serene morning sky hue that opens up smaller bedrooms and baths.',
  },
  {
    id: 'stx-ocean-mist',
    name: 'Ocean Mist',
    hex: '#7ba7bc',
    category: 'blue',
    code: 'STX-302',
    productLine: 'Sandtex Silk Vinyl',
    desc: 'Refreshing coastal blue with balanced grey-green undertones.',
  },
  {
    id: 'stx-midnight-blue',
    name: 'Midnight Blue',
    hex: '#1a2c5b',
    category: 'blue',
    code: 'STX-303',
    productLine: 'Sandtex Silk / FineBuild',
    desc: 'Rich navy blue for commanding feature walls and home theater spaces.',
    isDark: true,
  },
  {
    id: 'stx-cobalt-dusk',
    name: 'Cobalt Dusk',
    hex: '#2d4a8e',
    category: 'blue',
    code: 'STX-304',
    productLine: 'Sandtex Silk Vinyl',
    desc: 'Electric twilight blue with dynamic depth under evening lighting.',
  },
  {
    id: 'stx-aegean-deep',
    name: 'Aegean Deep',
    hex: '#0f4c5c',
    category: 'blue',
    code: 'STX-305',
    productLine: 'Sandtex Matt',
    desc: 'Dark oceanic teal that creates an intimate, moody designer cocoon.',
    isDark: true,
  },

  // ── Timeless Whites & Neutrals ───────────────────────────────────────────
  {
    id: 'stx-brilliant-white',
    name: 'Brilliant White',
    hex: '#f8f9fa',
    category: 'neutral',
    code: 'STX-401',
    productLine: 'Sandtex Matt / Ceiling Finish',
    desc: 'Ultra-pure, light-reflective white that amplifies natural radiance.',
  },
  {
    id: 'stx-ivory-cream',
    name: 'Ivory Cream',
    hex: '#fffbeb',
    category: 'neutral',
    code: 'STX-402',
    productLine: 'Sandtex Matt / Silk',
    desc: 'Warm, buttery off-white that adds inviting softness without harsh glare.',
  },
  {
    id: 'stx-alabaster',
    name: 'Alabaster Glow',
    hex: '#f5efe6',
    category: 'neutral',
    code: 'STX-403',
    productLine: 'Sandtex Matt',
    desc: 'Refined warm neutral loved by interior architects for modern villas.',
  },
  {
    id: 'stx-warm-linen',
    name: 'Warm Linen',
    hex: '#ede0d4',
    category: 'neutral',
    code: 'STX-404',
    productLine: 'Sandtex Matt / Silk',
    desc: 'Textured fabric-like warmth for understated elegance.',
  },
  {
    id: 'stx-cashmere',
    name: 'Cashmere Veil',
    hex: '#e6ccb2',
    category: 'neutral',
    code: 'STX-405',
    productLine: 'Sandtex Silk Vinyl',
    desc: 'Velvety taupe cream that pairs with both warm gold and cool metals.',
  },

  // ── Architectural Greys & Charcoals ──────────────────────────────────────
  {
    id: 'stx-slate-cloud',
    name: 'Slate Cloud',
    hex: '#8fa3b1',
    category: 'grey',
    code: 'STX-501',
    productLine: 'Sandtex Weathershield / Matt',
    desc: 'Modern architectural grey with a slight cool blue cast.',
  },
  {
    id: 'stx-storm-grey',
    name: 'Storm Grey',
    hex: '#5a6472',
    category: 'grey',
    code: 'STX-502',
    productLine: 'Sandtex Matt / Weathershield',
    desc: 'Substantial medium-dark grey for exterior trims and modern facades.',
    isDark: true,
  },
  {
    id: 'stx-charcoal-noir',
    name: 'Charcoal Noir',
    hex: '#2c2c2c',
    category: 'grey',
    code: 'STX-503',
    productLine: 'Sandtex Matt / Gloss Trim',
    desc: 'Dramatic architectural black-grey for high-contrast frames and portals.',
    isDark: true,
  },
  {
    id: 'stx-concrete-loft',
    name: 'Industrial Concrete',
    hex: '#b0b5b3',
    category: 'grey',
    code: 'STX-504',
    productLine: 'Sandtex FineBuild Textured',
    desc: 'Raw urban mineral texture, perfect for loft and contemporary aesthetics.',
  },

  // ── Luxury Accents & Spices ──────────────────────────────────────────────
  {
    id: 'stx-crimson-spice',
    name: 'Crimson Spice',
    hex: '#8b1a1a',
    category: 'spice',
    code: 'STX-601',
    productLine: 'Sandtex Silk Vinyl',
    desc: 'Micmag heritage deep crimson, delivering dramatic regal luxury.',
    isDark: true,
  },
  {
    id: 'stx-dusty-mauve',
    name: 'Dusty Mauve',
    hex: '#c4919b',
    category: 'spice',
    code: 'STX-602',
    productLine: 'Sandtex Matt',
    desc: 'Sophisticated muted rose-mauve for feminine luxury dressing suites.',
  },
  {
    id: 'stx-blush-rose',
    name: 'Blush Rose',
    hex: '#f4a0a0',
    category: 'spice',
    code: 'STX-603',
    productLine: 'Sandtex Matt',
    desc: 'Warm playful pastel blush for nursery and boutique guest rooms.',
  },
  {
    id: 'stx-velvet-plum',
    name: 'Velvet Plum',
    hex: '#6b4c7a',
    category: 'spice',
    code: 'STX-604',
    productLine: 'Sandtex Silk Vinyl',
    desc: 'Sensual deep purple-plum for dramatic powder rooms and study spaces.',
    isDark: true,
  },
  {
    id: 'stx-ochre-royal',
    name: 'Ochre Royal',
    hex: '#b38024',
    category: 'spice',
    code: 'STX-605',
    productLine: 'Sandtex Silk / FineBuild',
    desc: 'Rich antique mustard gold with historic prestige.',
  },
];

export const DESIGNER_HARMONIES: ColorHarmony[] = [
  {
    id: 'ikoyi-modernist',
    name: 'Ikoyi Modernist',
    tagline: 'Deep Midnight & Golden Sand',
    description: 'A prestigious high-contrast balance of rich navy feature walls softened by warm desert sand.',
    mainWall: '#e8d5b7', // Warm Sand
    accentWall: '#1a2c5b', // Midnight Blue
    ceiling: '#f8f9fa', // Brilliant White
    trim: '#ffffff', // Clean Trim
    accents: '#c9a84c', // Harvest Gold
    tags: ['Luxury', 'Living Room', 'High-Contrast'],
  },
  {
    id: 'victoria-island-sunset',
    name: 'VI Sunset Terracotta',
    tagline: 'Warm Amber & Earthy Clay',
    description: 'Sun-drenched warmth celebrating earth, terracotta, and warm golden lighting.',
    mainWall: '#fffbeb', // Ivory Cream
    accentWall: '#c4622d', // Terracotta Clay
    ceiling: '#fdf8f0', // Soft Ceiling
    trim: '#a0522d', // Burnt Sienna
    accents: '#e07b39', // Sunset Amber
    tags: ['Warm & Cozy', 'Dining', 'Terracotta'],
  },
  {
    id: 'botanical-sanctuary',
    name: 'Botanical Sanctuary',
    tagline: 'Sage Mist & Forest Canopy',
    description: 'Calming biophilic greenery that reduces stress and connects indoor spaces to nature.',
    mainWall: '#b7c9a8', // Sage Mist
    accentWall: '#4a7c59', // Forest Fern
    ceiling: '#f8f9fa', // Brilliant White
    trim: '#f5efe6', // Alabaster Trim
    accents: '#c9a84c', // Gold Accents
    tags: ['Relaxing', 'Bedroom', 'Biophilic'],
  },
  {
    id: 'coastal-eko',
    name: 'Eko Coastal Breeze',
    tagline: 'Sky Haze & Cobalt Ocean',
    description: 'Refreshing Atlantic-inspired palette that maximizes natural light and spaciousness.',
    mainWall: '#b8d4e8', // Sky Haze
    accentWall: '#2d4a8e', // Cobalt Dusk
    ceiling: '#ffffff', // Crisp White
    trim: '#f8f9fa', // White Trim
    accents: '#7ba7bc', // Ocean Mist
    tags: ['Fresh', 'Bathroom', 'Airy'],
  },
  {
    id: 'nordic-minimalist',
    name: 'Lekki Contemporary Loft',
    tagline: 'Slate Cloud & Charcoal Noir',
    description: 'Architectural monochrome styling with rich tactile texture for clean minimalism.',
    mainWall: '#8fa3b1', // Slate Cloud
    accentWall: '#2c2c2c', // Charcoal Noir
    ceiling: '#f8f9fa', // Pure White
    trim: '#5a6472', // Storm Grey
    accents: '#c9a84c', // Brass Contrast
    tags: ['Modern', 'Exterior', 'Minimalist'],
  },
  {
    id: 'royal-heritage',
    name: 'Micmag Royal Heritage',
    tagline: 'Crimson Spice & Alabaster Glow',
    description: 'Rich heritage luxury featuring Micmag crimson accents on warm alabaster backdrops.',
    mainWall: '#f5efe6', // Alabaster Glow
    accentWall: '#8b1a1a', // Crimson Spice
    ceiling: '#fffbeb', // Ivory Cream
    trim: '#c9a84c', // Gold Trim
    accents: '#2c2c2c', // Black
    tags: ['Regal', 'Feature Room', 'Prestige'],
  },
];
