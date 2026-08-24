import React, { useState } from 'react';
import type { SectionTheme } from '../types/optics';
import { PrismViewer } from './PrismViewer';
import { Sparkles, Sliders, Copy, Check, Palette, Lightbulb, Compass } from 'lucide-react';

interface InteractiveRefractionLabProps {
  theme: SectionTheme;
  onCopyHex: (hex: string) => void;
}

export const InteractiveRefractionLab: React.FC<InteractiveRefractionLabProps> = ({
  theme,
  onCopyHex,
}) => {
  const [activeTab, setActiveTab] = useState<'bench' | 'generator' | 'theory'>('bench');
  const [copiedFormat, setCopiedFormat] = useState<string | null>(null);

  const getFormatCode = (format: 'css' | 'tailwind' | 'json') => {
    if (format === 'json') {
      return JSON.stringify(theme.palette, null, 2);
    }
    if (format === 'tailwind') {
      const obj: Record<string, string> = {};
      theme.palette.forEach((s, i) => {
        obj[`sun-refract-${i + 1}`] = s.hex;
      });
      return `colors: ${JSON.stringify(obj, null, 2)}`;
    }
    return theme.palette.map((s, i) => `--refracted-sun-${i + 1}: ${s.hex};`).join('\n');
  };

  const handleCopyFormat = (format: 'css' | 'tailwind' | 'json') => {
    const code = getFormatCode(format);
    navigator.clipboard.writeText(code);
    setCopiedFormat(format);
    setTimeout(() => setCopiedFormat(null), 2500);
  };

  return (
    <div className="space-y-8">
      {/* Studio Header Card */}
      <div className="rounded-3xl p-8 bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 border border-white/15 backdrop-blur-2xl shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full filter blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <span className="px-3.5 py-1 rounded-full text-xs font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 inline-flex items-center gap-1.5 mb-3">
              <Sparkles size={14} />
              Interactive Solar Optics Studio
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Refraction & Spectral Palette Workbench
            </h2>
            <p className="text-zinc-400 text-sm mt-2 max-w-2xl leading-relaxed">
              Experiment with Snell-Descartes physical light dispersion, observe chromatic spectrum splitting through optical glass, and export harmonized color palettes tailored to ambient daylight.
            </p>
          </div>

          <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-black/60 border border-white/10 shrink-0 font-mono text-xs">
            <button
              onClick={() => setActiveTab('bench')}
              className={`px-4 py-2 rounded-xl transition-all ${
                activeTab === 'bench' ? 'bg-amber-500 text-zinc-950 font-bold shadow-md' : 'text-zinc-400 hover:text-white'
              }`}
            >
              Ray Bench
            </button>
            <button
              onClick={() => setActiveTab('generator')}
              className={`px-4 py-2 rounded-xl transition-all ${
                activeTab === 'generator' ? 'bg-amber-500 text-zinc-950 font-bold shadow-md' : 'text-zinc-400 hover:text-white'
              }`}
            >
              Palette Generator
            </button>
            <button
              onClick={() => setActiveTab('theory')}
              className={`px-4 py-2 rounded-xl transition-all ${
                activeTab === 'theory' ? 'bg-amber-500 text-zinc-950 font-bold shadow-md' : 'text-zinc-400 hover:text-white'
              }`}
            >
              Optics Equations
            </button>
          </div>
        </div>
      </div>

      {/* Main Tab Content */}
      {activeTab === 'bench' && <PrismViewer theme={theme} />}

      {activeTab === 'generator' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Palette Cards Grid */}
          <div className="lg:col-span-2 rounded-3xl p-6 bg-zinc-950/80 border border-white/10 backdrop-blur-xl">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Palette size={20} className="text-amber-400" />
              Extracted Refracted Wavelength Spectrum
            </h3>
            <div className="space-y-3">
              {theme.palette.map((swatch, idx) => (
                <div
                  key={idx}
                  onClick={() => onCopyHex(swatch.hex)}
                  className="group p-4 rounded-2xl border border-white/10 transition-all duration-300 hover:scale-[1.01] hover:border-amber-400/50 cursor-pointer flex items-center justify-between gap-4"
                  style={{ backgroundColor: 'rgba(255, 255, 255, 0.03)' }}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className="w-12 h-12 rounded-xl border border-white/20 shadow-lg shrink-0 transition-transform group-hover:scale-110"
                      style={{ backgroundColor: swatch.hex }}
                    />
                    <div>
                      <h4 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
                        {swatch.name}
                      </h4>
                      <div className="flex items-center gap-3 text-xs font-mono text-zinc-400 mt-0.5">
                        <span>{swatch.hex}</span>
                        <span>•</span>
                        <span>{swatch.wavelengthNm}nm</span>
                        <span>•</span>
                        <span className="text-zinc-500">{swatch.role}</span>
                      </div>
                    </div>
                  </div>

                  <button className="px-3 py-1.5 rounded-lg bg-white/10 group-hover:bg-amber-500 group-hover:text-zinc-950 text-zinc-300 text-xs font-mono font-bold flex items-center gap-1.5 transition-all">
                    <Copy size={13} />
                    Copy
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Export Code Formats */}
          <div className="rounded-3xl p-6 bg-zinc-950/80 border border-white/10 backdrop-blur-xl space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Sliders size={18} className="text-cyan-400" />
              Export Palette Code
            </h3>

            {(['css', 'tailwind', 'json'] as const).map((fmt) => (
              <div key={fmt} className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-amber-300 uppercase">
                    {fmt === 'css' ? 'CSS Custom Props' : fmt === 'tailwind' ? 'Tailwind Color Config' : 'JSON Object'}
                  </span>
                  <button
                    onClick={() => handleCopyFormat(fmt)}
                    className="px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-mono text-white flex items-center gap-1.5 transition-colors"
                  >
                    {copiedFormat === fmt ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                    {copiedFormat === fmt ? 'Copied!' : 'Copy'}
                  </button>
                </div>
                <pre className="p-3 rounded-xl bg-black text-[11px] font-mono text-zinc-300 overflow-x-auto max-h-32">
                  {getFormatCode(fmt)}
                </pre>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'theory' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-3xl p-7 bg-zinc-950/80 border border-white/10 backdrop-blur-xl space-y-3">
            <div className="flex items-center gap-2 text-amber-400 font-mono text-xs uppercase tracking-wider">
              <Compass size={16} />
              Snell's Law of Refraction
            </div>
            <h3 className="text-xl font-bold text-white">n1 · sin(θ1) = n2 · sin(θ2)</h3>
            <p className="text-xs text-zinc-300 leading-relaxed">
              When sunlight transitions from air (index n1 ≈ 1.0003) into an optical medium like glass (n2 ≈ 1.5 - 2.4), light rays bend inward toward the surface normal vector.
            </p>
          </div>

          <div className="rounded-3xl p-7 bg-zinc-950/80 border border-white/10 backdrop-blur-xl space-y-3">
            <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs uppercase tracking-wider">
              <Lightbulb size={16} />
              Cauchy's Dispersion Equation
            </div>
            <h3 className="text-xl font-bold text-white">n(λ) = A + B / λ²</h3>
            <p className="text-xs text-zinc-300 leading-relaxed">
              Different wavelengths (λ) experience varying indices of refraction. High-frequency violet light (λ = 400nm) bends at sharper angles than low-frequency red light (λ = 700nm), creating rainbow spectral dispersion.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
