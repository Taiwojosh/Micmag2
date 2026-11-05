import { SANDTEX_COLORS, SandtexColorGroup } from './sandtexColors';

export interface SwatchColor {
  id: string;
  name: string;
  hex: string;
  category: SandtexColorGroup | string;
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
      mainWall: '#DDD6C3', // Off White (Sandtex)
      accentWall: '#243142', // Navy Blue (Sandtex)
      ceiling: '#EEEBE0', // Apple White (Sandtex)
      trim: '#EAE4DA', // Bone White (Sandtex)
      accents: '#DBA220', // Golden Yellow (Sandtex)
    },
  },
  {
    id: 'master-bedroom',
    name: 'Master Bedroom Suite',
    subtitle: 'Serene sanctuary with upholstered headboard & warm ambient lights',
    icon: 'BedDouble',
    description: 'Experiment with relaxing, restful tones for restful sleep and cozy luxury.',
    defaultColors: {
      mainWall: '#CCD3BF', // Aspen Whispers (Sandtex)
      accentWall: '#1F5139', // National Green (Sandtex)
      ceiling: '#E5EBE2', // Mountain Air (Sandtex)
      trim: '#EAE4DA', // Bone White (Sandtex)
      accents: '#BA9E74', // Rich Cream (Sandtex)
    },
  },
  {
    id: 'dining-kitchen',
    name: 'Dining & Kitchen',
    subtitle: 'Open-concept culinary space with feature dining backdrop',
    icon: 'Utensils',
    description: 'Test appetizing warm tones, clean neutrals, and easy-wipe silk vinyl finishes.',
    defaultColors: {
      mainWall: '#EFE6DA', // Rose Dawn (Sandtex)
      accentWall: '#C53B21', // Orange Crush (Sandtex)
      ceiling: '#EEEBE0', // Apple White (Sandtex)
      trim: '#343233', // Bitter Chocolate (Sandtex)
      accents: '#DF7935', // Orange (Sandtex)
    },
  },
  {
    id: 'exterior-facade',
    name: 'Exterior Duplex Facade',
    subtitle: 'Contemporary architectural exterior with pillar accents',
    icon: 'Home',
    description: 'Test Sandtex Weathershield & FineBuild for durable, UV-resistant curb appeal.',
    defaultColors: {
      mainWall: '#616665', // Pale Grey (Sandtex)
      accentWall: '#414A4E', // Dark Grey (Sandtex)
      ceiling: '#EAE4DA', // Bone White (Sandtex)
      trim: '#343233', // Bitter Chocolate (Sandtex)
      accents: '#CC252C', // Lekki Red (Sandtex)
    },
  },
  {
    id: 'bathroom',
    name: 'Luxury Bathroom Suite',
    subtitle: 'Modern European sanitary suite with vanity feature zone',
    icon: 'Bath',
    description: 'Simulate moisture-resistant Caplux prep systems and elegant bathroom wall colors.',
    defaultColors: {
      mainWall: '#BDCCC2', // Mist Blue (Sandtex)
      accentWall: '#1D658C', // Brilliant Blue (Sandtex)
      ceiling: '#E5EBE2', // Mountain Air (Sandtex)
      trim: '#EAE4DA', // Bone White (Sandtex)
      accents: '#243142', // Navy Blue (Sandtex)
    },
  },
];

// Map the official 120 Sandtex Colors into the showroom palette
export const SANDTEX_PALETTE: SwatchColor[] = SANDTEX_COLORS.map((c) => ({
  id: `stx-${c.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
  name: c.name,
  hex: c.hex,
  category: c.group,
  code: c.code,
  productLine: 'Sandtex Matt / Silk / FineBuild',
  desc: c.desc || `${c.name} — authentic Sandtex coating formulated by CAP Plc.`,
  isDark: c.isDark,
}));

export const DESIGNER_HARMONIES: ColorHarmony[] = [
  {
    id: 'ikoyi-modernist',
    name: 'Ikoyi Modernist',
    tagline: 'Deep Navy Blue & Off-White',
    description: 'A prestigious high-contrast balance of rich navy feature walls softened by warm off-white tones.',
    mainWall: '#DDD6C3', // Off White
    accentWall: '#243142', // Navy Blue
    ceiling: '#EEEBE0', // Apple White
    trim: '#EAE4DA', // Bone White
    accents: '#DBA220', // Golden Yellow
    tags: ['Luxury', 'Living Room', 'High-Contrast'],
  },
  {
    id: 'victoria-island-sunset',
    name: 'VI Sunset Terracotta',
    tagline: 'Orange Crush & Rose Dawn',
    description: 'Sun-drenched warmth celebrating earth, terracotta, and warm golden lighting.',
    mainWall: '#EFE6DA', // Rose Dawn
    accentWall: '#C53B21', // Orange Crush
    ceiling: '#E4DBCA', // Sugar Cookie
    trim: '#845B42', // Sienna
    accents: '#DF7935', // Orange
    tags: ['Warm & Cozy', 'Dining', 'Terracotta'],
  },
  {
    id: 'botanical-sanctuary',
    name: 'Botanical Sanctuary',
    tagline: 'Aspen Whispers & National Green',
    description: 'Calming biophilic greenery that reduces stress and connects indoor spaces to nature.',
    mainWall: '#CCD3BF', // Aspen Whispers
    accentWall: '#1F5139', // National Green
    ceiling: '#D2DBD2', // Icy Wind
    trim: '#EAE4DA', // Bone White
    accents: '#DBA220', // Golden Yellow
    tags: ['Relaxing', 'Bedroom', 'Biophilic'],
  },
  {
    id: 'coastal-eko',
    name: 'Eko Coastal Breeze',
    tagline: 'Mist Blue & Blue Blood',
    description: 'Refreshing Atlantic-inspired palette that maximizes natural light and spaciousness.',
    mainWall: '#BDCCC2', // Mist Blue
    accentWall: '#14619A', // Blue Blood
    ceiling: '#E5EBE2', // Mountain Air
    trim: '#EAE4DA', // Bone White
    accents: '#7A9CB0', // Ocean Wave
    tags: ['Fresh', 'Bathroom', 'Airy'],
  },
  {
    id: 'lekki-prestige-red',
    name: 'Lekki Prestige Red',
    tagline: 'Signature Lekki Red & Off-White',
    description: 'Bold architectural statement featuring Nigeria’s iconic Lekki Red against clean neutrals.',
    mainWall: '#DDD6C3', // Off White
    accentWall: '#CC252C', // Lekki Red
    ceiling: '#EEEBE0', // Apple White
    trim: '#343233', // Bitter Chocolate
    accents: '#DBA220', // Golden Yellow
    tags: ['Prestige', 'Feature Wall', 'Iconic'],
  },
  {
    id: 'contemporary-monochrome',
    name: 'Contemporary Monochrome',
    tagline: 'Silver Grey & Dark Grey',
    description: 'Architectural monochrome styling with rich tactile texture for clean minimalism.',
    mainWall: '#949391', // Silver Grey
    accentWall: '#414A4E', // Dark Grey
    ceiling: '#EAE4DA', // Bone White
    trim: '#343233', // Bitter Chocolate
    accents: '#CC252C', // Lekki Red
    tags: ['Modern', 'Exterior', 'Minimalist'],
  },
];
