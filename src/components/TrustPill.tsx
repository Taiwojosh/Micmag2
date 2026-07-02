import React from 'react';

interface TrustPillProps {
  text: string;
}

export default function TrustPill({ text }: TrustPillProps) {
  return (
    <div className="inline-flex items-center gap-2 px-4 py-2 border-2 border-[#1c1917] rounded-full bg-white shadow-[2px_2px_0px_0px_#1e3a5f] font-sans text-xs sm:text-sm font-semibold text-[#1c1917]">
      <span className="h-2.5 w-2.5 rounded-full bg-[#1e3a5f] flex-shrink-0" />
      <span>{text}</span>
    </div>
  );
}
