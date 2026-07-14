import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calculator, 
  Layers, 
  Sparkles, 
  TrendingUp, 
  AlertTriangle, 
  ShieldCheck, 
  BookOpen, 
  CheckCircle,
  HardHat,
  Users
} from 'lucide-react';

// Coverage and yield metrics direct from CAP Plc presentation PDF
// Configured to calculate standard material volume needs instead of volatile naira prices
const CALC_METRICS = {
  gloss: {
    name: 'Sandtex Gloss 4L',
    competitorCoverage: 9, // m²/L average
    sandtexCoverage: 17, // m²/L average
    savingPercent: 47,
    unit: 'Liters'
  },
  emulsion: {
    name: 'Sandtex VME (Vinyl Matt Emulsion) 20L/4L',
    competitorCoverage: 6.5, // m²/L average
    sandtexCoverage: 9, // m²/L average
    savingPercent: 28,
    unit: 'Liters'
  },
  satin: {
    name: 'Sandtex Satin 20L/4L',
    competitorCoverage: 8, // m²/L average
    sandtexCoverage: 13, // m²/L average
    savingPercent: 39,
    unit: 'Liters'
  }
};

const SPPUT_STEPS = [
  {
    id: 'S',
    title: 'Substrate',
    subtitle: 'Masonry Cure Check',
    desc: 'The substrate (drywall, brick, sandcrete blocks, plaster) must be fully and properly cured before applying coatings. Standard moisture and alkalinity levels must be reached to protect final colors.',
    icon: '🧱',
    colorClass: 'border-amber-400 bg-amber-50 text-amber-950'
  },
  {
    id: 'P1',
    title: 'Preparation',
    subtitle: 'Clear Imperfections & Debris',
    desc: 'The surface must be clean, dry, and free of dust, dirt, oil, and grease. Brush, scrape or sand structural surfaces (wood, steel, old plaster splashes). Fill any holes or cracks.',
    icon: '🧹',
    colorClass: 'border-orange-400 bg-orange-50 text-orange-950'
  },
  {
    id: 'P2',
    title: 'Prime',
    subtitle: 'Acrylic Base Sealant',
    desc: 'Prime the surface (e.g. using Sandtex Finebuild base primer or acrylic binder) to stabilize porous walls and masonry. This anchors the paint and binds loose dust into a stable canvas.',
    icon: '🔧',
    colorClass: 'border-orange-500 bg-orange-50 text-orange-900'
  },
  {
    id: 'U',
    title: 'Undercoat',
    subtitle: 'Uniform Base Barrier',
    desc: 'Apply undercoats to prepare for the final premium touch. Undercoating levels out imperfections, blocks moisture absorption, and establishes ultimate opacity and uniform texture.',
    icon: '🏗️',
    colorClass: 'border-orange-500 bg-orange-50 text-orange-950'
  },
  {
    id: 'T',
    title: 'Topcoat',
    subtitle: 'Final High-Shield Finish',
    desc: 'Top it up with Sandtex VME, Satin, Matt, or Gloss. This delivers superb weather resistance, active anti-fungal barrier defenses, washability, and true non-yellowing elegance.',
    icon: '✨',
    colorClass: 'border-red-500 bg-red-50 text-red-900'
  }
];

const SAFETY_TIPS = [
  {
    title: 'Think Safety First',
    desc: 'Act safely at all times. Make personal and collective safety your primary first and last priority on all active construction and painting sites.'
  },
  {
    title: 'Daily Safety Briefings',
    desc: 'Start every standard painting day with a cooperative site-wide safety briefing to review high-altitude ropes, mask usage, and tool conditions.'
  },
  {
    title: 'Wear Right Safety Gear',
    desc: 'Deploy gloves, hard hats, safety glasses, breathable masks, and secure harness straps when work conditions demand high elevation layers.'
  },
  {
    title: 'Clear Debris Daily',
    desc: 'Keep active paths clear. Clear your immediate paintwork depot of dry debris, chemical containers, and left-over solvents once the job is complete.'
  }
];

