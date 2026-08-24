import React from 'react';
import type { LiquidGlassConfig } from '../types/optics';
import { Droplets, X, RotateCcw } from 'lucide-react';

interface LiquidOpticsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  config: LiquidGlassConfig;
  onUpdateConfig: (newConfig: Partial<LiquidGlassConfig>) => void;
  onReset: () => void;
}

export const LiquidOpticsPanel: React.FC<LiquidOpticsPanelProps> = ({
  isOpen,
  onClose,
  config,
  onUpdateConfig,
  onReset,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-backdrop-fade-in">
      <div className="w-full max-w-xl rounded-3xl p-7 bg-zinc-950 border border-white/20 shadow-2xl text-white relative animate-scale-in">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-zinc-400 hover:text-white p-2 rounded-full hover:bg-white/10 transition-all duration-200 hover:rotate-90"
        >
          <X size={20} />
        </button>

        {/* Panel Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-2xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 animate-glow-pulse">
            <Droplets size={22} />
          </div>
          <div>
            <h3 className="text-2xl font-bold tracking-tight">Apple Liquid Glass Refraction Studio</h3>
            <p className="text-xs text-zinc-400 font-mono">Fine-tune video light refraction, chromatic dispersion, and liquid ripple physics</p>
          </div>
        </div>

        {/* Sliders Grid */}
        <div className="space-y-4 mb-6 font-mono text-xs">
          {/* Refraction Lens Curvature */}
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2 transition-all duration-200 hover:bg-white/8 hover:border-cyan-400/20">
            <div className="flex justify-between">
              <span className="text-zinc-300">Video Refraction Power</span>
              <span className="text-cyan-400 font-bold tabular-nums transition-colors duration-300">{(config.refractionStrength * 100).toFixed(0)}%</span>
            </div>
            <input
              type="range"
              min={0.1}
              max={1.0}
              step={0.05}
              value={config.refractionStrength}
              onChange={(e) => onUpdateConfig({ refractionStrength: Number(e.target.value) })}
              className="w-full accent-cyan-400 h-1.5 bg-zinc-800 rounded-lg cursor-pointer"
            />
          </div>

          {/* Chromatic Edge Dispersion */}
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2 transition-all duration-200 hover:bg-white/8 hover:border-amber-400/20">
            <div className="flex justify-between">
              <span className="text-zinc-300">Chromatic Edge Dispersion (RGB Split)</span>
              <span className="text-amber-400 font-bold tabular-nums transition-colors duration-300">{(config.dispersionStrength * 100).toFixed(0)}%</span>
            </div>
            <input
              type="range"
              min={0.0}
              max={1.0}
              step={0.05}
              value={config.dispersionStrength}
              onChange={(e) => onUpdateConfig({ dispersionStrength: Number(e.target.value) })}
              className="w-full accent-amber-400 h-1.5 bg-zinc-800 rounded-lg cursor-pointer"
            />
          </div>

          {/* Liquid Ripple Viscosity */}
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2 transition-all duration-200 hover:bg-white/8 hover:border-purple-400/20">
            <div className="flex justify-between">
              <span className="text-zinc-300">Liquid Ripple Viscosity</span>
              <span className="text-purple-400 font-bold tabular-nums transition-colors duration-300">{(config.liquidViscosity * 100).toFixed(0)}%</span>
            </div>
            <input
              type="range"
              min={0.1}
              max={1.0}
              step={0.05}
              value={config.liquidViscosity}
              onChange={(e) => onUpdateConfig({ liquidViscosity: Number(e.target.value) })}
              className="w-full accent-purple-400 h-1.5 bg-zinc-800 rounded-lg cursor-pointer"
            />
          </div>

          {/* Backdrop Blur Amount */}
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2 transition-all duration-200 hover:bg-white/8 hover:border-emerald-400/20">
            <div className="flex justify-between">
              <span className="text-zinc-300">Backdrop Frosting Blur</span>
              <span className="text-emerald-400 font-bold tabular-nums transition-colors duration-300">{config.blurAmount}px</span>
            </div>
            <input
              type="range"
              min={0}
              max={40}
              value={config.blurAmount}
              onChange={(e) => onUpdateConfig({ blurAmount: Number(e.target.value) })}
              className="w-full accent-emerald-400 h-1.5 bg-zinc-800 rounded-lg cursor-pointer"
            />
          </div>

          {/* Apple VisionOS Specular Sheen */}
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2 transition-all duration-200 hover:bg-white/8 hover:border-cyan-300/20">
            <div className="flex justify-between">
              <span className="text-zinc-300">Specular Sheen Intensity</span>
              <span className="text-cyan-300 font-bold tabular-nums transition-colors duration-300">{(config.specularIntensity * 100).toFixed(0)}%</span>
            </div>
            <input
              type="range"
              min={0.1}
              max={1.0}
              step={0.05}
              value={config.specularIntensity}
              onChange={(e) => onUpdateConfig({ specularIntensity: Number(e.target.value) })}
              className="w-full accent-cyan-300 h-1.5 bg-zinc-800 rounded-lg cursor-pointer"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center pt-4 border-t border-white/10 font-mono text-xs">
          <button
            onClick={onReset}
            className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white flex items-center gap-2 border border-white/10 transition-all duration-200"
          >
            <RotateCcw size={14} className="transition-transform duration-300 hover:rotate-[-180deg]" />
            Reset Defaults
          </button>
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-zinc-950 font-bold shadow-lg shadow-cyan-500/20 transition-all duration-200 hover:shadow-xl hover:shadow-cyan-500/30 hover:scale-105 active:scale-95"
          >
            Apply & Close
          </button>
        </div>
      </div>
    </div>
  );
};
