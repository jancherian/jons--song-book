import React, { useEffect, useRef, useState } from 'react';
import type { LiquidGlassConfig, ColorSwatch } from '../types/optics';

interface LiquidVideoRefractionCanvasProps {
  videoUrl: string;
  customFile: File | null;
  config: LiquidGlassConfig;
  mousePos: { x: number; y: number };
  onExtractedPalette: (swatches: ColorSwatch[]) => void;
  isPlaying: boolean;
  isMuted: boolean;
  onVideoError?: () => void;
}

export const LiquidVideoRefractionCanvas: React.FC<LiquidVideoRefractionCanvasProps> = ({
  videoUrl,
  customFile,
  config,
  mousePos,
  onExtractedPalette,
  isPlaying,
  isMuted,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const mainCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const offscreenCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const [usingFallbackCanvas, setUsingFallbackCanvas] = useState(false);

  // Stabilize callback ref to prevent effect dependency churn
  const onExtractedPaletteRef = useRef(onExtractedPalette);
  useEffect(() => {
    onExtractedPaletteRef.current = onExtractedPalette;
  }, [onExtractedPalette]);

  // Setup video source
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Reset fallback state when switching video sources
    setUsingFallbackCanvas(false);

    let objectUrl: string | null = null;
    if (customFile) {
      objectUrl = URL.createObjectURL(customFile);
      video.src = objectUrl;
    } else if (videoUrl) {
      video.src = videoUrl;
    }

    video.muted = isMuted;
    video.currentTime = 0;

    // Listen for actual video load errors (network/format failures)
    const handleError = () => {
      setUsingFallbackCanvas(true);
    };
    video.addEventListener('error', handleError);
    
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // Autoplay blocked — try muted autoplay as fallback
        video.muted = true;
        video.play().catch(() => {
          setUsingFallbackCanvas(true);
        });
      });
    }

    return () => {
      video.removeEventListener('error', handleError);
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [videoUrl, customFile, isMuted]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (isPlaying) {
      video.play().catch(() => setUsingFallbackCanvas(true));
    } else {
      video.pause();
    }
  }, [isPlaying]);

  // Main 60FPS Render Loop: Video Frame -> Liquid Glass Refraction -> Palette Extraction
  useEffect(() => {
    const mainCanvas = mainCanvasRef.current;
    if (!mainCanvas) return;
    const ctx = mainCanvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    if (!offscreenCanvasRef.current) {
      offscreenCanvasRef.current = document.createElement('canvas');
    }
    const offscreenCanvas = offscreenCanvasRef.current;
    const offCtx = offscreenCanvas.getContext('2d', { willReadFrequently: true });
    if (!offCtx) return;

    let animId: number;
    let frameCount = 0;

    const resize = () => {
      mainCanvas.width = window.innerWidth;
      mainCanvas.height = window.innerHeight;
      offscreenCanvas.width = window.innerWidth;
      offscreenCanvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const render = () => {
      frameCount++;
      const width = mainCanvas.width;
      const height = mainCanvas.height;

      // 1. Draw Source Video Frame or Fallback Procedural Liquid Light Video
      const video = videoRef.current;
      const isVideoReady = video && video.readyState >= 2 && !usingFallbackCanvas;

      if (isVideoReady) {
        try {
          offCtx.drawImage(video, 0, 0, width, height);
        } catch {
          setUsingFallbackCanvas(true);
        }
      }

      if (!isVideoReady || usingFallbackCanvas) {
        // Procedural Ambient Liquid Solar Light Generator
        const t = Date.now() * 0.001;
        const grad = offCtx.createLinearGradient(0, 0, width, height);
        grad.addColorStop(0, '#0a0412');
        grad.addColorStop(0.3, '#1e0c38');
        grad.addColorStop(0.65, '#052b36');
        grad.addColorStop(1, '#050c1a');
        offCtx.fillStyle = grad;
        offCtx.fillRect(0, 0, width, height);

        // Animated Liquid Solar Caustic Orbs
        for (let i = 0; i < 4; i++) {
          const cx = width * (0.3 + 0.4 * Math.sin(t * 0.6 + i * 1.5));
          const cy = height * (0.3 + 0.4 * Math.cos(t * 0.4 + i * 2.1));
          const radius = 250 + Math.sin(t + i) * 60;

          const orbGrad = offCtx.createRadialGradient(cx, cy, 10, cx, cy, radius);
          const colors = [
            'rgba(245, 158, 11, 0.65)',
            'rgba(6, 182, 212, 0.55)',
            'rgba(168, 85, 247, 0.5)',
            'rgba(236, 72, 153, 0.45)',
          ];
          orbGrad.addColorStop(0, colors[i % colors.length]);
          orbGrad.addColorStop(0.5, colors[(i + 1) % colors.length]);
          orbGrad.addColorStop(1, 'transparent');

          offCtx.beginPath();
          offCtx.arc(cx, cy, radius, 0, Math.PI * 2);
          offCtx.fillStyle = orbGrad;
          offCtx.globalCompositeOperation = 'screen';
          offCtx.fill();
          offCtx.globalCompositeOperation = 'source-over';
        }
      }

      // Draw Base Video Frame to Main Canvas
      ctx.clearRect(0, 0, width, height);
      ctx.drawImage(offscreenCanvas, 0, 0, width, height);

      // 2. Sample & Refract Video Light inside Liquid Glass UI Elements
      const glassElements = document.querySelectorAll('[data-liquid-glass="true"]');

      glassElements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.width <= 0 || rect.height <= 0) return;
        if (rect.bottom < 0 || rect.top > height) return;

        const gx = Math.floor(rect.left);
        const gy = Math.floor(rect.top);
        const gw = Math.floor(rect.width);
        const gh = Math.floor(rect.height);

        // Fetch background video pixels behind this glass element
        try {
          const frameData = offCtx.getImageData(
            Math.max(0, gx),
            Math.max(0, gy),
            Math.min(width - gx, gw),
            Math.min(height - gy, gh)
          );

          if (frameData.width > 0 && frameData.height > 0) {
            const refrData = ctx.createImageData(frameData.width, frameData.height);
            const src = frameData.data;
            const dst = refrData.data;
            const fw = frameData.width;
            const fh = frameData.height;

            const strength = config.refractionStrength * 35;
            const dispersion = config.dispersionStrength * 1.8;
            const tRipple = Date.now() * 0.002 * (config.liquidViscosity + 0.2);

            // Mouse proximity liquid lens pull factor
            const elCenterX = gx + gw / 2;
            const elCenterY = gy + gh / 2;
            const distMouse = Math.hypot(mousePos.x - elCenterX, mousePos.y - elCenterY);
            const mousePull = Math.max(0, 1 - distMouse / 350) * 0.4;

            // Refract Video Pixels using Apple Liquid Glass Lens Normals
            for (let y = 0; y < fh; y++) {
              const ny = (y / fh - 0.5) * 2; // -1 to 1
              for (let x = 0; x < fw; x++) {
                const nx = (x / fw - 0.5) * 2; // -1 to 1
                const r = Math.sqrt(nx * nx + ny * ny);

                // Liquid Lens Spherical Normal Vector + Wave Ripple
                const ripple = Math.sin(r * 12 - tRipple) * 0.08;
                const normalFactor = (1 - Math.pow(Math.min(1, r), 2)) + ripple + mousePull;

                // Refraction Coordinate Offsets
                const dx = nx * normalFactor * strength;
                const dy = ny * normalFactor * strength;

                // Red Channel Offset (Dispersion)
                const rx = Math.min(fw - 1, Math.max(0, Math.round(x + dx * (1 + dispersion))));
                const ry = Math.min(fh - 1, Math.max(0, Math.round(y + dy * (1 + dispersion))));
                const rIdx = (ry * fw + rx) * 4;

                // Green Channel Offset (Mid)
                const grx = Math.min(fw - 1, Math.max(0, Math.round(x + dx)));
                const gry = Math.min(fh - 1, Math.max(0, Math.round(y + dy)));
                const gIdx = (gry * fw + grx) * 4;

                // Blue Channel Offset (Dispersion)
                const bx = Math.min(fw - 1, Math.max(0, Math.round(x + dx * (1 - dispersion))));
                const by = Math.min(fh - 1, Math.max(0, Math.round(y + dy * (1 - dispersion))));
                const bIdx = (by * fw + bx) * 4;

                const outIdx = (y * fw + x) * 4;
                dst[outIdx] = src[rIdx];     // Red
                dst[outIdx + 1] = src[gIdx + 1]; // Green
                dst[outIdx + 2] = src[bIdx + 2]; // Blue
                dst[outIdx + 3] = src[gIdx + 3]; // Alpha
              }
            }

            // Put Refracted Video Pixels back onto Glass Element Canvas
            ctx.save();
            ctx.beginPath();
            const cornerRadius = 24;
            ctx.roundRect(gx, gy, gw, gh, cornerRadius);
            ctx.clip();

            ctx.putImageData(refrData, gx, gy);

            // Apple VisionOS Liquid Specular Sheen Overlay
            const specGrad = ctx.createLinearGradient(gx, gy, gx + gw, gy + gh);
            specGrad.addColorStop(0, `rgba(255, 255, 255, ${0.25 * config.specularIntensity})`);
            specGrad.addColorStop(0.4, 'rgba(255, 255, 255, 0.05)');
            specGrad.addColorStop(0.8, `rgba(255, 255, 255, ${0.15 * config.specularIntensity})`);
            ctx.fillStyle = specGrad;
            ctx.fillRect(gx, gy, gw, gh);

            ctx.restore();
          }
        } catch {
          // Fallback if image data sampling restricted
        }
      });

      // 3. Periodic Dynamic Video Light Color Palette Extraction (every 20 frames)
      if (frameCount % 20 === 0) {
        try {
          const sampleData = offCtx.getImageData(0, 0, width, height).data;
          const swatches = extractVideoLightPalette(sampleData, width, height);
          if (swatches && swatches.length >= 4) {
            onExtractedPaletteRef.current(swatches);
          }
        } catch {
          // Ignore
        }
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, [config, mousePos, usingFallbackCanvas, isPlaying]);

  return (
    <>
      {/* Hidden Video Source Element */}
      <video
        ref={videoRef}
        autoPlay
        loop
        muted={isMuted}
        playsInline
        className="hidden"
      />

      {/* Main Fullscreen Video Refraction Canvas */}
      <canvas
        ref={mainCanvasRef}
        className="fixed inset-0 pointer-events-none z-0"
      />
    </>
  );
};

