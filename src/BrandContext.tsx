import React, { createContext, useContext, useState, useEffect } from 'react';

export type BrandType = 'micmag' | 'sandtex';

interface BrandContextType {
  activeBrand: BrandType;
  setActiveBrand: (brand: BrandType) => void;
  brandTheme: {
    primaryColor: string;
    primaryDeep: string;
    brandLabel: string;
    tagline: string;
  };
}

const BrandContext = createContext<BrandContextType | undefined>(undefined);

export function BrandProvider({ children }: { children: React.ReactNode }) {
  const [activeBrand, setActiveBrandState] = useState<BrandType>(() => {
    const saved = localStorage.getItem('active_brand_preference');
    return (saved === 'sandtex' || saved === 'micmag') ? saved : 'micmag';
  });

  const setActiveBrand = (brand: BrandType) => {
    setActiveBrandState(brand);
    localStorage.setItem('active_brand_preference', brand);
  };

  const brandTheme = {
    primaryColor: activeBrand === 'sandtex' ? '#FF6B00' : '#b45309', // Sandtex Orange vs Micmag Amber
    primaryDeep: activeBrand === 'sandtex' ? '#E65100' : '#78350f',
    brandLabel: activeBrand === 'sandtex' ? 'Sandtex Premium' : 'Micmag Homes & Fittings',
    tagline: activeBrand === 'sandtex' 
      ? 'Climate-Engineered Paint & Finishes' 
      : 'Premium Decorative & Specialty Coatings',
  };

  // Sync to visual body attributes if ever needed
  useEffect(() => {
    document.body.setAttribute('data-brand', activeBrand);
  }, [activeBrand]);

  return (
    <BrandContext.Provider value={{ activeBrand, setActiveBrand, brandTheme }}>
      {children}
    </BrandContext.Provider>
  );
}

export function useBrand() {
  const context = useContext(BrandContext);
  if (context === undefined) {
    throw new Error('useBrand must be used within a BrandProvider');
  }
  return context;
}
