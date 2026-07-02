import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Skeleton from './Skeleton';
import { Palette, X, Flame, Shield, Droplet, Timer, BookOpen, AlertCircle, MessageSquare, Lock } from 'lucide-react';
import ProductCard from './ProductCard';
import { CAPLUX_PRODUCTS } from '../data/capluxProducts';
import ProductDetailModal from './ProductDetailModal';
import TrustPill from './TrustPill';
import { useLocation, Link } from 'react-router-dom';
import { openWhatsApp } from '../utils/whatsapp';

const PAINT_PRODUCTS = [
  {
    name: 'VME (Vinyl Matt Emulsion) 20L/4L',
    desc: 'High-opacity, contract-grade vinyl matt emulsion direct from CAP Plc. Delivers a gorgeous rich matt finish with exceptional wet-on-wet spread and superior durability. Available in over 120 colors.',
    tag: 'Interior Classic',
    coverage: '8-10 m²/L',
    image: './Sandtex VME.png',
    fallback: 'https://images.unsplash.com/photo-1590487988256-9ed24133863e?auto=format&fit=crop&q=80&w=800',
    tdsSpec: {
      title: 'SANDTEX CLASSIC VINYL MATT EMULSION (VME)',
      description: 'Standard Contract-Grade Vinyl Matt Emulsion paint with superior opacity and high coverage rate. Delivers a gorgeous flat-matt protective wrap tailored for high-yield building needs.',
      typicalUses: [
        'For Interior wall and ceilings',
        'Can be applied on plasterboards, screeded surfaces, brickwork, and masonry'
      ],
      keyBenefits: [
        'Excellent value and high economy of paint yield',
        'Strong opacity and smooth color spread',
        'Easy to apply with standard roller and spray',
        'Non-lead and eco-conscious formulation'
      ],
      composition: {
        pigment: 'Standard Hiding Non-Lead Pigments',
        binder: 'Vinyl Acetate Copolymer',
        solvent: 'Water'
      },
      packSize: '20 Liters',
      finish: 'Flat Matt',
      volumeSolids: '32-35%',
      theoreticalCoverage: '8-10 m²/L',
      dryingInfo: {
        touchDry: '15-30 min',
        hardDry: '2 hrs',
        opacity: '2 coats'
      },
      applicationInfo: {
        method: 'Stir deep before use. Apply by brush, premium roller, or airless spray.',
        coverage: '8-10 sq.m/L under normal conditions.'
      },
      thinning: {
        brushRoller: 'Do not thin. Apply directly.',
        spray: 'Thin up to 15% with clean water'
      },
      safetyStorage: {
        storage: 'Store cool and dry. Keep container sealed upright to avoid seepage.',
        careline: 'Chemical & Allied Products Plc Careline Help: 08159493070'
      }
    }
  },
  {
    name: 'Select VME 20L',
    desc: 'Premium ready-mix matt finish with outstanding hiding power, durability, and color retention. Suitable for beautiful smooth finishes on interior and exterior walls and ceilings.',
    tag: 'Interior & Exterior Matt',
    coverage: '8 m²/L per coat',
    image: './Sandtex select VME.png',
    fallback: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=800',
    tdsSpec: {
      title: 'SANDTEX SELECT VINYL MATT EMULSION PAINT',
      description: 'Sandtex Select Vinyl Matt Emulsion Paint is a ready-mix premium matt finish for walls, facades and ceilings with outstanding standing hiding power and color retention properties. It has an excellent flow and gives a smooth, highly durable finish.',
      typicalUses: [
        'Suitable for Interior and Exterior use',
        'Can be applied on cement plaster, stucco filler, concrete, asbestos cement sheeting, and rendered block work'
      ],
      keyBenefits: [
        'Good Opacity & Standing Hiding Power',
        'Good Spreading Rate & High Yield efficiency',
        'Ideal for Long Term Exposure to elements',
        'Good Scrub Resistance (ultra-cleanable)',
        'Superior Durable Paint Film'
      ],
      composition: {
        pigment: 'Lightfast Non-Lead Pigments',
        binder: 'Acrylic Copolymer Emulsion',
        solvent: 'Water'
      },
      packSize: '20L (Ready-mix)',
      finish: 'Smooth Matt',
      volumeSolids: '30-40%',
      theoreticalCoverage: '8 m²/L per coat',
      dryingInfo: {
        touchDry: '10-20 min',
        hardDry: '1-2 hrs',
        opacity: '2 coats'
      },
      applicationInfo: {
        method: 'Stir well before use. Apply by brush or medium roller. Ensure color accuracy checks on-site prior to application.',
        coverage: '8 sq.m per litre per coat can be achieved under normal conditions.'
      },
      thinning: {
        brushRoller: 'Stir well. Do not thin.',
        spray: 'Thin 4 parts paint with 1 part clean water'
      },
      safetyStorage: {
        storage: 'Store in a cool, dry, well-ventilated place protected from moisture, away from sources of heat, ignition and direct sunlight. Store upright.',
        careline: 'CAP Careline Helpline: 08159493070 or email careline@capplc.com'
      }
    }
  },
  {
    name: 'Satin 20L/4L',
    desc: 'Elite satin emulsion delivering an ultra-wipeable, super-spreading reflective coating. Highly scrub-resistant, washable formulation perfectly engineered for premium corridors, lobbies, and active rooms.',
    tag: 'Interior & Exterior',
    coverage: '12-14 m²/L',
    image: './satin1.png',
    fallback: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=800',
    tdsSpec: {
      title: 'SANDTEX PREMIUM SATIN EMULSION',
      description: 'Elite semi-gloss satin emulsion with supreme washability. Specifically designed to provide a rich, soft-sheen protective coat that can withstand intense scrubbing and cleaning.',
      typicalUses: [
        'For high-traffic Interior lobbies, kitchens, corridors, and high-prestige exterior trims',
        'Screeded walls, luxury columns, partitions, panel mouldings'
      ],
      keyBenefits: [
        'Elite washability & scrub-resistance',
        'Superb light reflection and smooth pearl sheen',
        'Mildew & moisture-resistant barrier',
        'Ultra-low odor and rapid dry'
      ],
      composition: {
        pigment: 'Premium Lightfast Rutile Titanium Dioxide',
        binder: 'Advanced Pure Acrylic Copolymer',
        solvent: 'Water'
      },
      packSize: '20 Liters',
      finish: 'Semi-Gloss Pearl Sheen',
      volumeSolids: '38-42%',
      theoreticalCoverage: '12-14 m²/L',
      dryingInfo: {
        touchDry: '15-30 min',
        hardDry: '2-3 hrs',
        opacity: '2 coats'
      },
      applicationInfo: {
        method: 'Stir well. Apply by short-nap synthetic roller or brush.',
        coverage: '12-14 sq.m/L under standard parameters.'
      },
      thinning: {
        brushRoller: 'Ready to use. Do not thin.',
        spray: 'Thin clean water up to 10% maximum'
      },
      safetyStorage: {
        storage: 'Store away from freezing conditions and direct intense sunlight.',
        careline: 'CAP Plc Support Careline line: 08159493070'
      }
    }
  },
  {
    name: 'Matt (Smooth & Tough Exterior) 20L',
    desc: 'Legendary exterior coating delivering wet & coastal protection for humid regions. Actively curbs algae and fungi growth while allowing masonry breathing ventilation. Only 1 coat required.',
    tag: 'Exterior Shield',
    coverage: '2.5-3.5 m²/L',
    image: './Sandtex MATT.png',
    fallback: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&q=80&w=800',
    tdsSpec: {
      title: 'SANDTEX MATT SMOOTH & TOUGH EXTERIOR MASONRY',
      description: 'The ultimate weather-proof defensive shield for exterior walls. Engineered with state-of-the-art climate polymers to resist heavy tropical rainfall, intense UV heat, and coastal salinity.',
      typicalUses: [
        'Exterior facades, perimeter fences, high-rise luxury concrete structures',
        'Highly recommended for tropical and coastal regions with extreme weather patterns'
      ],
      keyBenefits: [
        'Premium Anti-fungal & anti-algae biocide defense built-in',
        'Outstanding UV protection prevents color chalking and fading',
        'Microporous structure allows trapped moisture to escape while blocking liquid rain',
        'Stretches with masonry to resist fine hair cracks'
      ],
      composition: {
        pigment: 'High-grade weathering oxides and pigments',
        binder: 'Silicone-Modified Premium Acrylic',
        solvent: 'Water'
      },
      packSize: '20 Liters',
      finish: 'Tough Flat-Matt',
      volumeSolids: '40-45%',
      theoreticalCoverage: '2.5-3.5 m²/L',
      dryingInfo: {
        touchDry: '1 hr',
        hardDry: '4 hrs',
        opacity: '1-2 coats'
      },
      applicationInfo: {
        method: 'Apply directly onto clean primed masonry. Use sturdy long-pile exterior rollers.',
        coverage: '2.5 - 3.5 sq.m per litre.'
      },
      thinning: {
        brushRoller: 'Ready to use. Do not thin.',
        spray: 'Not recommended to thin heavily'
      },
      safetyStorage: {
        storage: 'Store upright under shade. Keep out of reach of children.',
        careline: 'CAP Plc Helpline Careline: 08159493070'
      }
    }
  },
  {
    name: 'Trade Smooth 20L',
    desc: 'Highly robust, smooth, tough exterior developer paint. Delivers a long-lasting, superior-quality weather barrier favored by elite Nigerian real estate developers for its tremendous yield specs.',
    tag: 'Professional Elite',
    coverage: '14-16 m²/L',
    image: './Sandtex Trade Smooth.png',
    fallback: 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?auto=format&fit=crop&q=80&w=800',
    tdsSpec: {
      title: 'SANDTEX TRADE SMOOTH MASONRY',
      description: 'The preferred choice for commercial developers. Combines elite durability with an extremely high spreading yield, allowing real estate builders to cover massive surface areas without sacrificing performance.',
      typicalUses: [
        'Large-scale commercial developments, estates, high-rise apartment facades',
        'Rrendered brickwork, concrete blocks, and exterior boards'
      ],
      keyBenefits: [
        'Exceptional cover yield (massive surface economy)',
        'Resistant to carbonation and atmospheric pollution',
        'Easy bulk application parameters',
        'Guaranteed professional weather-locked finish'
      ],
      composition: {
        pigment: 'Standard Fine Grade Weatherproof Pigments',
        binder: 'External Co-polymer Emulsion',
        solvent: 'Water'
      },
      packSize: '20 Liters',
      finish: 'Smooth Professional Matt',
      volumeSolids: '35-38%',
      theoreticalCoverage: '14-16 m²/L',
      dryingInfo: {
        touchDry: '30-45 min',
        hardDry: '3 hrs',
        opacity: '2 coats'
      },
      applicationInfo: {
        method: 'Stir well before use. Apply by professional roller or commercial spray setups.',
        coverage: '14-16 sq.m per litre under normal conditions.'
      },
      thinning: {
        brushRoller: 'Stir well. No thinning needed.',
        spray: 'Thin 10% water for airless setups'
      },
      safetyStorage: {
        storage: 'Store away from sunlight. Keep tight.',
        careline: 'CAP Careline support: 08159493070'
      }
    }
  },
  {
    name: 'Finebuild 20L',
    desc: 'Ready-mixed textured base coating specifically engineered to mask fine plaster cracks and uneven rendering. Durable fungi-resistant textured coat which stabilizes masonry pores.',
    tag: 'Surface Preparation',
    coverage: '1-1.5 m²/L',
    image: './Sandtex FineBuild.png',
    fallback: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800',
    tdsSpec: {
      title: 'FINEBUILD TEXTURED PRIMER',
      description: 'Ready-mixed textured build primer to stabilize porous walls, mask fine plaster spider cracks, and create a uniform mechanical tooth for topcoats. Ensures flawless adhesion for subsequent coats.',
      typicalUses: [
        'Uneven external masonry, highly porous concrete block work, cracked rendering',
        'Ideal prep base for Sandtex Matt, Satin, or VME'
      ],
      keyBenefits: [
        'Binds dusty, porous and challenging exterior surfaces',
        'Excellent high-build crack bridging ability',
        'Enhances topcoat yields by up to 25%',
        'Excellent chemical and mildew resistance'
      ],
      composition: {
        pigment: 'Quartz Sands, Calcium Carbonates, Mica',
        binder: 'High-build Acrylic Latex Polymer',
        solvent: 'Water'
      },
      packSize: '20 Liters',
      finish: 'Textured Matt',
      volumeSolids: '45-50%',
      theoreticalCoverage: '1-1.5 m²/L',
      dryingInfo: {
        touchDry: '1.5 hrs',
        hardDry: '24 hrs',
        opacity: '1 coat'
      },
      applicationInfo: {
        method: 'Apply with special textured roller or heavy fiber brush. Work in uniform directions.',
        coverage: '1-1.5 sq.m per litre.'
      },
      thinning: {
        brushRoller: 'Do not thin. Apply directly at high viscosity.',
        spray: 'N/A'
      },
      safetyStorage: {
        storage: 'Keep container sealed key tight. Prevent freezing.',
        careline: 'CAP Careline: 08159493070'
      }
    }
  },
  {
    name: 'Gloss 4L',
    desc: 'Brilliant non-yellowing high-gloss protective enamel for gates, wooden balustrades, skirting, and steel frame trims. Contains no added lead for ultimate workplace and environmental safety.',
    tag: 'Multi-surface Gloss',
    coverage: '16-18 m²/L',
    image: './Sandtex GLOSS.png',
    fallback: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&q=80&w=800',
    tdsSpec: {
      title: 'BRiLLiANT HIGH GLOSS ENAMEL',
      description: 'Heavy-duty polyurethane modified high gloss enamel for timber and metals. Dries to a magnificent brilliant mirror shine that resists petroleum, weathering, and grease.',
      typicalUses: [
        'Exterior steel gates, handrails, cladding, burglar proofs',
        'Interior wooden architraves, skirting boards, doors, furniture'
      ],
      keyBenefits: [
        'Ultra-brilliant mirror finish',
        'Polyurethane-toughened to resist scratching and scuffs',
        'Non-yellowing white & deep permanent shades',
        'Lead-free formulation for ultimate domestic safety'
      ],
      composition: {
        pigment: 'Premium organic lightfast gloss pigments',
        binder: 'Polyurethane Alkyd resin',
        solvent: 'Aliphatic Hydrocarbons (Mineral spirits)'
      },
      packSize: '4 Liters',
      finish: 'Mirror High-Gloss',
      volumeSolids: '50-55%',
      theoreticalCoverage: '16-18 m²/L',
      dryingInfo: {
        touchDry: '4 hrs',
        hardDry: '16 hrs',
        opacity: '1-2 coats'
      },
      applicationInfo: {
        method: 'Apply by high-quality natural bristle brush or clean foam roller.',
        coverage: '16-18 sq.m/L under optimal settings.'
      },
      thinning: {
        brushRoller: 'Thin up to 5% with premium mineral turpentine',
        spray: 'Thin up to 10% with mineral spirits'
      },
      safetyStorage: {
        storage: 'Flammable liquid. Keep away from fire, sparks, and flame sources. Store cool and ventilated.',
        careline: 'CAP Customer Careline Support: 08159493070'
      }
    }
  }
];