// Helper: Extract dominant matching colors from video light
function extractVideoLightPalette(data: Uint8ClampedArray, width: number, height: number): ColorSwatch[] {
  const step = 40; // sample grid
  const colorBuckets: { r: number; g: number; b: number; count: number }[] = [];

  for (let y = 0; y < height; y += step) {
    for (let x = 0; x < width; x += step) {
      const idx = (y * width + x) * 4;
      const r = data[idx];
      const g = data[idx + 1];
      const b = data[idx + 2];
      const brightness = (r + g + b) / 3;

      if (brightness > 25 && brightness < 240) {
        // Group into coarse buckets
        const br = Math.round(r / 35) * 35;
        const bg = Math.round(g / 35) * 35;
        const bb = Math.round(b / 35) * 35;

        const bucket = colorBuckets.find(bkt => Math.abs(bkt.r - br) < 30 && Math.abs(bkt.g - bg) < 30 && Math.abs(bkt.b - bb) < 30);
        if (bucket) {
          bucket.r = (bucket.r * bucket.count + r) / (bucket.count + 1);
          bucket.g = (bucket.g * bucket.count + g) / (bucket.count + 1);
          bucket.b = (bucket.b * bucket.count + b) / (bucket.count + 1);
          bucket.count++;
        } else {
          colorBuckets.push({ r, g, b, count: 1 });
        }
      }
    }
  }

  colorBuckets.sort((a, b) => b.count - a.count);
  const topBuckets = colorBuckets.slice(0, 5);

  const swatchNames = [
    'Refracted Solar Core',
    'Liquid Spectrum Edge',
    'Chromatically Bended Light',
    'Caustic Prism Glow',
    'Ambient Daylight Fill',
  ];

  return topBuckets.map((b, idx) => {
    const r = Math.round(b.r);
    const g = Math.round(b.g);
    const bColor = Math.round(b.b);
    const hex = `#${((1 << 24) + (r << 16) + (g << 8) + bColor).toString(16).slice(1).toUpperCase()}`;

    // Wavelength estimation
    const wavelength = 380 + Math.round(((r * 0.4 + g * 0.4 + bColor * 0.2) / 255) * 320);

    return {
      hex,
      name: swatchNames[idx] || `Refracted Hue ${idx + 1}`,
      wavelengthNm: wavelength,
      hsl: `rgb(${r}, ${g}, ${bColor})`,
      rgb: `rgb(${r}, ${g}, ${bColor})`,
      role: idx === 0 ? 'Primary Video Light' : idx === 1 ? 'Refracted Core' : 'Spectral Fringe',
    };
  });
}
