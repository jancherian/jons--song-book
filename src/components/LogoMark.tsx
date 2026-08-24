import React from 'react';

interface LogoMarkProps {
  size?: number;
  className?: string;
}

export const LogoMark: React.FC<LogoMarkProps> = ({
  size = 36,
  className = '',
}) => {
  return (
    <img
      src="/chordset-logo-transparent.png"
      alt="CHORDSET Logo"
      className={`inline-block shrink-0 object-contain select-none ${className}`}
      style={{ width: size, height: size }}
      loading="eager"
      title="CHORDSET"
    />
  );
};
