import React from 'react';
import { LogoMark } from './LogoMark';

interface SplashLoaderProps {
  message?: string;
}

export const SplashLoader: React.FC<SplashLoaderProps> = ({ message = 'Loading charts...' }) => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#100D0A] text-[#F7F4EB] p-6 select-none font-mono">
      <div className="flex flex-col items-center gap-6 animate-pulse">
        <LogoMark size={72} theme="dark" />
        
        <div className="text-center space-y-1.5">
          <h2 className="text-3xl font-bold tracking-tight text-[#F7F4EB]">
            Chordset
          </h2>
          <p className="text-xs font-bold uppercase tracking-widest text-[#E8432E]">
            {message}
          </p>
        </div>
      </div>
    </div>
  );
};
