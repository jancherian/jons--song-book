import React from 'react';
import { LogoMark } from './LogoMark';

interface SplashLoaderProps {
  message?: string;
}

export const SplashLoader: React.FC<SplashLoaderProps> = ({ message = 'INITIALIZING CHARTS...' }) => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black text-white p-6 swiss-dots select-none">
      <div className="flex flex-col items-center gap-6 animate-pulse">
        <LogoMark size={80} />
        
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-black tracking-tight text-white uppercase font-sans">
            CHORDSET
          </h2>
          <p className="text-xs font-mono font-bold text-[#FF3000] uppercase tracking-[0.2em]">
            {message}
          </p>
        </div>
      </div>
    </div>
  );
};
