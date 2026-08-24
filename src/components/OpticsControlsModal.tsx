import React from 'react';
import type { SunState, GlassMaterial } from '../types/optics';
import { Sliders, Sun, Shield, RotateCcw, X } from 'lucide-react';

interface OpticsControlsModalProps {
  isOpen: boolean;
  onClose: () => void;
  sunState: SunState;
  onUpdateSunState: (newState: Partial<SunState>) => void;
  glassMaterial: GlassMaterial;
  onUpdateGlassMaterial: (newMaterial: Partial<GlassMaterial>) => void;
  onReset: () => void;
}

const MATERIAL_PRESETS: GlassMaterial[] = [
  { name: 'Honey Quartz Glass', ior: 1.544, dispersion: 0.015, roughness: 0.04, tintHex: '#FFF5EB' },
  { name: 'Optical Crown Crystal', ior: 1.62, dispersion: 0.038, roughness: 0.01, tintHex: '#FFFFFF' },
  { name: 'Flint Fluorite Glass', ior: 1.492, dispersion: 0.022, roughness: 0.06, tintHex: '#F0FDF4' },
  { name: 'Synthesized Diamond Gem', ior: 2.417, dispersion: 0.065, roughness: 0.02, tintHex: '#FDF2F8' },
  { name: 'Sapphire Crystal Slab', ior: 1.77, dispersion: 0.042, roughness: 0.01, tintHex: '#EFF6FF' },
];

export const OpticsControlsModal: React.FC<OpticsControlsModalProps> = ({
  isOpen,
  onClose,
  sunState,
  onUpdateSunState,
  glassMaterial,
  onUpdateGlassMaterial,
  onReset,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-lg animate-fade-in">
      <div className="w-full max-w-2xl rounded-3xl p-7 bg-zinc-950 border border-white/20 shadow-2xl text-white relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-zinc-400 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
        >
          <X size={20} />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
            <Sliders size={22} />
          </div>
          <div>
            <h3 className="text-2xl font-bold tracking-tight">Solar & Glass Refraction Studio</h3>
            <p className="text-xs text-zinc-400 font-mono">Fine-tune physical optical constants & light dispersion equations</p>
          </div>
        </div>

        {/* Material Presets Selector */}
        <div className="mb-6">
          <label className="text-xs font-mono text-zinc-400 uppercase tracking-wider block mb-2 flex items-center gap-1.5">
            <Shield size={13} className="text-cyan-400" />
            Glass Material Presets
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {MATERIAL_PRESETS.map((preset) => {
              const isSelected = glassMaterial.name === preset.name;
              return (
                <button
                  key={preset.name}
                  onClick={() => onUpdateGlassMaterial(preset)}
                  className={`p-3 rounded-xl border text-left transition-all text-xs font-mono ${
                    isSelected
                      ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200 font-bold shadow-lg shadow-cyan-500/10'
                      : 'bg-white/5 border-white/10 text-zinc-400 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <div className="font-bold text-white truncate">{preset.name}</div>
                  <div className="text-[10px] text-zinc-400 mt-1">IOR {preset.ior} • Δn {(preset.dispersion * 100).toFixed(1)}%</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Sunlight Controls */}
        <div className="space-y-4 mb-6">
          <h4 className="text-xs font-mono text-amber-400 uppercase tracking-wider flex items-center gap-1.5 border-b border-white/10 pb-2">
            <Sun size={14} />
            Sunlight Source Parameters
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
            {/* Solar Kelvin Temperature */}
            <div className="p-3 rounded-xl bg-white/5 border border-white/10">
              <div className="flex justify-between mb-1.5">
                <span className="text-zinc-400">Color Temp (K)</span>
                <span className="text-amber-300 font-bold">{sunState.colorTempK}K</span>
              </div>
              <input
                type="range"
                min={2000}
                max={10000}
                step={100}
                value={sunState.colorTempK}
                onChange={(e) => onUpdateSunState({ colorTempK: Number(e.target.value) })}
                className="w-full accent-amber-400 h-1.5 bg-zinc-800 rounded-lg cursor-pointer"
              />
            </div>

            {/* Sun Elevation Angle */}
            <div className="p-3 rounded-xl bg-white/5 border border-white/10">
              <div className="flex justify-between mb-1.5">
                <span className="text-zinc-400">Elevation Angle (°)</span>
                <span className="text-amber-300 font-bold">{sunState.elevationDeg}°</span>
              </div>
              <input
                type="range"
                min={5}
                max={90}
                value={sunState.elevationDeg}
                onChange={(e) => onUpdateSunState({ elevationDeg: Number(e.target.value) })}
                className="w-full accent-amber-400 h-1.5 bg-zinc-800 rounded-lg cursor-pointer"
              />
            </div>

            {/* Sunlight Intensity */}
            <div className="p-3 rounded-xl bg-white/5 border border-white/10">
              <div className="flex justify-between mb-1.5">
                <span className="text-zinc-400">Solar Intensity</span>
                <span className="text-cyan-300 font-bold">{(sunState.intensity * 100).toFixed(0)}%</span>
              </div>
              <input
                type="range"
                min={0.3}
                max={2.0}
                step={0.05}
                value={sunState.intensity}
                onChange={(e) => onUpdateSunState({ intensity: Number(e.target.value) })}
                className="w-full accent-cyan-400 h-1.5 bg-zinc-800 rounded-lg cursor-pointer"
              />
            </div>

            {/* Volumetric Ray Count */}
            <div className="p-3 rounded-xl bg-white/5 border border-white/10">
              <div className="flex justify-between mb-1.5">
                <span className="text-zinc-400">Volumetric Ray Shafts</span>
                <span className="text-cyan-300 font-bold">{sunState.rayCount} rays</span>
              </div>
              <input
                type="range"
                min={10}
                max={60}
                value={sunState.rayCount}
                onChange={(e) => onUpdateSunState({ rayCount: Number(e.target.value) })}
                className="w-full accent-cyan-400 h-1.5 bg-zinc-800 rounded-lg cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex justify-between items-center pt-4 border-t border-white/10">
          <button
            onClick={onReset}
            className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white font-mono text-xs flex items-center gap-2 border border-white/10"
          >
            <RotateCcw size={14} />
            Reset to Section Defaults
          </button>
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-zinc-950 font-bold font-mono text-xs shadow-lg shadow-amber-500/20"
          >
            Apply & Close
          </button>
        </div>
      </div>
    </div>
  );
};
