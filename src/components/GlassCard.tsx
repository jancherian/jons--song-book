import React, { useState } from 'react';
import type { SectionTheme, ColorSwatch } from '../types/optics';
import { Flame, Compass, Sparkles, Layers, ArrowUpRight } from 'lucide-react';

interface GlassCardProps {
  theme: SectionTheme;
  title: string;
  badge: string;
  children?: React.ReactNode;
  activePalette: ColorSwatch[];
  onClickSwatch?: (hex: string) => void;
  interactiveTilt?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  theme,
  title,
  badge,
  children,
  activePalette,
  onClickSwatch,
  interactiveTilt = true,
}) => {
  const [transform, setTransform] = useState('perspective(1000px) rotateX(0deg) rotateY(0deg)');
  const [glintPos, setGlintPos] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!interactiveTilt) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -8;
    const rotateY = ((x - centerX) / centerX) * 8;

    setTransform(`perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`);
    setGlintPos({
      x: Math.round((x / rect.width) * 100),
      y: Math.round((y / rect.height) * 100),
    });
  };

  const handleMouseLeave = () => {
    setTransform('perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)');
    setIsHovered(false);
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      className="relative rounded-3xl p-7 transition-all duration-300 group overflow-hidden"
      style={{
        transform,
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.03) 100%)',
        backdropFilter: 'blur(24px) saturate(180%)',
        WebkitBackdropFilter: 'blur(24px) saturate(180%)',
        border: '1px solid rgba(255, 255, 255, 0.18)',
        boxShadow: isHovered
          ? `0 25px 50px -12px ${theme.accentColor}33, 0 0 30px ${theme.palette[1]?.hex || theme.accentColor}22, inset 0 1px 2px rgba(255, 255, 255, 0.4)`
          : '0 20px 40px -15px rgba(0, 0, 0, 0.5), inset 0 1px 1px rgba(255, 255, 255, 0.25)',
      }}
    >
      {/* Sunlight Glint Highlight Layer */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-300"
        style={{
          opacity: isHovered ? 0.9 : 0.3,
          background: `radial-gradient(circle 280px at ${glintPos.x}% ${glintPos.y}%, rgba(255, 255, 255, 0.22) 0%, ${theme.accentColor}18 45%, transparent 75%)`,
        }}
      />

      {/* Dynamic Chromatic Aberration Rim Border */}
      <div
        className="absolute inset-0 pointer-events-none rounded-3xl opacity-60 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          padding: '1.5px',
          background: `linear-gradient(${theme.sunState.angleDeg}deg, ${theme.palette[0]?.hex || '#FFF'} 0%, ${theme.palette[1]?.hex || '#FFB800'} 35%, ${theme.palette[3]?.hex || '#EC4899'} 70%, ${theme.palette[2]?.hex || '#06B6D4'} 100%)`,
          WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
        }}
      />

      {/* Top Header & Telemetry Badge */}
      <div className="flex items-center justify-between gap-4 mb-5 relative z-10">
        <div className="flex items-center gap-2.5">
          <span
            className="px-3 py-1 rounded-full text-xs font-mono font-semibold tracking-wide flex items-center gap-1.5 border"
            style={{
              backgroundColor: `${theme.accentColor}18`,
              borderColor: `${theme.accentColor}44`,
              color: theme.palette[0]?.hex || '#FFF',
            }}
          >
            <Sparkles size={13} style={{ color: theme.accentColor }} />
            {badge}
          </span>
          <span className="text-xs text-zinc-400 font-mono flex items-center gap-1">
            <Compass size={12} className="text-zinc-500" />
            IOR {theme.glassMaterial.ior}
          </span>
        </div>

        <div className="flex items-center gap-1 text-[11px] font-mono text-zinc-400 bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/10">
          <Flame size={12} className="text-amber-400" />
          <span>{theme.sunState.colorTempK}K</span>
        </div>
      </div>

      {/* Title */}
      <h3 className="text-2xl font-bold text-white mb-2 tracking-tight flex items-center gap-2 relative z-10">
        {title}
        <ArrowUpRight size={18} className="text-zinc-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300" />
      </h3>

      {/* Custom Body Content */}
      <div className="relative z-10 text-zinc-300 text-sm leading-relaxed mb-6">
        {children || <p>{theme.description}</p>}
      </div>

      {/* Live Optics Physics Bar */}
      <div className="relative z-10 grid grid-cols-2 gap-2 mb-5 p-3 rounded-2xl bg-black/35 border border-white/10 text-xs font-mono">
        <div>
          <span className="text-zinc-500 block text-[10px] uppercase tracking-wider">Incident Ray θi</span>
          <span className="text-zinc-200 font-bold">{theme.physicsDetails.snellAngleIn}°</span>
        </div>
        <div>
          <span className="text-zinc-500 block text-[10px] uppercase tracking-wider">Refracted Ray θt</span>
          <span className="text-emerald-400 font-bold">{theme.physicsDetails.snellAngleOut}°</span>
        </div>
        <div className="col-span-2 pt-1 border-t border-white/5 flex items-center justify-between text-[11px]">
          <span className="text-zinc-400">Spectrum Shift:</span>
          <span className="text-amber-300">{theme.physicsDetails.spectralShift}</span>
        </div>
      </div>

      {/* Matched Refracted Color Swatches Bar */}
      <div className="relative z-10 pt-2 border-t border-white/10">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-zinc-400 flex items-center gap-1.5">
            <Layers size={13} className="text-zinc-400" />
            Refracted Color Spectrum
          </span>
          <span className="text-[10px] font-mono text-zinc-500">Click to copy HEX</span>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {activePalette.map((swatch, idx) => (
            <button
              key={idx}
              onClick={() => onClickSwatch && onClickSwatch(swatch.hex)}
              title={`${swatch.name} (${swatch.hex}) - ${swatch.role}`}
              className="group/swatch relative flex-1 min-w-[42px] h-10 rounded-xl transition-all duration-200 hover:scale-110 hover:-translate-y-1 focus:outline-none border border-white/20 overflow-hidden flex flex-col justify-end p-1"
              style={{ backgroundColor: swatch.hex }}
            >
              <div className="w-full bg-black/60 backdrop-blur-md rounded px-1 py-0.5 text-[9px] font-mono text-white text-center opacity-0 group-hover/swatch:opacity-100 transition-opacity">
                {swatch.hex}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
