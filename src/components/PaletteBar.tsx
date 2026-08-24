import React, { useState } from 'react';
import type { SectionTheme } from '../types/optics';
import { Palette, Copy, Check, Sun, Code2 } from 'lucide-react';

interface PaletteBarProps {
  currentTheme: SectionTheme;
  copiedHex: string | null;
  onCopyHex: (hex: string) => void;
}

export const PaletteBar: React.FC<PaletteBarProps> = ({
  currentTheme,
  copiedHex,
  onCopyHex,
}) => {
  const [showExportModal, setShowExportModal] = useState(false);

  const cssVariablesString = currentTheme.palette
    .map((s, i) => `--sunlight-refraction-${i + 1}: ${s.hex}; /* ${s.name} (${s.wavelengthNm}nm) */`)
    .join('\n');

  return (
    <>
      {/* Sticky Bottom Floating Glass Bar */}
      <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-40 w-[min(94%,920px)] transition-all duration-500">
        <div className="rounded-2xl p-3 sm:p-4 bg-zinc-950/85 backdrop-blur-2xl border border-white/15 shadow-2xl shadow-black/80 flex flex-col sm:flex-row items-center justify-between gap-3">
          
          {/* Section Telemetry Badge */}
          <div className="flex items-center gap-3 shrink-0">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border border-white/20 shadow-inner"
              style={{
                background: `linear-gradient(135deg, ${currentTheme.palette[0]?.hex || '#FFF'} 0%, ${currentTheme.accentColor} 100%)`,
              }}
            >
              <Sun size={20} className="text-zinc-950 font-bold" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-white tracking-tight">{currentTheme.title}</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/10 text-amber-300 border border-white/10">
                  {currentTheme.sunState.colorTempK}K
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 font-mono hidden sm:block">
                {currentTheme.glassMaterial.name} • IOR {currentTheme.glassMaterial.ior}
              </p>
            </div>
          </div>

          {/* Palette Swatches Row */}
          <div className="flex items-center gap-1.5 sm:gap-2 flex-1 w-full justify-center px-2">
            {currentTheme.palette.map((swatch, idx) => {
              const isCopied = copiedHex === swatch.hex;
              return (
                <button
                  key={idx}
                  onClick={() => onCopyHex(swatch.hex)}
                  className="group relative flex-1 max-w-[120px] h-11 rounded-xl transition-all duration-300 hover:scale-105 hover:-translate-y-1 focus:outline-none border border-white/20 overflow-hidden flex flex-col justify-between p-1.5 shadow-md"
                  style={{ backgroundColor: swatch.hex }}
                >
                  <div className="flex justify-between items-center w-full">
                    <span className="text-[9px] font-mono font-bold text-black/80 bg-white/80 rounded px-1 backdrop-blur-sm">
                      {swatch.wavelengthNm}nm
                    </span>
                    {isCopied ? (
                      <Check size={12} className="text-emerald-950 font-bold bg-white rounded-full p-0.5" />
                    ) : (
                      <Copy size={11} className="text-black/60 opacity-0 group-hover:opacity-100 transition-opacity" />
                    )}
                  </div>
                  <span className="text-[10px] font-mono font-bold text-zinc-950 tracking-wider truncate w-full text-left bg-white/70 backdrop-blur-sm px-1 rounded">
                    {isCopied ? 'COPIED!' : swatch.hex}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Export Code Button */}
          <button
            onClick={() => setShowExportModal(true)}
            className="shrink-0 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-mono text-xs flex items-center gap-2 border border-white/15 transition-all duration-200"
          >
            <Code2 size={14} className="text-cyan-400" />
            <span className="hidden sm:inline">Export CSS</span>
          </button>
        </div>
      </div>

      {/* Export CSS Variables Modal */}
      {showExportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-lg rounded-3xl p-6 bg-zinc-900 border border-white/15 shadow-2xl text-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <Palette size={18} className="text-amber-400" />
                Refracted Color Palette CSS
              </h3>
              <button
                onClick={() => setShowExportModal(false)}
                className="text-zinc-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-zinc-400 mb-3">
              Copy matched sunlight refraction variables for <strong className="text-amber-300">{currentTheme.title}</strong>:
            </p>

            <pre className="p-4 rounded-xl bg-zinc-950 border border-white/10 text-xs font-mono text-cyan-300 overflow-x-auto mb-4">
              {cssVariablesString}
            </pre>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(cssVariablesString);
                  onCopyHex('CSS_VARS');
                  setShowExportModal(false);
                }}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-zinc-950 font-bold text-xs flex items-center gap-2 shadow-lg"
              >
                <Copy size={14} />
                Copy CSS Variables
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
