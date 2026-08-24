import React from 'react';
import type { SectionTheme } from '../types/optics';
import { Sun, Compass, Sliders } from 'lucide-react';

interface NavbarProps {
  sections: SectionTheme[];
  activeSectionIndex: number;
  onSelectSection: (index: number) => void;
  onOpenControls: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  sections,
  activeSectionIndex,
  onSelectSection,
  onOpenControls,
}) => {
  const currentTheme = sections[activeSectionIndex];

  return (
    <header className="fixed top-4 left-1/2 -translate-x-1/2 z-40 w-[min(94%,1180px)] transition-all duration-300">
      <div className="rounded-2xl px-4 py-3 bg-zinc-950/75 backdrop-blur-2xl border border-white/15 shadow-2xl flex items-center justify-between gap-4">
        
        {/* Brand Logo */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 via-orange-500 to-purple-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
            <Sun size={18} className="text-zinc-950 font-extrabold" />
          </div>
          <div>
            <span className="font-extrabold text-sm text-white tracking-wider uppercase block">
              Solaris Prism
            </span>
            <span className="text-[10px] font-mono text-amber-400/90 block">
              Glass Refraction Engine
            </span>
          </div>
        </div>

        {/* Section Navigation Tabs */}
        <nav className="hidden lg:flex items-center gap-1 p-1 rounded-xl bg-white/5 border border-white/10">
          {sections.map((section, idx) => {
            const isActive = activeSectionIndex === idx;
            return (
              <button
                key={section.id}
                onClick={() => onSelectSection(idx)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-mono transition-all duration-300 flex items-center gap-2 ${
                  isActive
                    ? 'bg-gradient-to-r from-amber-500/90 to-orange-500/90 text-zinc-950 font-bold shadow-md shadow-amber-500/20'
                    : 'text-zinc-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <span>{section.title}</span>
              </button>
            );
          })}
        </nav>

        {/* Action Controls & Telemetry */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs font-mono text-zinc-300">
            <Compass size={14} className="text-cyan-400 animate-spin-slow" />
            <span>θ {currentTheme.sunState.angleDeg}°</span>
          </div>

          <button
            onClick={onOpenControls}
            className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-mono text-xs flex items-center gap-2 border border-white/15 transition-all duration-200 shadow-md"
          >
            <Sliders size={14} className="text-amber-400" />
            <span className="hidden sm:inline">Optics Control</span>
          </button>
        </div>
      </div>
    </header>
  );
};
