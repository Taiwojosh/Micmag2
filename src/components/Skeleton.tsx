import React from 'react';

interface SkeletonProps {
  className?: string;
}

export default function Skeleton({ className }: SkeletonProps) {
  return (
    <div className={`animate-pulse bg-neutral-200 rounded ${className}`} />
  );
}