const UNUSED_CAPLUX_LOCAL = [
  {
    name: 'Caplux Premium Acrylic Putty 20kg',
    desc: 'Ready-to-use professional grade acrylic screeding putty. Delivers a highly uniform, ultra-smooth base to eliminate hairline cracks and plaster imperfections before topcoat application.',
    tag: 'Screeding & Fills',
    coverage: '1.5 - 2.5 m²/kg',
    image: './Caplux Putty.png',
    fallback: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800',
    tdsSpec: {
      title: 'CAPLUX PREMIUM ACRYLIC WALL PUTTY',
      description: 'High-build, interior & exterior ready-mixed wall putty designed to create an absolutely level surface on cement render, concrete, POP ceilings, and gypsum boards.',
      typicalUses: [
        'Interior living spaces, luxury bedrooms, office boardrooms',
        'Exterior facades needing high-surface-evenness prep before topcoats'
      ],
      keyBenefits: [
        'Supreme sanding ease with minimal airborne dust',
        'Remarkable elastomeric property prevents shrinkage cracks',
        'Exceptional dry film thickness and topcoat hold-out',
        'Saves up to 30% on topcoat paint consumption due to reduced substrate absorption'
      ],
      composition: {
        pigment: 'Premium calcium carbonate and micronized dolomite fills',
        binder: 'Acrylic copolymer emulsion',
        solvent: 'Water'
      },
      packSize: '20 Kilograms',
      finish: 'Smooth Fine White Matt',
      volumeSolids: '48% - 52%',
      theoreticalCoverage: '1.5 - 2.5 sq.m per kg depending on render irregularities',
      dryingInfo: {
        touchDry: '2 Hours',
        hardDry: '12 - 24 Hours (recoat/sand after full cure)',
        opacity: '1-2 coats usually sufficient'
      },
      applicationInfo: {
        method: 'Apply directly with steel spatula or taping trowel.',
        coverage: '1.5 - 2.5 sq.m/kg.'
      },
      thinning: {
        brushRoller: 'Do not thin. Apply straight from container.'
      },
      safetyStorage: {
        storage: 'Store in cool conditions out of direct sunlight. Keep lid securely clamped.',
        careline: 'CAP Plc Careline support line: 08159493070'
      }
    }
  },
  {
    name: 'Caplux Alkali Resisting Primer 20L',
    desc: 'High-performance water-borne primer sealer engineered to shield topcoats from masonry alkalinity. Ideal for fresh plaster and concrete blocks to prevent peeling.',
    tag: 'Salt Protection',
    coverage: '10 - 12 m²/L',
    image: './Caplux Alkali.png',
    fallback: 'https://images.unsplash.com/photo-1590487988256-9ed24133863e?auto=format&fit=crop&q=80&w=800',
    tdsSpec: {
      title: 'CAPLUX ALKALI RESISTING PRIMER',
      description: 'Specially customized acrylic primer sealing solution designed to lock in alkaline salts common in new cement masonry blocks and coastal Lagos renders.',
      typicalUses: [
        'Freshly cured exterior and interior masonry walls',
        'Highly humid and alkaline environments near sea breezes'
      ],
      keyBenefits: [
        'Blocks active efflorescence (salt bursting)',
        'Extends lifecycle of premium topcoat collections',
        'Superb substrate penetration and binding capability',
        'Provides uniform paint absorption across different substrate densities'
      ],
      composition: {
        pigment: 'Titanium dioxide and corrosion inhibitor pigments',
        binder: 'Saponification-resistant acrylic polymer',
        solvent: 'Water'
      },
      packSize: '20 Liters',
      finish: 'Low-Sheen Translucent White',
      volumeSolids: '34-36%',
      theoreticalCoverage: '10 - 12 sq.m per litre per coat',
      dryingInfo: {
        touchDry: '30 Minutes',
        hardDry: '4 Hours (allow 12-18h under humid coastal conditions)',
        opacity: '1 coat'
      },
      applicationInfo: {
        method: 'Apply by brush or synthetic roller.'
      },
      thinning: {
        brushRoller: 'Thin up to 10% with clean water for heavily porous surfaces.'
      },
      safetyStorage: {
        storage: 'Keep container upright in cool, dry depot.',
        careline: 'CAP Plc Helpline careline: 08159493070'
      }
    }
  },
  {
    name: 'Caplux Red Oxide Anti-Rust Primer 4L',
    desc: 'Premium solvent-borne anti-corrosion primer for ferrous steel. Infused with superior synthetic alkyd binders to lock out coastal air humidity and sea-spray rust.',
    tag: 'Anti-Rust Metal',
    coverage: '12 - 14 m²/L',
    image: './Caplux Red Oxide.png',
    fallback: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&q=80&w=800',
    tdsSpec: {
      title: 'CAPLUX RED OXIDE ANTI-RUST METAL PRIMER',
      description: 'Heavy duty, rust-inhibiting trade metal primer based on zinc chromate and synthetic alkyd. Locks out oxygen and moisture from structural iron surfaces.',
      typicalUses: [
        'Metal security gates, exterior window/door burglar frames, handrails',
        'Steel beams and structural corrugated metal joints'
      ],
      keyBenefits: [
        'Elite anti-rust barrier stops rust propagation under the paint film',
        'Excellent adhesion provides a perfect key for Caplux High Gloss topcoats',
        'Highly resistant to tropical rain weathering and salt-air ingress',
        'Uniform leveling and smooth spread'
      ],
      composition: {
        pigment: 'Red iron oxide, zinc phosphate rust inhibitors',
        binder: 'Polyurethane-modified alkyd resin',
        solvent: 'Mineral spirits'
      },
      packSize: '4 Liters',
      finish: 'Matt Red-Brown Finish',
      volumeSolids: '46-50%',
      theoreticalCoverage: '12 - 14 sq.m per litre',
      dryingInfo: {
        touchDry: '2 Hours',
        hardDry: '12 - 16 Hours (recoat after 16 hours)',
        opacity: '1-2 coats'
      },
      applicationInfo: {
        method: 'Stir deep. Apply onto clean, wire-brushed rust-free metal.'
      },
      thinning: {
        brushRoller: 'Ready to use. Do not thin unless spraying (5-10% mineral spirits).'
      },
      safetyStorage: {
        storage: 'Contains mineral solvent. Keep away from heat and open flames. Store in cool shade.',
        careline: 'CAP Careline line: 08159493070'
      }
    }
  },
  {
    name: 'Caplux Plaster Sealer 20L',
    desc: 'High-binding, deep-penetrating water base sealer designed to lock powdery masonry substrates and seal porous blockwork surfaces for higher paint yields.',
    tag: 'Substrate Sealer',
    coverage: '8 - 10 m²/L',
    image: './Caplux Sealer.png',
    fallback: 'https://images.unsplash.com/photo-1590487988256-9ed24133863e?auto=format&fit=crop&q=80&w=800',
    tdsSpec: {
      title: 'CAPLUX CONCENTRATED PLASTER SEALER',
      description: 'Premium acrylic-based solvent and water micro-particle sealer. Penetrates deep into crumbly masonry to form a tough polymeric composite core.',
      typicalUses: [
        'Highly porous concrete blockwork, crumbly raw renders, dusty skimmed surfaces',
        'Consolidating weathered plaster before painting'
      ],
      keyBenefits: [
        'Binds chalky surfaces, preventing paint peeling',
        'Saves topcoat volumes dramatically',
        'Excellent resistance to dampness penetration',
        'Low odor formulation'
      ],
      composition: {
        pigment: 'Fine particle filler and sealers',
        binder: 'Special micro-emulsion acrylic',
        solvent: 'Water'
      },
      packSize: '20 Liters',
      finish: 'Slight Sheen Clear Finish',
      volumeSolids: '30-33%',
      theoreticalCoverage: '8 - 10 sq.m per sub-litre depending on surface porosity',
      dryingInfo: {
        touchDry: '45 Minutes',
        hardDry: '4 Hours (let cure overnight before skinning or painting)',
        opacity: '1 coat'
      },
      applicationInfo: {
        method: 'Apply generously with roller or direct pressure pump spray.'
      },
      thinning: {
        brushRoller: 'Do not thin. Apply directly for maximum binding efficiency.'
      },
      safetyStorage: {
        storage: 'Store in cool conditions. Avoid extreme cold or intense overhead sun.',
        careline: 'CAP Plc Helpline careline: 08159493070'
      }
    }
  },
  {
    name: 'Caplux Wood Primer White 4L',
    desc: 'Oil-based primer sealer formulated for soft and hardwoods. Seals wood micropores, blocks tannin bleeding, and creates a dense protective layer.',
    tag: 'Wood Undercoat',
    coverage: '11 - 13 m²/L',
    image: './Caplux Wood Primer.png',
    fallback: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&q=80&w=800',
    tdsSpec: {
      title: 'CAPLUX WHITE OIL-BASED WOOD PRIMER',
      description: 'Premium oil-based wood primer for architectural timber, frames, and trim details. Locks wood knots and seals timber grain.',
      typicalUses: [
        'Interior wooden cabinet frames, door frames, baseboards',
        'Exterior wooden cladding structures, pergolas, banisters'
      ],
      keyBenefits: [
        'Stops wood sap and tannin bleeding which ruins paint colors',
        'Provides a hard, easily sandable uniform surface layer',
        'Deep water resistance prevents timber rotting and swelling',
        'Exceptional opacity levels out timber texture variations'
      ],
      composition: {
        pigment: 'Titanium dioxide and fine wood sealers',
        binder: 'High-build synthetic oil-alkyd',
        solvent: 'Petroleum distillates'
      },
      packSize: '4 Liters',
      finish: 'Matt White Shell',
      volumeSolids: '52-55%',
      theoreticalCoverage: '11 - 13 sq.m per litre per coat',
      dryingInfo: {
        touchDry: '30 Minutes',
        hardDry: '16 Hours for sanding and topcoating',
        opacity: '1 coat is standard'
      },
      applicationInfo: {
        method: 'Apply along timber grain lines using natural bristle brushes.'
      },
      thinning: {
        brushRoller: 'Usually ready-for-use. Thin 5% turpentine if wood is dry.'
      },
      safetyStorage: {
        storage: 'Flammable. Store upright. Ensure ample cross-ventilation during application.',
        careline: 'CAP Plc helpline: 08159493070'
      }
    }
  },
  {
    name: 'Caplux Gypsum (POP) Primer 20L',
    desc: 'Specialist primer formulated exclusively for gypsum boards and sophisticated POP ceilings. Seals porous POP surfaces without swelling drywall joints.',
    tag: 'POP Ceiling Prep',
    coverage: '9 - 11 m²/L',
    image: './Caplux POP.png',
    fallback: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&q=80&w=800',
    tdsSpec: {
      title: 'CAPLUX SPECIALIST POP CEILING PRIMER',
      description: 'Water-based primer co-polymer formulated with ultra-fine pigments to establish immediate opacity on high-porosity gypsum ceiling castings.',
      typicalUses: [
        'Gypsum plaster casting sheets, luxury POP ceilings, bulkheads',
        'Drywall partitions and screeded boards'
      ],
      keyBenefits: [
        'Perfect adhesion on smooth ceiling details',
        'Does not swell joint tapes or corner beads',
        'Prevents color variance between joints and drywall surfaces',
        'Allows ceiling to breathe'
      ],
      composition: {
        pigment: 'Delicate micronized calcium silicates and TiO2',
        binder: 'Fine acrylic latex resin',
        solvent: 'Water'
      },
      packSize: '20 Liters',
      finish: 'Ultra-Matt Chalk White',
      volumeSolids: '32-34%',
      theoreticalCoverage: '9 - 11 sq.m per litre per coat',
      dryingInfo: {
        touchDry: '15-20 Minutes',
        hardDry: '2 Hours (extremely rapid dry system)',
        opacity: '1-2 coats depending on skim depth'
      },
      applicationInfo: {
        method: 'Apply with sheepskin roller. Ensure ceiling is clean from gypsum mold-release dust.'
      },
      thinning: {
        brushRoller: 'Do not thin. Apply direct.'
      },
      safetyStorage: {
        storage: 'Store cool and dry. Keep out of reach of children.',
        careline: 'CAP Plc customer support Careline: 08159493070'
      }
    }
  },
  {
    name: 'Caplux Solvent Stabilizing Sealer 20L',
    desc: 'Elite solvent-borne binder for highly powdery, degraded or chalky brickwork and aged weather-exposed facades. Consolidates crumbly renders to prevent peeling.',
    tag: 'Substrate Binders',
    coverage: '6 - 8 m²/L',
    image: './Caplux Stabilizing.png',
    fallback: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&q=80&w=800',
    tdsSpec: {
      title: 'CAPLUX DEEP PENETRATING STABILIZING SOLUTION',
      description: 'Solvent-based masonry binder with deep penetration properties designed to secure unstable renders and chalky brickwork with high performance.',
      typicalUses: [
        'Old chalking external facades before repaint jobs',
        'Consolidating fragile sand-cement blocks and limestone surfaces'
      ],
      keyBenefits: [
        'Penetrates up to 3mm into weathered renders, binding dusty grains securely',
        'Forms a permanent mechanical link for subsequent Sandtex Matt topcoats',
        'Strong water repellent prevents capillary damp transmission',
        'Superior chemical resistance'
      ],
      composition: {
        pigment: 'Clear unpigmented composite resin particles',
        binder: 'Aromatic thermosetting acrylic polymer',
        solvent: 'Aromatic hydrocarbons'
      },
      packSize: '20 Liters',
      finish: 'Invisible Dry Finish (Clear/Amber)',
      volumeSolids: '25-28%',
      theoreticalCoverage: '6 - 8 sq.m per litre based on deterioration severity',
      dryingInfo: {
        touchDry: '1 Hour',
        hardDry: '12 - 16 Hours to fully cure the substrate polymer',
        opacity: '1 coat'
      },
      applicationInfo: {
        method: 'Apply by synthetic brush or solvent-resistant roller. Ensure thorough saturation.'
      },
      thinning: {
        brushRoller: 'Do not thin. Ready for use.'
      },
      safetyStorage: {
        storage: 'Flammable solvent base. Keep away from sparks and direct heat. Ensure good ventilation.',
        careline: 'Chemical & Allied Products Plc: 08159493070'
      }
    }
  },
  {
    name: 'Caplux Fine Textured Primer 20L',
    desc: 'Fine sand-aggregate water-based textured primer. Excellent for bridging minor plaster cracks and creating a powerful mechanical grip for exterior coatings.',
    tag: 'Anti-Crack Primers',
    coverage: '2.5 - 3.5 m²/L',
    image: './Caplux Textured Base.png',
    fallback: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800',
    tdsSpec: {
      title: 'CAPLUX FINE TEXTURED BASE SEALER',
      description: 'Premium textured masonry primer containing specialized fine quartz micro-sand. Bridges plaster spiderweb thermal cracks and builds a rugged grip layer.',
      typicalUses: [
        'Uneven external cement plasters, concrete walls with coarse rendering',
        'Creating a mechanical texture "tooth" for heavy exterior protective coatings'
      ],
      keyBenefits: [
        'Bridges hairline cracks and masks substrate visual defects',
        'Excellent adhesion blocks topcoat paint sliding or sagging',
        'Algae-resistant and weather-locked durability polymer core',
        'Heavy-duty protection layer'
      ],
      composition: {
        pigment: 'Quartz aggregates and lightfast extender pigments',
        binder: 'High-build acrylic emulsion',
        solvent: 'Water'
      },
      packSize: '20 Liters',
      finish: 'Fine Sandy Textured Matt',
      volumeSolids: '42-45%',
      theoreticalCoverage: '2.5 - 3.5 sq.m per litre',
      dryingInfo: {
        touchDry: '1.5 Hours',
        hardDry: '8 - 12 Hours before topcoating',
        opacity: '1 coat is fully sufficient'
      },
      applicationInfo: {
        method: 'Apply with medium sand-roller or structured fiber block brushes.'
      },
      thinning: {
        brushRoller: 'Do not thin. Stir actively before and during application.'
      },
      safetyStorage: {
        storage: 'Store upright under shade. Do not allow to freeze.',
        careline: 'CAP Plc Helpline Support careline: 08159493070'
      }
    }
  },
  {
    name: 'Caplux Eco-Base Undercoat 20L',
    desc: 'Low-odor, water-borne undercoat premium prep paint. Perfect for high-density public hallways, school classrooms, and luxury hotel rooms.',
    tag: 'Premium Prep',
    coverage: '12 - 14 m²/L',
    image: './Caplux Eco Undercoat.png',
    fallback: 'https://images.unsplash.com/photo-1590487988256-9ed24133863e?auto=format&fit=crop&q=80&w=800',
    tdsSpec: {
      title: 'CAPLUX ECO-BASE UNDERCOAT',
      description: 'Eco-conscious, premium undercoat paint designed for fast interior turnovers with minimal room down-time.',
      typicalUses: [
        'Interior commercial office walls, hospital rooms, residential bedrooms',
        'Undercoat prep for subsequent Sandtex Satin or VME coats'
      ],
      keyBenefits: [
        'Almost Zero paint odor during and after application',
        'Premium white opacity blocks existing deep, dark colors easily',
        'Superb spread and excellent roller feel with minimal paint spatter',
        'Certified eco-safe and friendly to the touch'
      ],
      composition: {
        pigment: 'Ultra-pure titanium dioxide and chalk minerals',
        binder: 'Bio-based vinyl copolymer',
        solvent: 'Clean mineral water'
      },
      packSize: '20 Liters',
      finish: 'Smooth Pure-White Flat Matt',
      volumeSolids: '35-38%',
      theoreticalCoverage: '12 - 14 sq.m per litre per coat',
      dryingInfo: {
        touchDry: '15 Minutes (extremely rapid flash-off)',
        hardDry: '1.5 Hours (recoat immediately)',
        opacity: '1-2 coats'
      },
      applicationInfo: {
        method: 'Stir well and apply with standard soft interior rollers.'
      },
      thinning: {
        brushRoller: 'Ready to use. Do not thin.'
      },
      safetyStorage: {
        storage: 'Store under shade in a cool environment.',
        careline: 'CAP Plc Careline support line: 08159493070'
      }
    }
  }
];

