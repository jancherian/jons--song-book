import React, { useState, useRef, useEffect } from 'react';
import type { SectionTheme } from '../types/optics';
import { RefreshCw, Zap } from 'lucide-react';

interface PrismViewerProps {
  theme: SectionTheme;
}

export const PrismViewer: React.FC<PrismViewerProps> = ({ theme }) => {
  const [angle, setAngle] = useState(38);
  const [ior, setIor] = useState(theme.glassMaterial.ior);
  const [dispersion, setDispersion] = useState(theme.glassMaterial.dispersion);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    setIor(theme.glassMaterial.ior);
    setDispersion(theme.glassMaterial.dispersion);
  }, [theme]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    // Dark optical bench background
    ctx.fillStyle = '#0a0d14';
    ctx.fillRect(0, 0, width, height);

    // Subtle optical grid
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    for (let x = 0; x < width; x += 30) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke();
    }
    for (let y = 0; y < height; y += 30) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke();
    }

    // Triangular Prism Coordinates
    const prismCenterX = width * 0.45;
    const prismCenterY = height * 0.52;
    const prismSize = 130;

    const p1 = { x: prismCenterX, y: prismCenterY - prismSize * 0.65 };
    const p2 = { x: prismCenterX + prismSize * 0.65, y: prismCenterY + prismSize * 0.55 };
    const p3 = { x: prismCenterX - prismSize * 0.65, y: prismCenterY + prismSize * 0.55 };

    // 1. Incident White Sunlight Ray
    const rayRad = (angle * Math.PI) / 180;
    const sunSourceX = 40;
    const sunSourceY = prismCenterY - Math.tan(rayRad) * (prismCenterX - 40);

    // Entry point on left prism face (p1 -> p3)
    const entryX = prismCenterX - prismSize * 0.32;
    const entryY = prismCenterY;

    // Draw Incoming Sunlight Beam
    ctx.save();
    const incidentGrad = ctx.createLinearGradient(sunSourceX, sunSourceY, entryX, entryY);
    incidentGrad.addColorStop(0, '#FFFFFF');
    incidentGrad.addColorStop(1, theme.palette[0]?.hex || '#FFF2C5');

    ctx.beginPath();
    ctx.moveTo(sunSourceX, sunSourceY);
    ctx.lineTo(entryX, entryY);
    ctx.lineWidth = 6;
    ctx.strokeStyle = incidentGrad;
    ctx.shadowColor = '#FFFFFF';
    ctx.shadowBlur = 15;
    ctx.stroke();
    ctx.restore();

    // 2. Refraction inside Prism (Snell's Law: n1 * sin(t1) = n2 * sin(t2))
    const wavelengths = [
      { color: '#EF4444', label: '700nm Red', delta: -dispersion * 1.6 },
      { color: '#F59E0B', label: '590nm Orange', delta: -dispersion * 0.8 },
      { color: '#10B981', label: '540nm Green', delta: 0 },
      { color: '#06B6D4', label: '490nm Cyan', delta: dispersion * 0.8 },
      { color: '#2563EB', label: '450nm Blue', delta: dispersion * 1.4 },
      { color: '#7C3AED', label: '410nm Violet', delta: dispersion * 2.2 },
    ];

    const exitX = prismCenterX + prismSize * 0.32;
    const exitY = prismCenterY + 10;

    // Draw Internal Refracted Rays
    ctx.save();
    wavelengths.forEach((wl) => {
      const internalAngle = (angle * 0.35) + wl.delta * 25;

      ctx.beginPath();
      ctx.moveTo(entryX, entryY);
      ctx.lineTo(exitX, exitY + (wl.delta * 120));
      ctx.lineWidth = 2.5;
      ctx.strokeStyle = wl.color;
      ctx.stroke();

      // Exit Refracted Rays spreading into Rainbow Spectral Fan
      const exitAngle = internalAngle * ior + wl.delta * 90;
      const exitRad = (exitAngle * Math.PI) / 180;
      const rayLength = width - exitX;

      const targetX = width - 20;
      const targetY = exitY + (wl.delta * 120) + Math.tan(exitRad) * rayLength;

      ctx.beginPath();
      ctx.moveTo(exitX, exitY + (wl.delta * 120));
      ctx.lineTo(targetX, targetY);
      ctx.lineWidth = 3.5;
      ctx.strokeStyle = wl.color;
      ctx.shadowColor = wl.color;
      ctx.shadowBlur = 10;
      ctx.stroke();

      // Target Spectral Bar Glow Dot
      ctx.beginPath();
      ctx.arc(targetX, targetY, 4.5, 0, Math.PI * 2);
      ctx.fillStyle = wl.color;
      ctx.fill();
    });
    ctx.restore();

    // 3. Draw Triangular Glass Prism
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.lineTo(p3.x, p3.y);
    ctx.closePath();

    const prismGrad = ctx.createLinearGradient(p1.x, p1.y, p2.x, p2.y);
    prismGrad.addColorStop(0, 'rgba(255, 255, 255, 0.16)');
    prismGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0.05)');
    prismGrad.addColorStop(1, 'rgba(255, 255, 255, 0.12)');
    ctx.fillStyle = prismGrad;
    ctx.fill();

    // Prism Outer Edge Glass Highlight
    ctx.lineWidth = 2;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.shadowColor = 'rgba(255, 255, 255, 0.4)';
    ctx.shadowBlur = 8;
    ctx.stroke();
    ctx.restore();

    // 4. Sun Source Emblem on Left
    ctx.save();
    ctx.beginPath();
    ctx.arc(sunSourceX, sunSourceY, 18, 0, Math.PI * 2);
    ctx.fillStyle = '#FFFFFF';
    ctx.shadowColor = theme.accentColor;
    ctx.shadowBlur = 20;
    ctx.fill();
    ctx.restore();

  }, [angle, ior, dispersion, theme]);

  return (
    <div className="relative rounded-3xl p-6 bg-zinc-950/80 border border-white/10 backdrop-blur-xl overflow-hidden shadow-2xl">
      <div className="flex items-center justify-between gap-4 mb-4">
        <div>
          <span className="text-xs font-mono text-amber-400 flex items-center gap-1.5 mb-1">
            <Zap size={14} />
            Optics Laboratory Bench
          </span>
          <h4 className="text-xl font-bold text-white tracking-tight">Snell's Law Prism Refractor</h4>
        </div>
        <button
          onClick={() => {
            setAngle(38);
            setIor(theme.glassMaterial.ior);
            setDispersion(theme.glassMaterial.dispersion);
          }}
          className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors border border-white/10 text-xs font-mono flex items-center gap-1.5"
        >
          <RefreshCw size={13} />
          Reset
        </button>
      </div>

      {/* Interactive Ray Tracing Canvas */}
      <div className="relative rounded-2xl overflow-hidden border border-white/10 mb-5 bg-black">
        <canvas
          ref={canvasRef}
          width={640}
          height={320}
          className="w-full h-[280px] object-cover"
        />
        <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 text-[11px] font-mono text-zinc-300 flex items-center gap-3">
          <span>Sun Ray Angle: <strong className="text-amber-400">{angle}°</strong></span>
          <span>Material IOR: <strong className="text-cyan-400">{ior.toFixed(3)}</strong></span>
          <span>Abbe Dispersion: <strong className="text-emerald-400">{(dispersion * 1000).toFixed(0)}</strong></span>
        </div>
      </div>

      {/* Sliders Control Panel */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs text-zinc-300">
        <div className="space-y-1.5 p-3 rounded-xl bg-white/5 border border-white/5">
          <div className="flex justify-between">
            <span className="text-zinc-400">Incident Angle (θi)</span>
            <span className="text-amber-400 font-bold">{angle}°</span>
          </div>
          <input
            type="range"
            min={15}
            max={75}
            value={angle}
            onChange={(e) => setAngle(Number(e.target.value))}
            className="w-full accent-amber-400 cursor-pointer h-1.5 bg-zinc-800 rounded-lg"
          />
        </div>

        <div className="space-y-1.5 p-3 rounded-xl bg-white/5 border border-white/5">
          <div className="flex justify-between">
            <span className="text-zinc-400">Glass IOR (n)</span>
            <span className="text-cyan-400 font-bold">{ior.toFixed(3)}</span>
          </div>
          <input
            type="range"
            min={1.20}
            max={2.42}
            step={0.01}
            value={ior}
            onChange={(e) => setIor(Number(e.target.value))}
            className="w-full accent-cyan-400 cursor-pointer h-1.5 bg-zinc-800 rounded-lg"
          />
        </div>

        <div className="space-y-1.5 p-3 rounded-xl bg-white/5 border border-white/5">
          <div className="flex justify-between">
            <span className="text-zinc-400">Dispersion Spread (Δn)</span>
            <span className="text-emerald-400 font-bold">{(dispersion * 100).toFixed(1)}%</span>
          </div>
          <input
            type="range"
            min={0.005}
            max={0.08}
            step={0.002}
            value={dispersion}
            onChange={(e) => setDispersion(Number(e.target.value))}
            className="w-full accent-emerald-400 cursor-pointer h-1.5 bg-zinc-800 rounded-lg"
          />
        </div>
      </div>
    </div>
  );
};