const INTEGRITY_RULES = [
  {
    title: 'Be Honest to a Fault',
    desc: 'Establish direct transparency on material yields, real coverage rates, and project costs so clients always know what they get.'
  },
  {
    title: 'Protect Your Reputation',
    desc: 'Reputation is your career currency as a paint professional. Secure client trust through clean, long-lasting premium finishes.'
  },
  {
    title: 'Never Compromise Quality',
    desc: 'Always follow manufacturer instructions (dilution, cure time, coat intervals) to achieve elite, lifetime-proof results.'
  },
  {
    title: 'Share & Train Others',
    desc: 'Commit to standard professional education. Pass on proper substrate preparation techniques to younger painters and apprentices.'
  }
];

const springTransition = {
  type: "spring",
  stiffness: 80,
  damping: 18,
  mass: 0.9
};

export default function SandtexAdvantage() {
  const [activeTab, setActiveTab] = useState<'savings' | 'spput' | 'professionals'>('savings');
  const [projectArea, setProjectArea] = useState<number>(50); // Default 50 sqm as per PDF slides!
  const [activeSpput, setActiveSpput] = useState<string>('S');

  // Multiplier results based on coverage rate
  const calculateGlossSavings = () => {
    const competitor = Number(((projectArea * 2) / CALC_METRICS.gloss.competitorCoverage).toFixed(1));
    const sandtex = Number(((projectArea * 2) / CALC_METRICS.gloss.sandtexCoverage).toFixed(1));
    const savings = Number((competitor - sandtex).toFixed(1));
    return { competitor, sandtex, savings, percent: CALC_METRICS.gloss.savingPercent };
  };

  const calculateEmulsionSavings = () => {
    const competitor = Number(((projectArea * 2) / CALC_METRICS.emulsion.competitorCoverage).toFixed(1));
    const sandtex = Number(((projectArea * 2) / CALC_METRICS.emulsion.sandtexCoverage).toFixed(1));
    const savings = Number((competitor - sandtex).toFixed(1));
    return { competitor, sandtex, savings, percent: CALC_METRICS.emulsion.savingPercent };
  };

  const calculateSatinSavings = () => {
    const competitor = Number(((projectArea * 2) / CALC_METRICS.satin.competitorCoverage).toFixed(1));
    const sandtex = Number(((projectArea * 2) / CALC_METRICS.satin.sandtexCoverage).toFixed(1));
    const savings = Number((competitor - sandtex).toFixed(1));
    return { competitor, sandtex, savings, percent: CALC_METRICS.satin.savingPercent };
  };

  const glossVal = calculateGlossSavings();
  const emulsionVal = calculateEmulsionSavings();
  const satinVal = calculateSatinSavings();

  const totalSavings = Number((glossVal.savings + emulsionVal.savings + satinVal.savings).toFixed(1));

  return (
    <section id="sandtex-advantage" className="py-24 px-5 md:px-[5%] bg-white border-b border-neutral-200 scroll-mt-20">
      <div className="max-w-7xl mx-auto">
        
        {/* Title Block */}
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
          <span className="text-micmag-red text-xs font-bold font-mono tracking-[0.25em] uppercase px-3 py-1 bg-red-50 border border-red-100/60 rounded-full inline-block">
            AUTHENTIC CAP Plc SPECIFICATIONS
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-[2.6rem] leading-[1.12] font-black text-brand-charcoal">
            The Sandtex Advantage Center
          </h2>
          <p className="text-xs sm:text-sm text-brand-mid font-light max-w-2xl mx-auto">
            Directly from Chemical & Allied Products (CAP) Plc official builder curriculum. Explore authenticated cost saving multipliers, the 5-Star S-P-P-U-T paint framework, and site protocols.
          </p>

          {/* Desktop/Mobile navigation tabs */}
          <div className="flex justify-center p-1 bg-neutral-100 rounded-[5px] border border-neutral-200 mt-8 max-w-lg mx-auto">
            <button
              onClick={() => setActiveTab('savings')}
              className={`flex-1 py-3 text-center text-[10.5px] uppercase font-mono font-bold rounded-[3px] tracking-wider transition-all duration-300 cursor-pointer ${
                activeTab === 'savings' 
                  ? 'bg-neutral-900 border border-neutral-900 text-white shadow-sm font-black' 
                  : 'text-brand-mid hover:text-brand-charcoal'
              }`}
            >
              Yield &amp; Material Efficiency
            </button>
            <button
              onClick={() => setActiveTab('spput')}
              className={`flex-1 py-3 text-center text-[10.5px] uppercase font-mono font-bold rounded-[3px] tracking-wider transition-all duration-300 cursor-pointer ${
                activeTab === 'spput' 
                  ? 'bg-micmag-red border border-micmag-red text-white shadow-sm font-black' 
                  : 'text-brand-mid hover:text-brand-charcoal'
              }`}
            >
              CAP Paint System
            </button>
            <button
              onClick={() => setActiveTab('professionals')}
              className={`flex-1 py-3 text-center text-[10.5px] uppercase font-mono font-bold rounded-[3px] tracking-wider transition-all duration-300 cursor-pointer ${
                activeTab === 'professionals' 
                  ? 'bg-amber-600 border border-amber-600 text-white shadow-sm font-black' 
                  : 'text-brand-mid hover:text-brand-charcoal'
              }`}
            >
              Professional Code
            </button>
          </div>
        </div>

        {/* Dynamic Panel Canvas */}
        <AnimatePresence mode="wait">
          {activeTab === 'savings' && (
            <motion.div
              key="savings"
              initial={{ opacity: 0, scale: 0.98, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: -15 }}
              transition={springTransition}
              className="bg-brand-cream border border-neutral-200 rounded-[8px] p-6 md:p-10 text-left grid grid-cols-1 lg:grid-cols-12 gap-8 items-start shadow-md"
            >
              
              {/* Interactive Area Sizer (left - 5 columns) */}
              <div className="lg:col-span-5 space-y-6">
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-1.5 text-xs text-brand-charcoal bg-[#FF6B00]/15 border border-[#FF6B00]/30 px-2.5 py-0.5 rounded font-mono font-bold">
                    <Calculator className="w-3.5 h-3.5" /> Interactive Yield Modeler
                  </div>
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-brand-charcoal">
                    Coverage & Yield Simulator
                  </h3>
                  <p className="text-xs text-brand-mid font-light leading-relaxed">
                    Based on official specifications from CAP Plc, Sandtex delivers superior opacity and higher spreading coverage per liter that significantly reduces required paint volumes. Adjust project parameters below to simulate material efficiency:
                  </p>
                </div>

                {/* Slider Input */}
                <div className="bg-white border border-neutral-200 p-5 rounded-[4px] space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase font-black text-brand-charcoal">
                      Estimated Project Area:
                    </span>
                    <span className="text-[14px] font-mono font-black text-brand-red bg-red-50 border border-red-100 px-2.5 py-0.5 rounded">
                      {projectArea} m²
                    </span>
                  </div>

                  <input
                    type="range"
                    min="10"
                    max="1000"
                    step="10"
                    value={projectArea}
                    onChange={(e) => setProjectArea(Number(e.target.value))}
                    className="w-full h-2 bg-neutral-100 rounded-lg appearance-none cursor-pointer accent-[#d32f2f]"
                  />

                  <div className="flex justify-between text-[9px] font-mono text-neutral-400">
                    <span>Min: 10 m² (Small Room)</span>
                    <span>Max: 1000 m² (Entire Corporate Facility)</span>
                  </div>

                  {/* Manual Input Indicator */}
                  <div className="pt-2 flex items-center gap-3">
                    <span className="text-[10px] text-brand-mid font-light">Or enter exact area size:</span>
                    <input
                      type="number"
                      min="1"
                      className="w-20 bg-neutral-50 border border-neutral-200 rounded px-2 py-1 text-xs font-bold text-brand-charcoal"
                      value={projectArea}
                      onChange={(e) => setProjectArea(Math.max(1, Number(e.target.value)))}
                    />
                  </div>
                </div>

                {/* Standard Factual Disclaimer */}
                <div className="bg-amber-50 border border-amber-200/80 p-4 rounded-[4px] text-amber-900 text-[10px] leading-relaxed font-light flex gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block">About Sandtex Yield Rates:</span>
                    All estimates assume professional application according to the CAP manual on a properly primed substrate surface. Actual yields vary with wall porosity and texture layouts.
                  </div>
                </div>

              </div>

              {/* SAVINGS RESULTS (right - 7 columns) */}
              <div className="lg:col-span-7 space-y-5">
                <span className="text-[10px] font-mono text-brand-mid font-black uppercase tracking-wider block">
                  MATERIAL COVERAGE METRICS (FOR {projectArea} SQM)
                </span>

                <div className="space-y-4">
                  
                  {/* Gloss Savings Card */}
                  <div className="bg-white border border-neutral-200 p-5 rounded-[4px] space-y-3.5 relative overflow-hidden group shadow-sm">
                    <div className="absolute top-0 right-0 h-full w-1.5 bg-micmag-red" />
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-xs font-black text-brand-charcoal uppercase tracking-wide">
                          {CALC_METRICS.gloss.name} (4L Can)
                        </h4>
                        <p className="text-[10px] text-brand-mid font-light">
                          Weather Resistant high-gloss system &bull; Yield: 16-18 m²/L
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="text-xs text-[#25D366] font-mono font-bold bg-[#25D366]/10 px-2.5 py-1 rounded inline-block">
                          47% Material Volume Shield
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3 border-t border-neutral-100 pt-3 text-center">
                      <div>
                        <span className="text-[9px] font-mono text-neutral-400 block uppercase">Competitor Volume</span>
                        <span className="text-xs text-neutral-600 font-mono font-bold">
                          {glossVal.competitor} L
                        </span>
                      </div>
                      <div>
                        <span className="text-[9px] font-mono text-neutral-400 block uppercase">Sandtex Volume</span>
                        <span className="text-xs text-brand-charcoal font-black font-mono">
                          {glossVal.sandtex} L
                        </span>
                      </div>
                      <div>
                        <span className="text-[9px] font-mono text-micmag-red block uppercase font-bold">Volume Saved</span>
                        <span className="text-xs text-micmag-red font-black font-mono">
                          {glossVal.savings} L
                        </span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                      <div className="h-full bg-brand-red rounded-full" style={{ width: '47%' }}></div>
                    </div>
                  </div>

                  {/* Emulsion Savings Card */}
                  <div className="bg-white border border-neutral-200 p-5 rounded-[4px] space-y-3.5 relative overflow-hidden group shadow-sm">
                    <div className="absolute top-0 right-0 h-full w-1.5 bg-brand-yellow" />
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-xs font-black text-brand-charcoal uppercase tracking-wide">
                          {CALC_METRICS.emulsion.name} (20L)
                        </h4>
                        <p className="text-[10px] text-brand-mid font-light">
                          High opacity interior vinyl smooth matt &bull; Yield: 8-10 m²/L
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="text-xs text-brand-charcoal font-mono font-bold bg-brand-yellow/20 px-2.5 py-1 rounded inline-block">
                          28% Material Volume Shield
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3 border-t border-neutral-100 pt-3 text-center">
                      <div>
                        <span className="text-[9px] font-mono text-neutral-400 block uppercase">Competitor Volume</span>
                        <span className="text-xs text-neutral-600 font-mono font-bold">
                          {emulsionVal.competitor} L
                        </span>
                      </div>
                      <div>
                        <span className="text-[9px] font-mono text-neutral-400 block uppercase">Sandtex Volume</span>
                        <span className="text-xs text-brand-charcoal font-black font-mono">
                          {emulsionVal.sandtex} L
                        </span>
                      </div>
                      <div>
                        <span className="text-[9px] font-mono text-micmag-red block uppercase font-bold">Volume Saved</span>
                        <span className="text-xs text-micmag-red font-black font-mono">
                          {emulsionVal.savings} L
                        </span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                      <div className="h-full bg-brand-yellow rounded-full" style={{ width: '28%' }}></div>
                    </div>
                  </div>

                  {/* Satin Savings Card */}
                  <div className="bg-white border border-neutral-200 p-5 rounded-[4px] space-y-3.5 relative overflow-hidden group shadow-sm">
                    <div className="absolute top-0 right-0 h-full w-1.5 bg-brand-yellow" />
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-xs font-black text-brand-charcoal uppercase tracking-wide">
                          {CALC_METRICS.satin.name} (20L)
                        </h4>
                        <p className="text-[10px] text-brand-mid font-light">
                          Super spreading, wipeable premium protective coat &bull; Yield: 16-18 m²/L
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="text-xs text-brand-charcoal font-mono font-bold bg-brand-yellow/20 px-2.5 py-1 rounded inline-block">
                          39% Material Volume Shield
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3 border-t border-neutral-100 pt-3 text-center">
                      <div>
                        <span className="text-[9px] font-mono text-neutral-400 block uppercase">Competitor Volume</span>
                        <span className="text-xs text-neutral-600 font-mono font-bold">
                          {satinVal.competitor} L
                        </span>
                      </div>
                      <div>
                        <span className="text-[9px] font-mono text-neutral-400 block uppercase">Sandtex Volume</span>
                        <span className="text-xs text-brand-charcoal font-black font-mono">
                          {satinVal.sandtex} L
                        </span>
                      </div>
                      <div>
                        <span className="text-[9px] font-mono text-micmag-red block uppercase font-bold">Volume Saved</span>
                        <span className="text-xs text-micmag-red font-black font-mono">
                          {satinVal.savings} L
                        </span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                      <div className="h-full bg-brand-yellow rounded-full" style={{ width: '39%' }}></div>
                    </div>
                  </div>

                </div>

                {/* Total Combined savings display */}
                <div className="bg-neutral-900 text-[#f4efe5] p-5 rounded-[4px] border border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4 mt-4">
                  <div className="text-center sm:text-left space-y-0.5">
                    <h5 className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider">
                      Aggregate Material Volume Savings
                    </h5>
                    <p className="text-[11px] text-neutral-300 font-light">
                      Based on standard coverage specifications for a {projectArea} sqm building project (assuming 2 coats).
                    </p>
                  </div>
                  <div className="text-center sm:text-right">
                    <span className="text-[11px] font-mono font-bold text-micmag-red block uppercase">
                      Total Paint Volume Saved
                    </span>
                    <span className="text-xl sm:text-2xl font-mono font-black text-white">
                      {totalSavings} Liters
                    </span>
                  </div>
                </div>

              </div>

            </motion.div>
          )}

          {activeTab === 'spput' && (
            <motion.div
              key="spput"
              initial={{ opacity: 0, scale: 0.98, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: -15 }}
              transition={springTransition}
              className="bg-brand-cream border border-neutral-200 rounded-[8px] p-6 md:p-10 text-left grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch shadow-md"
            >
              
              {/* Stepper selection (left - 5 col) */}
              <div className="lg:col-span-5 flex flex-col justify-between space-y-6 border-r border-neutral-200/50 pr-0 lg:pr-8">
                <div className="space-y-2">
                  <span className="text-micmag-red text-[10px] font-mono font-bold uppercase tracking-wider bg-red-50 border border-red-100 px-2.5 py-0.5 rounded inline-block">
                    ★ ★ ★ ★ ★ Official CAP Paint System
                  </span>
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-brand-charcoal">
                    The 5-Star S-P-P-U-T System
                  </h3>
                  <p className="text-xs text-brand-mid font-light leading-relaxed">
                    Chemical & Allied Products Plc recommends the standard 5-Star Paint System. Correctly executing each layer ensures that your Sandtex finishes achieve unmatched durability and pristine visual beauty. Click any step below to explore:
                  </p>
                </div>

                {/* Vertical Step Buttons */}
                <div className="space-y-2 pt-2">
                  {SPPUT_STEPS.map((step, idx) => {
                    const isActive = activeSpput === step.id;
                    return (
                      <button
                        key={idx}
                        onClick={() => setActiveSpput(step.id)}
                        className={`w-full text-left p-3 rounded transition-all duration-300 flex items-center gap-4 border cursor-pointer ${
                          isActive 
                            ? 'bg-white border-neutral-900 ring-2 ring-neutral-900/5 shadow-sm' 
                            : 'bg-transparent border-neutral-200 hover:bg-neutral-50 hover:border-neutral-300'
                        }`}
                      >
                        <span className="w-8 h-8 rounded-full bg-brand-charcoal text-white text-xs font-mono font-black flex items-center justify-center">
                          {step.id}
                        </span>
                        <div>
                          <span className="text-xs font-black text-brand-charcoal block leading-none">
                            Step {idx + 1}: {step.title}
                          </span>
                          <span className="text-[10px] text-brand-mid font-light leading-none">
                            {step.subtitle}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Active Step Details (right - 7 col) */}
              <div className="lg:col-span-7 flex flex-col justify-between bg-white border border-neutral-200 p-6 md:p-8 rounded-[6px] shadow-sm relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-[3.5px] bg-micmag-red" />
                
                {(() => {
                  const currentObj = SPPUT_STEPS.find(s => s.id === activeSpput) || SPPUT_STEPS[0];
                  return (
                    <div className="space-y-6">
                      <div className="flex items-center gap-4">
                        <span className="bg-neutral-50 border border-neutral-200 p-3.5 rounded-[4px] flex items-center justify-center text-micmag-red">
                          {currentObj.id === 'S' && <Layers className="w-8 h-8 text-amber-600" />}
                          {currentObj.id === 'P1' && <Layers className="w-8 h-8 text-orange-500" />}
                          {currentObj.id === 'P2' && <Layers className="w-8 h-8 text-yellow-600" />}
                          {currentObj.id === 'U' && <Layers className="w-8 h-8 text-blue-600" />}
                          {currentObj.id === 'T' && <Sparkles className="w-8 h-8 text-micmag-red" />}
                        </span>
                        <div>
                          <span className="text-[10px] font-mono font-bold text-micmag-red tracking-widest block uppercase">
                            ACTIVE PHASE DETAILS ({currentObj.id})
                          </span>
                          <h4 className="font-serif text-xl font-bold text-brand-charcoal leading-tight">
                            {currentObj.title} &mdash; {currentObj.subtitle}
                          </h4>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <p className="text-xs sm:text-sm text-brand-mid font-light leading-relaxed">
                          {currentObj.desc}
                        </p>
                      </div>

                      {/* Technical checklist details */}
                      <div className="bg-neutral-50 p-4 rounded-[4px] border border-neutral-200 space-y-3">
                        <span className="text-[9px] font-mono text-neutral-400 font-bold uppercase tracking-wider block">
                          Technical Site Protocols
                        </span>
                        
                        <ul className="text-xs text-brand-mid space-y-1.5 font-light">
                          {currentObj.id === 'S' && (
                            <>
                              <li className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-micmag-red rounded-full" />
                                Plaster should dry for dynamic periods (minimum 28 days for sandcrete cement).
                              </li>
                              <li className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-micmag-red rounded-full" />
                                Verify substrate moisture level using electronic hydrometers before painting.
                              </li>
                            </>
                          )}
                          {currentObj.id === 'P1' && (
                            <>
                              <li className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-micmag-red rounded-full" />
                                Completely clean away masonry dust, algae growth, grease, and mortar splashes.
                              </li>
                              <li className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-micmag-red rounded-full" />
                                Fill masonry hairline cracks with high-elastic weather-proof fillers.
                              </li>
                            </>
                          )}
                          {currentObj.id === 'P2' && (
                            <>
                              <li className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-micmag-red rounded-full" />
                                Sandtex Finebuild Base Primer binds loose wall particles into cohesive surface matrices.
                              </li>
                              <li className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-micmag-red rounded-full" />
                                Prevents aggressive alkaline burn which decomposes paint binders and alters color tone.
                              </li>
                            </>
                          )}
                          {currentObj.id === 'U' && (
                            <>
                              <li className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-micmag-red rounded-full" />
                                Solid base coat application providing uniform color absorption for final layer.
                              </li>
                              <li className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-micmag-red rounded-full" />
                                Masks structural brick/block profiles and seals surface pores completely.
                              </li>
                            </>
                          )}
                          {currentObj.id === 'T' && (
                            <>
                              <li className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-micmag-red rounded-full" />
                                Top it up with original Sandtex Satin, Matt Emulsion, or Gloss.
                              </li>
                              <li className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-micmag-red rounded-full" />
                                Offers deep climate immunity against heavy coastal precipitation and intense Nigeria sun.
                              </li>
                            </>
                          )}
                        </ul>
                      </div>

                    </div>
                  );
                })()}

                <div className="pt-4 border-t border-neutral-100 flex items-center justify-between text-[10px] font-mono text-brand-mid">
                  <span>CAP Paint System Guidelines &bull; 2020 Edition</span>
                  <span className="font-bold text-micmag-red">5-star Standard Recommended</span>
                </div>
              </div>

            </motion.div>
          )}

          {activeTab === 'professionals' && (
            <motion.div
              key="professionals"
              initial={{ opacity: 0, scale: 0.98, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: -15 }}
              transition={springTransition}
              className="bg-brand-cream border border-neutral-200 rounded-[8px] p-6 md:p-10 text-left grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch shadow-md"
            >
              
              {/* Safety Tips Column */}
              <div className="bg-white border border-neutral-200 p-6 md:p-8 rounded-[6px] shadow-sm flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="p-2 bg-amber-50 border border-amber-200 rounded text-amber-600">
                      <HardHat className="w-5 h-5" />
                    </span>
                    <div>
                      <span className="text-[10px] font-mono text-brand-mid font-bold block uppercase tracking-wider">
                        SITE PROTOCOLS
                      </span>
                      <h4 className="font-serif text-lg font-black text-brand-charcoal">
                        Safety is the Smart Choice
                      </h4>
                    </div>
                  </div>

                  <p className="text-xs text-brand-mid font-light leading-relaxed">
                    Always protect yourself, your coating team, and your clients by implementing elite material safety standards:
                  </p>

                  <div className="space-y-3">
                    {SAFETY_TIPS.map((tip, idx) => (
                      <div key={idx} className="flex gap-2.5 items-start">
                        <CheckCircle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <span className="text-xs font-bold text-brand-charcoal block leading-tight">
                            {tip.title}
                          </span>
                          <span className="text-[11px] text-brand-mid font-light">
                            {tip.desc}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-neutral-100 text-[9px] font-mono text-neutral-400">
                  REF: CAP PLC SITE SAFETY MANUAL &bull; EXPORT EDITION
                </div>
              </div>

              {/* Integrity Rules Column */}
              <div className="bg-white border border-neutral-200 p-6 md:p-8 rounded-[6px] shadow-sm flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="p-2 bg-amber-50 border border-amber-200 rounded text-amber-600">
                      <Users className="w-5 h-5" />
                    </span>
                    <div>
                      <span className="text-[10px] font-mono text-brand-mid font-bold block uppercase tracking-wider">
                        PROFESSIONAL CODE
                      </span>
                      <h4 className="font-serif text-lg font-black text-brand-charcoal">
                        Integrity is the Smart Choice
                      </h4>
                    </div>
                  </div>

                  <p className="text-xs text-brand-mid font-light leading-relaxed">
                    The most successful painters, builders, and corporate developers in Nigeria always cement their legacy with integrity:
                  </p>

                  <div className="space-y-3">
                    {INTEGRITY_RULES.map((rule, idx) => (
                      <div key={idx} className="flex gap-2.5 items-start">
                        <CheckCircle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <span className="text-xs font-bold text-brand-charcoal block leading-tight">
                            {rule.title}
                          </span>
                          <span className="text-[11px] text-brand-mid font-light">
                            {rule.desc}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-neutral-100 text-[9px] font-mono text-neutral-400">
                  REF: BUILDER COMMITMENT CODE &bull; CAP PLC
                </div>
              </div>

            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
}
