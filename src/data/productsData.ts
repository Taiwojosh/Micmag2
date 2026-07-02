export interface ProductTds {
  title: string;
  description: string;
  typicalUses: string[];
  keyBenefits: string[];
  composition: {
    pigment: string;
    binder: string;
    solvent: string;
  };
  packSize: string;
  finish: string;
  volumeSolids: string;
  theoreticalCoverage: string;
  dryingInfo: {
    touchDry: string;
    hardDry: string;
    opacity: string;
  };
  applicationInfo: {
    method: string;
    coverage: string;
  };
  thinning: {
    brushRoller: string;
    spray: string;
  };
  safetyStorage: {
    storage: string;
    careline: string;
  };
}

export interface PaintProduct {
  name: string;
  desc: string;
  tag: string;
  coverage: string;
  image: string;
  fallback: string;
  tdsSpec?: ProductTds;
}

export interface FittingProduct {
  name: string;
  desc: string;
  tag: string;
  image: string;
  fallback: string;
}

export const PAINT_PRODUCTS: PaintProduct[] = [
  {
    name: 'Sandtex VME (Vinyl Matt Emulsion) 20L/4L',
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
    name: 'Sandtex Select VME 20L',
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
    name: 'Sandtex Satin 20L/4L',
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
    name: 'Sandtex Matt 20L',
    desc: 'Legendary exterior coating delivering wet & coastal protection for humid regions. Actively curbs algae and fungi growth while allowing masonry breathing ventilation. Only 1 coat required.',
    tag: 'Exterior Defense',
    coverage: '2.5-3.5 m²/L',
    image: './Sandtex MATT.png',
    fallback: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&q=80&w=800',
    tdsSpec: {
      title: 'SANDTEX MATT 20L',
      description: 'High-performance contract-grade exterior protective masonry paint. Engineered with premium lightfast pigments and biocidal agents to repel tropical mildew, mold, and coastal chalking.',
      typicalUses: [
        'Exterior wall facades, columns, concrete blockwork, sand-cement rendering',
        'High-altitude building walls subject to extreme rain and sun exposure'
      ],
      keyBenefits: [
        'High resistance to mold and algae growth',
        'Excellent breathing properties allowing substrate moisture escape',
        'Exceptional resistance to intense UV fading',
        'Tough film protecting against sea-spray and wind-blown dust'
      ],
      composition: {
        pigment: 'Rutile Titanium Dioxide & Lightfast Extenders',
        binder: 'Acrylic Copolymer',
        solvent: 'Water'
      },
      packSize: '20 Liters',
      finish: 'Flat Matt Texture',
      volumeSolids: '35-38%',
      theoreticalCoverage: '2.5-3.5 m²/L',
      dryingInfo: {
        touchDry: '30 min',
        hardDry: '3-4 hrs',
        opacity: '2 coats'
      },
      applicationInfo: {
        method: 'Stir deep. Apply by brush, exterior-grade roller, or spray machine.',
        coverage: '2.5-3.5 sq.m/L depending on substrate profile.'
      },
      thinning: {
        brushRoller: 'Stir well. Apply directly.',
        spray: 'Thin with water up to 10%'
      },
      safetyStorage: {
        storage: 'Keep container sealed in a shaded space.',
        careline: 'CAP Careline contact: 08159493070'
      }
    }
  },
  {
    name: 'Sandtex Trade Smooth 20L',
    desc: 'Highly robust, smooth, tough exterior developer paint. Delivers a long-lasting, superior-quality weather barrier favored by elite Nigerian real estate developers for its tremendous yield specs.',
    tag: 'Professional Elite',
    coverage: '14-16 m²/L',
    image: './Sandtex Trade Smooth.png',
    fallback: 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?auto=format&fit=crop&q=80&w=800',
    tdsSpec: {
      title: 'SANDTEX TRADE SMOOTH EMULSION PAINT',
      description: 'Sandtex Trade Smooth Emulsion Paint is a premium trade finish formulated to offer exceptional hiding properties, quick drying, and a durable exterior/interior shield. It leaves a highly uniform, glare-free, smooth finish.',
      typicalUses: [
        'Perfect for residential estates, public blocks, offices',
        'Applicable on cement rendering, concrete, blocks, fiber boards, and gypsum boards'
      ],
      keyBenefits: [
        'Highly Smooth Flat finish',
        'Excellent Spreading Rate & Opacity',
        'Highly economical for large projects',
        'Durable coating that resists peeling and fading',
        'Non-hazardous, non-lead pigment composition'
      ],
      composition: {
        pigment: 'Standard Titanium Dioxide & Non-Toxic Inerts',
        binder: 'Vinyl-Acrylic Co-polymer',
        solvent: 'Water'
      },
      packSize: '20L',
      finish: 'Smooth Flat Matt',
      volumeSolids: '32-36%',
      theoreticalCoverage: '14-16 m²/L',
      dryingInfo: {
        touchDry: '15-20 min',
        hardDry: '1.5 - 2 hrs',
        opacity: '2 coats'
      },
      applicationInfo: {
        method: 'Stir properly. Apply by standard long-pile roller or brush.',
        coverage: '14-16 sq.m per litre per coat under standard conditions.'
      },
      thinning: {
        brushRoller: 'Do not thin. Ready to use.',
        spray: 'Thin up to 12% with clean water'
      },
      safetyStorage: {
        storage: 'Store cool, dry, and upright. Protect from extreme heat and freezing temperatures.',
        careline: 'CAP Plc Helpline: 08159493070'
      }
    }
  },
  {
    name: 'Sandtex Finebuild 20L',
    desc: 'Ready-mixed textured base coating specifically engineered to mask fine plaster cracks and uneven rendering. Durable fungi-resistant textured coat which stabilizes masonry pores.',
    tag: 'Exterior Defense',
    coverage: '1-1.5 m²/L',
    image: './Sandtex FineBuild.png',
    fallback: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800',
    tdsSpec: {
      title: 'SANDTEX FINEBUILD TEXTURED PRIMER COAT',
      description: 'Ready-mixed textured base coating specifically engineered to mask fine plaster cracks and uneven rendering on exterior and interior masonry. Builds a durable, fungi-resistant textured coat that stabilizes masonry pores and creates a strong mechanical key for topcoats.',
      typicalUses: [
        'Exterior and interior walls with hairline cracks or uneven plaster rendering',
        'Masonry, concrete blockwork, and sand-cement renders requiring surface levelling before painting'
      ],
      keyBenefits: [
        'Effectively bridges and masks fine plaster cracks',
        'Fungi and mold-resistant formulation',
        'Stabilizes porous masonry for improved topcoat adhesion',
        'Reduces topcoat consumption by filling surface irregularities'
      ],
      composition: {
        pigment: 'Fine aggregate sand and lightfast extender pigments',
        binder: 'Acrylic copolymer emulsion',
        solvent: 'Water'
      },
      packSize: '20 Liters',
      finish: 'Coarse Textured Matt',
      volumeSolids: '55-62%',
      theoreticalCoverage: '1-1.5 m²/L',
      dryingInfo: {
        touchDry: '1-2 hrs',
        hardDry: '8-12 hrs',
        opacity: '1 coat'
      },
      applicationInfo: {
        method: 'Stir well. Apply by stiff brush, textured roller, or spray. Work into surface in circular motions to fill cracks.',
        coverage: '1-1.5 sq.m/L depending on surface texture and crack severity.'
      },
      thinning: {
        brushRoller: 'Do not thin. Apply directly.',
        spray: 'Thin up to 10% with clean water if spraying'
      },
      safetyStorage: {
        storage: 'Store cool and dry. Keep container sealed upright. Protect from frost.',
        careline: 'Chemical & Allied Products Plc Careline: 08159493070'
      }
    }
  },
  {
    name: 'Sandtex Gloss 4L',
    desc: 'Oil-based high-gloss enamel protecting wood and metal gates. Yields an ultra-reflective mirror finish, blocking rust development and timber decay on exposed surfaces.',
    tag: 'Wood & Metal Shield',
    coverage: '16-18 m²/L',
    image: './Sandtex GLOSS.png',
    fallback: 'https://images.unsplash.com/photo-1525909002-1b05e0c869d8?auto=format&fit=crop&q=80&w=800',
    tdsSpec: {
      title: 'SANDTEX HIGH-GLOSS ENAMEL',
      description: 'Super-durable premium oil-based enamel. Delivers a beautiful high-gloss mirror finish that forms an impermeable protective shield against water, rust, and insects.',
      typicalUses: [
        'Exposed metal gates, structural steel, balustrades, pipelines',
        'Hardwood trims, door frames, kitchen cabinetry facades'
      ],
      keyBenefits: [
        'Mirror-like ultra-reflective gloss retention',
        'Excellent resistance to rain, sun, oil, and grease',
        'Highly scrubbable and impact-resistant',
        'Deep anti-fungal wood preservation properties'
      ],
      composition: {
        pigment: 'Lightfast Hiding Rutile Pigments',
        binder: 'Premium Alkyd Resin Binder',
        solvent: 'White Spirit / Solvent'
      },
      packSize: '4 Liters',
      finish: 'High-Gloss Mirror',
      volumeSolids: '45-48%',
      theoreticalCoverage: '16-18 m²/L',
      dryingInfo: {
        touchDry: '4-6 hrs',
        hardDry: '16-24 hrs',
        opacity: '1-2 coats'
      },
      applicationInfo: {
        method: 'Stir well. Apply by premium natural brush or solvent-grade roller.',
        coverage: '16-18 sq.m/L under normal parameters.'
      },
      thinning: {
        brushRoller: 'Thin with white spirit up to 5% only if needed',
        spray: 'Thin up to 15% with premium white spirit'
      },
      safetyStorage: {
        storage: 'Flammable. Store away from heat, open flames, and sparks. Keep container closed.',
        careline: 'Chemical & Allied Products Plc Careline: 08159493070'
      }
    }
  }
];

