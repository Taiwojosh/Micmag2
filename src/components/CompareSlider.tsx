import React, { useState, useRef, useEffect } from 'react';

interface CompareSliderProps {
  beforeUrl: string;
  afterUrl: string;
  alt: string;
}

export default function CompareSlider({ beforeUrl, afterUrl, alt }: CompareSliderProps) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [containerWidth, setContainerWidth] = useState(400);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setContainerWidth(entry.contentRect.width);
      }
    });
    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = (x / rect.width) * 100;
    setSliderPosition(Math.max(0, Math.min(100, percentage)));
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.touches[0].clientX - rect.left;
    const percentage = (x / rect.width) * 100;
    setSliderPosition(Math.max(0, Math.min(100, percentage)));
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-64 overflow-hidden rounded-[4px] cursor-col-resize select-none"
      onMouseMove={handleMouseMove}
      onTouchMove={handleTouchMove}
    >
      {/* Before Image */}
      <img
        src={beforeUrl}
        alt={`Before - ${alt}`}
        className="absolute inset-0 w-full h-full object-cover"
        draggable="false"
      />
      
      {/* After Image Container (Clipped using sliderPosition) */}
      <div
        className="absolute inset-y-0 left-0 overflow-hidden"
        style={{ width: `${sliderPosition}%` }}
      >
        {/* Enforced fixed width child container matches the parent scale perfectly to avoid squeezing */}
        <div 
          className="absolute inset-y-0 left-0 h-full" 
          style={{ width: `${containerWidth}px` }}
        >
          <img
            src={afterUrl}
            alt={`After - ${alt}`}
            className="absolute inset-0 w-full h-full object-cover"
            draggable="false"
          />
        </div>
      </div>

      {/* Slider Handle */}
      <div
        className="absolute top-0 bottom-0 w-0.5 bg-white cursor-col-resize z-10"
        style={{ left: `${sliderPosition}%` }}
      >
        <div className="absolute top-1/2 -left-3 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-md">
          <div className="w-1 h-3 bg-brand-charcoal/50 rounded-full" />
        </div>
      </div>
    </div>
  );
}
