import React, { useState } from 'react';

interface SmoothImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  fallbackSrc?: string;
  containerClassName?: string;
  skeletonClassName?: string;
  aspectRatio?: string;
}

export default function SmoothImage({
  src,
  alt,
  fallbackSrc,
  containerClassName = '',
  skeletonClassName = '',
  className = '',
  aspectRatio,
  ...props
}: SmoothImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(src);

  const handleError = () => {
    if (fallbackSrc && currentSrc !== fallbackSrc) {
      setCurrentSrc(fallbackSrc);
      setHasError(false);
    } else {
      setHasError(true);
      setIsLoaded(true);
    }
  };

  return (
    <div
      className={`relative overflow-hidden ${containerClassName}`}
      style={aspectRatio ? { aspectRatio } : undefined}
    >
      {/* Shimmer skeleton placeholder */}
      {!isLoaded && (
        <div
          className={`absolute inset-0 z-0 animate-pulse bg-gradient-to-r from-neutral-800/40 via-neutral-700/20 to-neutral-800/40 ${skeletonClassName}`}
          style={{
            backgroundSize: '200% 100%',
          }}
        />
      )}

      {/* Actual image with smooth fade-in and subtle zoom/unblur */}
      <img
        src={currentSrc}
        alt={alt}
        loading="lazy"
        decoding="async"
        onLoad={() => setIsLoaded(true)}
        onError={handleError}
        className={`w-full h-full transition-all duration-700 ease-out ${
          isLoaded ? 'opacity-100 scale-100 blur-0' : 'opacity-0 scale-98 blur-sm'
        } ${className}`}
        {...props}
      />

      {/* Graceful fallback state */}
      {hasError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-neutral-900/80 text-white/40 p-4 text-center">
          <svg className="w-8 h-8 mb-2 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span className="text-[10px] font-mono uppercase tracking-wider">{alt}</span>
        </div>
      )}
    </div>
  );
}
