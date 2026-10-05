import React, { useState } from 'react';

interface ResilientImageProps {
  src: string;
  alt: string;
  className?: string;
  objectPosition?: string;
  fallbackTitle?: string;
  fallbackSubtitle?: string;
}

export const ResilientImage: React.FC<ResilientImageProps> = ({
  src,
  alt,
  className = '',
  objectPosition = 'center center',
  fallbackTitle = 'Maison Valrône',
  fallbackSubtitle = 'Grand Cru Cacao',
}) => {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div
        className={`relative flex flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-[#2B1B14] via-[#1C1613] to-[#3A241B] text-[#FBFBF9] p-6 text-center ${className}`}
        role="img"
        aria-label={alt}
      >
        <svg
          className="w-12 h-12 text-[#C28B53]/70 mb-3"
          viewBox="0 0 64 64"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path d="M32 8C20 14 14 26 16 40C18 50 25 56 32 58C39 56 46 50 48 40C50 26 44 14 32 8Z" />
          <path d="M32 8V58" />
          <path d="M20 24C25 26 39 26 44 24" />
          <path d="M17 34C24 37 40 37 47 34" />
          <path d="M21 45C26 47 38 47 43 45" />
        </svg>
        <span className="font-display text-lg tracking-wide text-[#F4F1EA]">
          {fallbackTitle}
        </span>
        <span className="text-xs text-[#C28B53] mt-1 font-mono-tabular">
          {fallbackSubtitle}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
      style={{ objectPosition }}
      className={className}
    />
  );
};