export const FITTINGS_PRODUCTS: FittingProduct[] = [
  {
    name: 'Ideal Standard Sanitary Ware',
    desc: 'World-renowned European sanitary ware, ceramic basins, and premium water closets. Engineered with elegant curves, durable glossy glaze, and state-of-the-art dual-flush engineering. Available in WCs, Basins, and Bidets.',
    tag: 'European Ceramics',
    image: './micmag-sanitary-ware.jpg',
    fallback: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=800'
  },
  {
    name: 'Vado Mixers & Showers',
    desc: 'Solid brass basin mixers and rain showers with integrated aerated flow technologies. Available in elegant chrome and matte black finishes for an elite bathroom experience.',
    tag: 'Premium Brassware',
    image: './micmag-architectural-castings.jpg',
    fallback: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&q=80&w=800'
  },
  {
    name: 'Bampi Plumbing Systems',
    desc: 'High-quality European polymer internal plumbing systems featuring soundproof drainage pipes and concealed cisterns with leak-proof push-fit technology.',
    tag: 'Internal Plumbing',
    image: './micmag-sanitary-ware.jpg',
    fallback: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=800'
  },
  {
    name: 'Armani/Roca Luxury Collection',
    desc: 'Exclusive designer bathroom finishes featuring integrated wooden and marble vanities and standalone soaking tubs. Seamless integration for an uncompromising editorial finish in your living space.',
    tag: 'Designer Bathrooms',
    image: './micmag-architectural-castings.jpg',
    fallback: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&q=80&w=800'
  }
];