const FITTINGS_PRODUCTS = [
  {
    name: 'Stucco Lustro Effect',
    desc: 'Classic Venetian marble plaster coating for luxury accent walls. Delivers a highly polished, glass-like reflective finish with delicate color depth for premium offices and residences.',
    tag: 'Decorative Plasters',
    image: './micmag-sanitary-ware.jpg',
    fallback: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=800'
  },
  {
    name: 'Premium Screeding & Skimcoat',
    desc: 'Elite acrylic-modified wall putty for perfect mirror-flat substrate preparation. Fills hairline cracks, locks porosity, and guarantees extreme adhesion for both Sandtex and Caplux topcoats.',
    tag: 'Wall Putty & Prep',
    image: './micmag-architectural-castings.jpg',
    fallback: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&q=80&w=800'
  },
  {
    name: 'Metallic & Pearl Effect Paints',
    desc: 'High-end water-borne metallic topcoats reflecting subtle gold, copper, or pearl luster under ambient lighting. Ideal for exclusive hotel lobbies, feature columns, and luxury master bedrooms.',
    tag: 'Specialty Effects',
    image: './micmag-sanitary-ware.jpg',
    fallback: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=800'
  },
  {
    name: 'Epoxy Floor Coatings',
    desc: 'Heavy-duty self-leveling resin-based protective flooring system. Designed to block oil stains, chemical corrosion, and heavy vehicle traffic in garages, warehouses, and industrial depots.',
    tag: 'Floor Finishes',
    image: './micmag-architectural-castings.jpg',
    fallback: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&q=80&w=800'
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
      staggerChildren: 0.08
    }
  }
};

