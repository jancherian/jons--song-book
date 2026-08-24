import React from 'react';

interface LogoMarkProps {
  size?: number;
  className?: string;
  theme?: 'light' | 'dark'; // 'light' uses black C for light backgrounds; 'dark' uses white C for dark backgrounds
}

export const LogoMark: React.FC<LogoMarkProps> = ({
  size = 36,
  className = '',
  theme = 'light',
}) => {
  const imgSrc = theme === 'dark' 
    ? '/chordset-logo-transparent.png'  // White C + Red #
    : '/chordset-logo-light-bg.png';    // Black C + Red #

  return (
    <img
      src={imgSrc}
      alt="CHORDSET Logo"
      className={`inline-block shrink-0 object-contain select-none ${className}`}
      style={{ width: size, height: size }}
      loading="eager"
      title="CHORDSET"
    />
  );
};
