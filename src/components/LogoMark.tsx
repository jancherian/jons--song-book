import React from 'react';

interface LogoMarkProps {
  size?: number;
  className?: string;
  variant?: 'solid-black' | 'transparent';
}

export const LogoMark: React.FC<LogoMarkProps> = ({
  size = 36,
  className = '',
  variant = 'solid-black'
}) => {
  const imgSrc = variant === 'transparent' ? '/logo-transparent.png' : '/logo.png';

  return (
    <div 
      className={`inline-flex items-center justify-center shrink-0 border border-black select-none overflow-hidden ${className}`}
      style={{ width: size, height: size }}
      title="CHORDSET"
    >
      <img
        src={imgSrc}
        alt="CHORDSET Logo"
        className="w-full h-full object-contain"
        loading="eager"
      />
    </div>
  );
};