const fadeInUpVariant = {
  initial: { opacity: 0, y: 35 },
  animate: { opacity: 1, y: 0, transition: springTransition }
};

export default function Collections() {
  const location = useLocation();
  const isCollectionsPage = location.pathname === '/collections';
  const [loading, setLoading] = useState(true);
  const [activeTds, setActiveTds] = useState<any | null>(null);
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    activeItem: any | null;
    type: 'product' | 'service';
  }>({
    isOpen: false,
    activeItem: null,
    type: 'product',
  });

  const handleSelectProductForQuote = (productName: string, brand: 'sandtex' | 'micmag' | 'caplux') => {
    const inquiryType = brand === 'sandtex' ? 'SANDTEX Paints' : brand === 'caplux' ? 'Caplux Surface Prep' : 'CAPLUX Paints & Primers';
    const customMessage = brand === 'caplux' 
      ? `Hello! I would like to receive pricing and detailed specifications representing "${productName}" from your Caplux Surface Prep catalog. Please consult with me on availability and schedules.`
      : `Hello! I would like to receive pricing and detailed specifications representing "${productName}". Please consult with me on availability and schedules.`;
    
    // Dispatch custom event to auto-populate LeadForm
    window.dispatchEvent(new CustomEvent('applyPaintEstimate', {
      detail: {
        inquiryType,
        message: customMessage
      }
    }));

    // Scroll to lead form smoothly
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleWhatsAppInquiry = (productName: string, brand: 'sandtex' | 'micmag' | 'caplux') => {
    const brandName = brand === 'sandtex' ? 'Sandtex Paint Division' : brand === 'caplux' ? 'Caplux Surface Prep' : 'MICMAG Specialty Division';
    const text = `Hello, I was browsing your premium catalog and would like to inquire about specifications and pricing for: "${productName}" under the ${brandName} catalog.`;
    openWhatsApp('2347052940445', text);
  };
  const [catalogFilter, setCatalogFilter] = useState<'all' | 'sandtex' | 'caplux' | 'micmag'>('all');

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 850);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section id="products" className="py-24 px-5 md:px-[5%] bg-[#F5F4F0]/60 border-b border-neutral-200">
      <div className="max-w-7xl mx-auto">
        
        {/* Dynamic Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={springTransition}
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-14"
        >
          <div className="lg:col-span-7 space-y-3 text-left">

            <h2 className="font-serif text-3xl sm:text-4xl md:text-[2.6rem] leading-[1.18] font-black text-brand-charcoal">
              Finishes & Fits Engineered <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-yellow via-brand-red to-amber-600">
                To Impress. To Last.
              </span>
            </h2>
          </div>
          <div className="lg:col-span-5 lg:pt-4 text-left">
          </div>
        </motion.div>

        {/* Dynamic User Interest Gateway Switcher */}
        <div className="flex flex-col lg:flex-row justify-start items-stretch lg:items-center gap-3.5 mb-14 border-b border-neutral-200/80 pb-6">
          {isCollectionsPage && (
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-brand-mid text-left lg:pr-2.5 self-center">
              Narrow Your Interest:
            </span>
          )}
          <div 
            className="flex overflow-x-auto lg:grid lg:grid-cols-4 gap-2.5 w-full no-scrollbar pb-3 lg:pb-0 -mx-5 px-5 lg:mx-0 lg:px-0 scroll-smooth snap-x snap-mandatory"
            style={{ 
              scrollbarWidth: 'none', 
              msOverflowStyle: 'none',
              WebkitOverflowScrolling: 'touch'
            }}
          >
            <button
              onClick={() => setCatalogFilter('all')}
              className={`flex-shrink-0 whitespace-nowrap snap-center min-w-[130px] lg:min-w-0 lg:w-full px-4 py-3.5 text-[10.5px] font-sans font-bold uppercase transition-all duration-300 cursor-pointer text-center ${
                catalogFilter === 'all'
                  ? 'bg-neutral-900 border border-neutral-900 text-[#f4efe5] shadow-md scale-102 font-black'
                  : 'bg-white border border-neutral-200 text-brand-mid hover:text-brand-charcoal hover:border-neutral-400 shadow-sm'
              }`}
              style={{ borderRadius: '25px' }}
            >
              All Products
            </button>
            <button
              onClick={() => { setCatalogFilter('sandtex'); }}
              className={`flex-shrink-0 whitespace-nowrap snap-center min-w-[130px] lg:min-w-0 lg:w-full px-4 py-3.5 text-[10.5px] font-sans font-bold uppercase transition-all duration-300 cursor-pointer text-center ${
                catalogFilter === 'sandtex'
                  ? 'bg-sandtex-red border border-sandtex-red text-white shadow-md scale-102 font-black'
                  : 'bg-white border border-neutral-200 text-brand-mid hover:text-sandtex-red hover:border-sandtex-red shadow-sm'
              }`}
              style={{ borderRadius: '25px' }}
            >
               Sandtex Paints
            </button>
            <button
              onClick={() => { setCatalogFilter('caplux'); }}
              className={`flex-shrink-0 whitespace-nowrap snap-center min-w-[130px] lg:min-w-0 lg:w-full px-4 py-3.5 text-[10.5px] font-sans font-bold uppercase transition-all duration-300 cursor-pointer text-center ${
                catalogFilter === 'caplux'
                  ? 'bg-sandtex-orange border border-sandtex-orange text-white shadow-md scale-102 font-black'
                  : 'bg-white border border-neutral-200 text-brand-mid hover:text-sandtex-orange hover:border-sandtex-orange shadow-sm'
              }`}
              style={{ borderRadius: '25px' }}
            >
              Caplux Surface Prep
            </button>
            <button
              onClick={() => { setCatalogFilter('micmag'); }}
              className={`flex-shrink-0 whitespace-nowrap snap-center min-w-[130px] lg:min-w-0 lg:w-full px-4 py-3.5 text-[10.5px] font-sans font-bold uppercase transition-all duration-300 cursor-pointer text-center ${
                catalogFilter === 'micmag'
                  ? 'bg-micmag-blue border border-micmag-blue text-white shadow-md scale-102 font-black'
                  : 'bg-white border border-neutral-200 text-brand-mid hover:text-micmag-blue hover:border-micmag-blue shadow-sm'
              }`}
              style={{ borderRadius: '25px', borderWidth: '1.701754px' }}
            >
              Specialty & Prep
            </button>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {/* Helper segment indicators */}

          {catalogFilter === 'caplux' && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-10 bg-amber-50/60 border border-amber-100 rounded-[4px] p-4 text-left flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-600 inline-block animate-pulse" />
                  Currently Viewing: CAPLUX Professional Surface Preparation
                </h4>

              </div>
              <a
                href="#contact"
                className="bg-amber-600 hover:bg-amber-700 text-white text-[10px] font-mono font-bold uppercase tracking-wider py-2 px-4 rounded-[2px] transition-colors inline-block text-center whitespace-nowrap"
              >
                Inquire Prep Products
              </a>
            </motion.div>
          )}

          {catalogFilter === 'micmag' && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-10 bg-amber-50 border border-amber-100 rounded-[4px] p-4 text-left flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-600 inline-block animate-pulse" />
                  Currently Viewing: Micmag Specialty & Prep Coatings (Premium Solutions)
                </h4>

              </div>
              <a
                href="#contact"
                className="bg-amber-600 hover:bg-amber-700 text-white text-[10px] font-mono font-bold uppercase tracking-wider py-2 px-4 rounded-[2px] transition-colors inline-block text-center whitespace-nowrap"
              >
                Inquire Design Specs
              </a>
            </motion.div>
          )}
        </AnimatePresence>

        {/* SANDTEX Paints Subsection */}
        {(catalogFilter === 'all' || catalogFilter === 'sandtex') && (
          <div className="mb-20">
            <div className="flex items-center justify-between mb-8 pb-3 border-b border-neutral-200">
              <h3 className="font-serif text-2xl font-extrabold text-brand-charcoal flex items-center gap-2">
                 Premium SANDTEX Coatings
              </h3>

            </div>

            <motion.div 
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, margin: "-50px" }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {loading
                ? Array.from({ length: isCollectionsPage ? 6 : (catalogFilter === 'all' ? 1 : 3) }).map((_, i) => (
                    <div key={i} className="bg-white rounded-[4px] p-8 border border-neutral-200 shadow-sm space-y-4">
                      <Skeleton className="w-10 h-10" />
                      <Skeleton className="w-3/4 h-6" />
                      <Skeleton className="w-full h-16" />
                    </div>
                  ))
                : (isCollectionsPage ? PAINT_PRODUCTS : PAINT_PRODUCTS.slice(0, catalogFilter === 'all' ? 1 : 3)).map((p, idx) => (
                    <ProductCard
                      key={idx}
                      product={p}
                      brand="sandtex"
                      onWhatsApp={(name) => handleWhatsAppInquiry(name, 'sandtex')}
                      onQuote={(name) => handleSelectProductForQuote(name, 'sandtex')}
                      onViewTDS={(product) => setActiveTds({ ...product, brand: 'sandtex' })}
                      onViewDetails={(product) => setModalState({ isOpen: true, activeItem: product, type: 'product' })}
                    />
                  ))}
            </motion.div>
          </div>
        )}

        {/* CAPLUX Surface Prep Subsection */}
        {(catalogFilter === 'all' || catalogFilter === 'caplux') && (
          <div className="mb-20">
            <div className="flex items-center justify-between mb-8 pb-3 border-b border-neutral-200">
              <h3 className="font-serif text-2xl font-extrabold text-brand-charcoal flex items-center gap-2">
                🛠️ CAPLUX Surface Preparation
              </h3>

            </div>

            <motion.div 
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, margin: "-50px" }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {loading
                ? Array.from({ length: isCollectionsPage ? 9 : (catalogFilter === 'all' ? 1 : 3) }).map((_, i) => (
                    <div key={i} className="bg-white rounded-[4px] p-8 border border-neutral-200 shadow-sm space-y-4">
                      <Skeleton className="w-10 h-10" />
                      <Skeleton className="w-3/4 h-6" />
                      <Skeleton className="w-full h-16" />
                    </div>
                  ))
                : (isCollectionsPage ? CAPLUX_PRODUCTS : CAPLUX_PRODUCTS.slice(0, catalogFilter === 'all' ? 1 : 3)).map((p, idx) => (
                    <ProductCard
                      key={idx}
                      product={p}
                      brand="caplux"
                      onWhatsApp={(name) => handleWhatsAppInquiry(name, 'caplux')}
                      onQuote={(name) => handleSelectProductForQuote(name, 'caplux')}
                      onViewTDS={(product) => setActiveTds({ ...product, brand: 'caplux' })}
                      onViewDetails={(product) => setModalState({ isOpen: true, activeItem: product, type: 'product' })}
                    />
                  ))}
            </motion.div>
          </div>
        )}

        {/* Specialty & Prep Subsection */}
        {(catalogFilter === 'all' || catalogFilter === 'micmag') && (
          <div>
            <div className="flex items-center justify-between mb-8 pb-3 border-b border-neutral-200">
              <h3 className="font-serif text-2xl font-extrabold text-brand-charcoal flex items-center gap-2">
                🎨 Specialty & Prep Coatings
              </h3>

            </div>

            <motion.div 
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, margin: "-50px" }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-6"
            >
              {loading
                ? Array.from({ length: isCollectionsPage ? 4 : (catalogFilter === 'all' ? 1 : 3) }).map((_, i) => (
                    <div key={i} className="bg-brand-charcoal rounded-[4px] p-8 shadow-sm space-y-4">
                      <Skeleton className="w-10 h-10 bg-white/20" />
                      <Skeleton className="w-3/4 h-6 bg-white/20" />
                      <Skeleton className="w-full h-16 bg-white/20" />
                    </div>
                  ))
                : (isCollectionsPage ? FITTINGS_PRODUCTS : FITTINGS_PRODUCTS.slice(0, catalogFilter === 'all' ? 1 : 3)).map((f, idx) => (
                    <ProductCard
                      key={idx}
                      product={f}
                      brand="micmag"
                      onWhatsApp={(name) => handleWhatsAppInquiry(name, 'micmag')}
                      onQuote={(name) => handleSelectProductForQuote(name, 'micmag')}
                      onViewTDS={(product) => setActiveTds({ ...product, brand: 'micmag' })}
                      onViewDetails={(product) => setModalState({ isOpen: true, activeItem: product, type: 'product' })}
                    />
                  ))}
            </motion.div>

            {!isCollectionsPage && (
              <div className="flex justify-center mt-12">
                <Link
                  to="/collections"
                  className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full border-2 border-brand-charcoal text-brand-charcoal text-xs font-black tracking-[0.15em] uppercase hover:bg-brand-charcoal hover:text-white transition-all duration-300 shadow-md cursor-pointer bg-white"
                >
                  Explore Full Paint & Coatings Catalog →
                </Link>
              </div>
            )}

            {/* Coating & Color Services (Section 5 page-by-page summary + Section 1a type cards) */}
            <div className="mt-16">
              <div className="flex items-center justify-between mb-8 pb-3 border-b border-neutral-200">
                <h3 className="font-serif text-2xl font-extrabold text-brand-charcoal flex items-center gap-2">
                  🛠️ Coating & Color Services
                </h3>

              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* 1. Interior Design Card */}
                <div 
                  onClick={() => setModalState({
                    isOpen: true,
                    activeItem: {
                      name: "Architectural Color Consultation",
                      scope: "Full Color Scheme & Coating Specification",
                      tag: "MIC-SRV-01",
                      desc: "Curate elegant paint concepts with expert color consulting, customized texture boards, and premium paint specifications.",
                      image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&q=80&w=800",
                      fallback: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&q=80&w=800"
                    },
                    type: 'service'
                  })}
                  className="bg-white border-2 border-[#1c1917] rounded-2xl p-5 shadow-[4px_4px_0px_0px_#1a6b3c] transition-all duration-150 hover:shadow-[6px_6px_0px_0px_#1a6b3c] hover:-translate-x-[1px] hover:-translate-y-[1px] active:shadow-[2px_2px_0px_0px_#1a6b3c] active:translate-x-[1px] active:translate-y-[1px] cursor-pointer text-left flex flex-col justify-between h-full relative"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3.5">
                      <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md border-2 border-[#1c1917] font-mono text-[9px] font-black tracking-widest uppercase bg-[#1a6b3c] text-white">
                        MICMAG SERVICE
                      </span>
                      <span className="font-mono text-[10px] text-[#78716c] font-black uppercase">
                        MIC-SRV-01
                      </span>
                    </div>

                    <div className="relative h-48 w-full border-2 border-[#1c1917] rounded-xl overflow-hidden bg-white mb-4">
                      <img
                        src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&q=80&w=800"
                        alt="Interior Design Consultation"
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <h4 className="font-display text-lg font-black text-[#1c1917] leading-tight mb-2">
                      Architectural Color Consultation
                    </h4>
                    <p className="text-xs text-[#78716c] leading-relaxed mb-4">
                      Curate elegant paint concepts with expert color consulting, customized texture boards, and premium paint specifications.
                    </p>
                  </div>

                  <div className="space-y-2 pt-2 mt-auto">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setModalState({
                          isOpen: true,
                          activeItem: {
                            name: "Architectural Color Consultation",
                            scope: "Full Color Scheme & Coating Specification",
                            tag: "MIC-SRV-01",
                            desc: "Curate elegant paint concepts with expert color consulting, customized texture boards, and premium paint specifications.",
                            image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&q=80&w=800",
                            fallback: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&q=80&w=800"
                          },
                          type: 'service'
                        });
                      }}
                      className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-transparent text-[#1c1917] border-2 border-[#1c1917] shadow-[2px_2px_0px_0px_#1c1917] font-sans text-xs font-semibold transition-all hover:bg-neutral-50 active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_0px_#1c1917] cursor-pointer"
                    >
                      <span>View Details</span>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        const text = "Hello! I am interested in booking an Architectural Color Consultation with your team.";
                        openWhatsApp('2347052940445', text);
                      }}
                      className="w-full flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-white bg-[#1a6b3c] border-2 border-[#1c1917] shadow-[2px_2px_0px_0px_#1c1917] font-sans text-xs font-bold transition-all active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_0px_#1c1917] cursor-pointer"
                    >
                      <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-white shrink-0" fill="currentColor">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.455 5.703 1.456h.004c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                      </svg>
                      <span>Enquire on WhatsApp</span>
                    </button>
                  </div>
                </div>

                {/* 2. Coming Soon (Carpentry) Card (Section 1f coming soon card with lock icon) */}
                <div 
                  className="bg-white border-2 border-dashed border-[#a8a29e] rounded-2xl p-5 opacity-70 shadow-[3px_3px_0px_0px_rgba(0,0,0,0.08)] text-left flex flex-col justify-between h-full relative"
                >
                  <div className="absolute top-4 right-4 text-[#a8a29e]">
                    <Lock className="w-4 h-4" />
                  </div>

                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3.5">
                      <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md border-2 border-[#a8a29e] font-mono text-[9px] font-black tracking-widest uppercase bg-[#f5f5f4] text-[#78716c]">
                        COMING SOON
                      </span>
                    </div>

                    <div className="relative h-48 w-full border-2 border-dashed border-[#a8a29e] rounded-xl overflow-hidden bg-neutral-50 mb-4 flex items-center justify-center">
                      <img
                        src="https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&q=80&w=800"
                        alt="Coming Soon Carpentry"
                        className="w-full h-full object-cover filter grayscale opacity-60"
                      />
                    </div>

                    <h4 className="font-display text-lg font-black text-[#a8a29e] leading-tight mb-2">
                      Substrate Testing & Inspection
                    </h4>
                    <p className="text-xs text-[#78716c] leading-relaxed mb-4">
                      Technical moisture analysis, substrate checking, and custom formulation recommendations for complex structures. (Launching Q4 2026)
                    </p>
                  </div>

                  <div className="space-y-2 pt-2 mt-auto">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        const text = "Hello! I am interested in registering interest for your custom Substrate Testing & Inspection services when they launch.";
                        openWhatsApp('2347052940445', text);
                      }}
                      className="w-full flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-transparent border-2 border-dashed border-[#a8a29e] text-[#78716c] hover:bg-neutral-50 transition-all font-sans text-xs font-bold cursor-pointer"
                    >
                      <span>Register Interest</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Interactive Technical Specifications Sheet (TDS) Modal Overlay */}
        <AnimatePresence>
          {activeTds && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-lg overflow-hidden"
              onClick={() => setActiveTds(null)}
            >
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 50 }}
                transition={{ type: 'tween', duration: 0.3 }}
                className="bg-white text-brand-charcoal w-full h-full flex flex-col shadow-2xl overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Premium technical header */}
                <div className="bg-neutral-900 text-[#f4efe5] px-6 py-5 border-b border-neutral-800 flex-shrink-0">
                  <div className="max-w-4xl mx-auto flex justify-between items-center w-full">
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-widest text-[#d32f2f] font-extrabold flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#d32f2f] animate-pulse" />
                        Official Technical Data Sheet (TDS)
                      </span>
                      <h3 className="font-serif text-lg md:text-2xl font-bold tracking-tight mt-1">{activeTds.tdsSpec?.title}</h3>
                    </div>
                    <button
                      onClick={() => setActiveTds(null)}
                      className="text-neutral-400 hover:text-white p-2.5 rounded-full hover:bg-neutral-850 transition-colors cursor-pointer ml-4"
                    >
                      <X className="w-5.5 h-5.5" />
                    </button>
                  </div>
                </div>

                {/* Scrollable Content Pane */}
                <div className="flex-1 overflow-y-auto">
                  <div className="max-w-4xl mx-auto p-6 md:p-10 space-y-8 font-sans leading-relaxed text-[13.5px] text-neutral-800">
                    
                    {/* Short meta description */}
                    <div className="bg-red-50/40 rounded-[4px] border border-red-100 p-5 shadow-sm">
                      <p className="font-serif italic text-brand-charcoal text-[0.94rem] leading-relaxed">
                        "{activeTds.tdsSpec?.description}"
                      </p>
                    </div>

                    {/* 2-Column Specs Layout */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-2">
                      
                      {/* Left Column: Basic Spec Table */}
                      <div className="space-y-6">
                        <div>
                          <h4 className="text-xs font-mono font-black uppercase tracking-wider text-brand-charcoal pb-1.5 border-b border-neutral-200 flex items-center gap-1.5 mb-3.5">
                            <BookOpen className="w-4 h-4 text-[#d32f2f]" /> Product Specifications
                          </h4>
                          <div className="space-y-2.5 font-mono text-[11px]">
                            <div className="flex justify-between py-1.5 border-b border-neutral-100">
                              <span className="text-neutral-500">PACK SIZE:</span>
                              <span className="font-bold text-brand-charcoal">{activeTds.tdsSpec?.packSize}</span>
                            </div>
                            <div className="flex justify-between py-1.5 border-b border-neutral-100">
                              <span className="text-neutral-500">FINISH LOOK:</span>
                              <span className="font-bold text-brand-charcoal">{activeTds.tdsSpec?.finish}</span>
                            </div>
                            <div className="flex justify-between py-1.5 border-b border-neutral-100">
                              <span className="text-neutral-500">VOLUME SOLIDS:</span>
                              <span className="font-bold text-brand-charcoal">{activeTds.tdsSpec?.volumeSolids || 'N/A'}</span>
                            </div>
                            <div className="flex justify-between py-1.5 border-b border-neutral-100">
                              <span className="text-neutral-500">PIGMENT TYPE:</span>
                              <span className="font-bold text-brand-charcoal text-right truncate max-w-[200px]" title={activeTds.tdsSpec?.composition?.pigment}>
                                {activeTds.tdsSpec?.composition?.pigment}
                              </span>
                            </div>
                            <div className="flex justify-between py-1.5 border-b border-neutral-100">
                              <span className="text-neutral-500">RESIN BINDER:</span>
                              <span className="font-bold text-brand-charcoal text-right truncate max-w-[200px]" title={activeTds.tdsSpec?.composition?.binder}>
                                {activeTds.tdsSpec?.composition?.binder}
                              </span>
                            </div>
                            <div className="flex justify-between py-1.5 border-b border-neutral-100">
                              <span className="text-neutral-500">SOLVENT:</span>
                              <span className="font-bold text-brand-charcoal">{activeTds.tdsSpec?.composition?.solvent}</span>
                            </div>
                          </div>
                        </div>

                        <div className="pt-2">
                          <h4 className="text-xs font-mono font-black uppercase tracking-wider text-brand-charcoal pb-1.5 border-b border-neutral-200 flex items-center gap-1.5 mb-3.5">
                            <Shield className="w-4 h-4 text-[#d32f2f]" /> Key Performance Benefits
                          </h4>
                          <ul className="space-y-2 text-neutral-700 list-none pl-0">
                            {activeTds.tdsSpec?.keyBenefits?.map((benefit: string, idx: number) => (
                              <li key={idx} className="flex items-start gap-2.5">
                                <span className="text-[#d32f2f] text-sm leading-none mt-0.5">✓</span>
                                <span className="text-[12.5px] md:text-[13px]">{benefit}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* Right Column: Drying & Application */}
                      <div className="space-y-6">
                        <div>
                          <h4 className="text-xs font-mono font-black uppercase tracking-wider text-brand-charcoal pb-1.5 border-b border-neutral-200 flex items-center gap-1.5 mb-3.5">
                            <Timer className="w-4 h-4 text-[#d32f2f]" /> Drying & Film Properties
                          </h4>
                          <div className="space-y-2.5 font-mono text-[11px]">
                            <div className="flex justify-between py-1.5 border-b border-neutral-100">
                              <span className="text-neutral-500">TOUCH DRY TIME:</span>
                              <span className="font-bold text-brand-charcoal">{activeTds.tdsSpec?.dryingInfo?.touchDry}</span>
                            </div>
                            <div className="flex justify-between py-1.5 border-b border-neutral-100">
                              <span className="text-neutral-500">HARD RECOAT DRY:</span>
                              <span className="font-bold text-brand-charcoal">{activeTds.tdsSpec?.dryingInfo?.hardDry}</span>
                            </div>
                            <div className="flex justify-between py-1.5 border-b border-neutral-100">
                              <span className="text-neutral-500">RECOMMENDED COATS:</span>
                              <span className="font-bold text-brand-charcoal">{activeTds.tdsSpec?.dryingInfo?.opacity}</span>
                            </div>
                          </div>
                        </div>

                        <div>
                          <h4 className="text-xs font-mono font-black uppercase tracking-wider text-brand-charcoal pb-1.5 border-b border-neutral-200 flex items-center gap-1.5 mb-3">
                            🌱 Architectural Intended Uses
                          </h4>
                          <ul className="space-y-2 pl-0 pr-1 list-none text-neutral-700">
                            {activeTds.tdsSpec?.typicalUses?.map((use: string, idx: number) => (
                              <li key={idx} className="flex items-start gap-2.5">
                                <span className="w-2 h-2 rounded-full bg-[#d32f2f] inline-block mt-1.5 flex-shrink-0" />
                                <span className="text-[12.5px] leading-relaxed">{use}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <h4 className="text-xs font-mono font-black uppercase tracking-wider text-brand-charcoal pb-1.5 border-b border-neutral-200 flex items-center gap-1.5 mb-2.5">
                            📏 Theoretical Material Spread
                          </h4>
                          <p className="text-[11.5px] leading-relaxed text-neutral-600 bg-neutral-50 border border-neutral-100 p-3.5 rounded-[3px] font-mono">
                            {activeTds.tdsSpec?.theoreticalCoverage}
                          </p>
                        </div>
                      </div>

                    </div>

                    {/* Thinning instructions panel */}
                    {activeTds.tdsSpec?.thinning && (
                      <div className="border border-neutral-200 rounded-[4px] overflow-hidden shadow-sm">
                        <div className="bg-neutral-50 px-5 py-3 border-b border-neutral-200 font-mono text-[11.5px] font-bold text-brand-charcoal">
                          ⚙️ Technical Thinning & Mixing Directions (SOP Standard)
                        </div>
                        <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-6 text-neutral-700 text-[12.5px]">
                          <div>
                            <span className="font-bold block text-[10.5px] font-mono text-neutral-500 mb-1 uppercase">Brush or Roller:</span>
                            <p className="leading-relaxed">{activeTds.tdsSpec.thinning.brushRoller}</p>
                          </div>
                          <div>
                            <span className="font-bold block text-[10.5px] font-mono text-neutral-500 mb-1 uppercase">Conventional Spray:</span>
                            <p className="leading-relaxed">{activeTds.tdsSpec.thinning.spray || 'Not recommended.'}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Safety and Support */}
                    <div className="bg-neutral-950 text-neutral-300 p-5 rounded-[4px] space-y-2.5 text-[11.5px] font-mono border border-neutral-850">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-[#d32f2f] flex-shrink-0 mt-0.5" />
                        <div>
                          <span className="font-semibold uppercase text-[10px] tracking-widest text-neutral-400">Project Storage Safety & Transport Info:</span>
                          <p className="text-neutral-300 font-sans text-[12px] leading-relaxed mt-1">
                            {activeTds.tdsSpec?.safetyStorage?.storage}
                          </p>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>

                {/* Footer trigger quote / action on whatsapp */}
                <div className="bg-neutral-100 border-t border-neutral-200 px-6 py-5 flex-shrink-0">
                  <div className="max-w-4xl mx-auto flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between w-full">
                    <span className="text-[10px] text-brand-mid font-mono tracking-wider">SOP TECHNICAL DOCUMENT ID: SOP/TECH/001/APPNDX03</span>
                    <div className="flex items-center gap-2.5">
                      <button
                        onClick={() => {
                          handleWhatsAppInquiry(activeTds.name, activeTds.brand || 'sandtex');
                          setActiveTds(null);
                        }}
                        className="bg-[#25D366] hover:bg-[#20b855] text-white text-[11.5px] font-mono font-bold py-2.5 px-5 rounded-[4px] flex items-center gap-1.5 transition-all shadow hover:shadow-md cursor-pointer justify-center"
                      >
                        <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white shrink-0" fill="currentColor">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.455 5.703 1.456h.004c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                        </svg>
                        <span>Consult on WhatsApp</span>
                      </button>
                      <button
                        onClick={() => {
                          handleSelectProductForQuote(activeTds.name, activeTds.brand || 'sandtex');
                          setActiveTds(null);
                        }}
                        className="bg-brand-charcoal hover:bg-neutral-800 text-white text-[11.5px] font-mono font-bold py-2.5 px-5 rounded-[4px] flex items-center gap-1 transition-all shadow hover:shadow-md cursor-pointer justify-center"
                      >
                        <span>📋 Close & Get Quote</span>
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {modalState.isOpen && (
            <ProductDetailModal
              isOpen={modalState.isOpen}
              onClose={() => setModalState({ isOpen: false, activeItem: null, type: 'product' })}
              type={modalState.type}
              item={modalState.activeItem}
              onSwapItem={(newItem, newType) => {
                setModalState({
                  isOpen: true,
                  activeItem: newItem,
                  type: newType
                });
              }}
            />
          )}
        </AnimatePresence>

      </div>
    </section>
  );
}
