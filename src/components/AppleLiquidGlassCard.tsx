import React, { useState, useRef } from 'react';
import type { ColorSwatch, LiquidGlassConfig } from '../types/optics';
import { ArrowUpRight, Layers, Droplets } from 'lucide-react';

interface AppleLiquidGlassCardProps {
  title: string;
  subtitle: string;
  badge: string;
  children?: React.ReactNode;
  activePalette: ColorSwatch[];
  config: LiquidGlassConfig;
  onClickSwatch?: (hex: string) => void;
  staggerIndex?: number;
}

export const AppleLiquidGlassCard: React.FC<AppleLiquidGlassCardProps> = ({
  title,
  subtitle,
  badge,
  children,
  activePalette,
  config,
  onClickSwatch,
  staggerIndex = 0,
}) => {
  const [transform, setTransform] = useState('perspective(1000px) rotateX(0deg) rotateY(0deg)');
  const [isHovered, setIsHovered] = useState(false);
  const [glintPos, setGlintPos] = useState({ x: 50, y: 50 });
  const [clickedSwatchIdx, setClickedSwatchIdx] = useState<number | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -7;
    const rotateY = ((x - centerX) / centerX) * 7;

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

  const handleSwatchClick = (hex: string, idx: number) => {
    if (onClickSwatch) {
      onClickSwatch(hex);
      setClickedSwatchIdx(idx);
      setTimeout(() => setClickedSwatchIdx(null), 450);
    }
  };

  return (
    <div
      ref={cardRef}
      data-liquid-glass="true"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      className={`relative rounded-3xl p-7 transition-all duration-300 group overflow-hidden border border-white/20 shadow-2xl glass-shimmer-hover glass-press-feedback animate-fade-in-up stagger-${Math.min(staggerIndex + 1, 6)}`}
      style={{
        transform,
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0.04) 100%)',
        backdropFilter: `blur(${config.blurAmount}px) saturate(190%)`,
        WebkitBackdropFilter: `blur(${config.blurAmount}px) saturate(190%)`,
        boxShadow: isHovered
          ? '0 30px 60px -15px rgba(0, 0, 0, 0.7), inset 0 1px 2px rgba(255, 255, 255, 0.5), 0 0 40px rgba(255, 255, 255, 0.15)'
          : '0 20px 40px -15px rgba(0, 0, 0, 0.5), inset 0 1px 1px rgba(255, 255, 255, 0.3)',
        willChange: 'transform',
      }}
    >
      {/* Apple VisionOS Specular Liquid Light Sheen Layer */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-500 ease-out"
        style={{
          opacity: isHovered ? 0.95 : 0.35,
          background: `radial-gradient(circle 320px at ${glintPos.x}% ${glintPos.y}%, rgba(255, 255, 255, 0.35) 0%, rgba(255, 255, 255, 0.08) 50%, transparent 80%)`,
        }}
      />

      {/* Dynamic Chromatic Edge Dispersion Border - Animated */}
      <div
        className="absolute inset-0 pointer-events-none rounded-3xl transition-opacity duration-500 opacity-60 group-hover:opacity-100 animate-border-flow"
        style={{
          padding: '1.5px',
          background: `linear-gradient(135deg, ${activePalette[0]?.hex || '#FFF'} 0%, ${activePalette[1]?.hex || '#F59E0B'} 35%, ${activePalette[2]?.hex || '#06B6D4'} 70%, ${activePalette[3]?.hex || '#EC4899'} 100%)`,
          backgroundSize: '300% 300%',
          WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
        }}
      />

      {/* Header Badge */}
      <div className="flex items-center justify-between gap-4 mb-4 relative z-10">
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-mono font-bold tracking-wide flex items-center gap-1.5 bg-white/10 text-white border border-white/20 shadow-sm backdrop-blur-md">
            <Droplets size={13} className="text-cyan-300 animate-pulse" />
            {badge}
          </span>
        </div>

        <span className="text-[11px] font-mono text-zinc-300 bg-black/50 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/15 transition-colors duration-300 group-hover:text-amber-300 group-hover:border-amber-400/30">
          Video Light Refractor
        </span>
      </div>

      {/* Card Title & Subtitle */}
      <div className="relative z-10 mb-4">
        <h3 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
          {title}
          <ArrowUpRight size={18} className="text-zinc-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300" />
        </h3>
        <p className="text-xs font-mono text-amber-300/90 mt-1">{subtitle}</p>
      </div>

      {/* Body Content */}
      <div className="relative z-10 text-zinc-200 text-sm leading-relaxed mb-6">
        {children}
      </div>

      {/* Matched Refracted Color Palette Swatches */}
      <div className="relative z-10 pt-3 border-t border-white/15">
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-xs font-mono font-bold text-zinc-300 flex items-center gap-1.5">
            <Layers size={13} className="text-amber-400" />
            Video Light Refracted Palette
          </span>
          <span className="text-[10px] font-mono text-zinc-400">Click to copy HEX</span>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {activePalette.map((swatch, idx) => (
            <button
              key={idx}
              onClick={() => handleSwatchClick(swatch.hex, idx)}
              title={`${swatch.name} (${swatch.hex})`}
              className={`group/swatch relative flex-1 min-w-[44px] h-10 rounded-xl transition-all duration-200 hover:scale-110 hover:-translate-y-1 focus:outline-none border border-white/30 overflow-hidden flex flex-col justify-end p-1 shadow-md ${
                clickedSwatchIdx === idx ? 'animate-ping-once' : ''
              }`}
              style={{ backgroundColor: swatch.hex }}
            >
              <div className="w-full bg-black/70 backdrop-blur-md rounded px-1 py-0.5 text-[9px] font-mono text-white text-center opacity-0 group-hover/swatch:opacity-100 transition-opacity duration-200">
                {swatch.hex}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
