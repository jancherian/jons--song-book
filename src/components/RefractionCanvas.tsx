import React, { useEffect, useRef } from 'react';
import type { SunState, GlassMaterial, ColorSwatch } from '../types/optics';

interface RefractionCanvasProps {
  scrollProgress: number; // 0 to 1
  activeSectionIndex: number;
  sunState: SunState;
  glassMaterial: GlassMaterial;
  palette: ColorSwatch[];
  mousePos: { x: number; y: number };
}

interface SolarParticle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  alpha: number;
  hue: number;
}

export const RefractionCanvas: React.FC<RefractionCanvasProps> = ({
  scrollProgress,
  activeSectionIndex,
  sunState,
  glassMaterial,
  palette,
  mousePos,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<SolarParticle[]>([]);

  // Initialize ambient dust motes
  useEffect(() => {
    const particles: SolarParticle[] = [];
    const count = 75;
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        size: Math.random() * 2.5 + 0.5,
        speedX: (Math.random() - 0.5) * 0.4,
        speedY: (Math.random() - 0.5) * 0.3 - 0.1,
        alpha: Math.random() * 0.7 + 0.2,
        hue: Math.random() * 60 + 30,
      });
    }
    particlesRef.current = particles;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;

      ctx.clearRect(0, 0, width, height);

      // 1. Calculate Dynamic Sun Position based on Scroll + SunState
      const sunAngleRad = (sunState.angleDeg + scrollProgress * 120) * (Math.PI / 180);
      const sunElevationFactor = sunState.elevationDeg / 90;
      
      const sunX = width * (0.2 + 0.6 * Math.cos(sunAngleRad * 0.5) + (mousePos.x / width - 0.5) * 0.08);
      const sunY = height * (0.45 - 0.35 * sunElevationFactor + Math.sin(sunAngleRad) * 0.08 + (mousePos.y / height - 0.5) * 0.08);

      // 2. Sunbeam Volumetric Light Shafts
      const beamCount = sunState.rayCount || 30;
      ctx.save();
      ctx.globalCompositeOperation = 'screen';

      const primaryColor = palette[0]?.hex || '#FFE5A3';
      const refractedColor = palette[1]?.hex || '#FFB800';
      const dispersionColor = palette[2]?.hex || '#06B6D4';

      for (let i = 0; i < beamCount; i++) {
        const angleOffset = ((i - beamCount / 2) / beamCount) * 1.4;
        const targetX = sunX + Math.cos(sunAngleRad + angleOffset) * width * 1.8;
        const targetY = sunY + Math.sin(sunAngleRad + angleOffset) * height * 1.8;

        const beamGradient = ctx.createLinearGradient(sunX, sunY, targetX, targetY);
        const alphaBase = 0.04 + 0.03 * Math.sin(i * 0.8 + Date.now() * 0.001);
        
        beamGradient.addColorStop(0, primaryColor);
        beamGradient.addColorStop(0.3, refractedColor);
        beamGradient.addColorStop(0.7, dispersionColor);
        beamGradient.addColorStop(1, 'transparent');

        ctx.beginPath();
        ctx.moveTo(sunX, sunY);
        ctx.lineTo(targetX - 40, targetY + 120);
        ctx.lineTo(targetX + 40, targetY - 120);
        ctx.closePath();
        ctx.fillStyle = beamGradient;
        ctx.globalAlpha = alphaBase * sunState.intensity;
        ctx.fill();
      }

      ctx.restore();

      // 3. Simulated Glass Prism Objects & Snell's Law Refraction Rays
      const glassPrisms = [
        {
          x: width * 0.72 + (mousePos.x - width / 2) * 0.03,
          y: height * 0.28 + (mousePos.y - height / 2) * 0.03,
          size: 140,
          rotation: (scrollProgress * 2.5 + Date.now() * 0.0003),
          shape: 'triangle',
        },
        {
          x: width * 0.22 + (mousePos.x - width / 2) * -0.02,
          y: height * 0.65 + (mousePos.y - height / 2) * -0.02,
          size: 110,
          rotation: (-scrollProgress * 1.8 - Date.now() * 0.0002),
          shape: 'diamond',
        },
        {
          x: width * 0.82,
          y: height * 0.78,
          size: 90,
          rotation: scrollProgress * 3.1,
          shape: 'hexagon',
        },
      ];

      glassPrisms.forEach((prism) => {
        ctx.save();
        ctx.translate(prism.x, prism.y);
        ctx.rotate(prism.rotation);

        // Draw Glass Shape Boundary
        ctx.beginPath();
        if (prism.shape === 'triangle') {
          ctx.moveTo(0, -prism.size * 0.6);
          ctx.lineTo(prism.size * 0.55, prism.size * 0.5);
          ctx.lineTo(-prism.size * 0.55, prism.size * 0.5);
        } else if (prism.shape === 'diamond') {
          ctx.moveTo(0, -prism.size * 0.6);
          ctx.lineTo(prism.size * 0.5, 0);
          ctx.lineTo(0, prism.size * 0.6);
          ctx.lineTo(-prism.size * 0.5, 0);
        } else {
          for (let s = 0; s < 6; s++) {
            const angle = (s * Math.PI) / 3;
            const px = (prism.size * 0.45) * Math.cos(angle);
            const py = (prism.size * 0.45) * Math.sin(angle);
            if (s === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          }
        }
        ctx.closePath();

        // Glass Ambient Fill
        ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
        ctx.fill();

        // Glass Edge Specular Highlight
        const strokeGrad = ctx.createLinearGradient(-prism.size, -prism.size, prism.size, prism.size);
        strokeGrad.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
        strokeGrad.addColorStop(0.3, palette[1]?.hex || '#FFB800');
        strokeGrad.addColorStop(0.7, palette[3]?.hex || '#E63946');
        strokeGrad.addColorStop(1, 'rgba(255, 255, 255, 0.2)');

        ctx.lineWidth = 2.5;
        ctx.strokeStyle = strokeGrad;
        ctx.stroke();

        ctx.restore();

        // 4. Snell's Law Chromatic Dispersion Rays from Sun through Prism Center
        const dx = prism.x - sunX;
        const dy = prism.y - sunY;
        const dist = Math.hypot(dx, dy);
        const incidentAngle = Math.atan2(dy, dx);

        // Indices of Refraction for Red, Green, Blue (Cauchy's dispersion equation simulation)
        const iorBase = glassMaterial.ior;
        const iorDev = glassMaterial.dispersion * 1.5;

        const iorR = iorBase - iorDev; // Red bends least
        const iorG = iorBase;          // Green mid
        const iorB = iorBase + iorDev; // Blue bends most

        const refractR = incidentAngle + (incidentAngle / iorR) * 0.22;
        const refractG = incidentAngle + (incidentAngle / iorG) * 0.22;
        const refractB = incidentAngle + (incidentAngle / iorB) * 0.22;

        const rayLength = width * 0.8;

        ctx.save();
        ctx.globalCompositeOperation = 'screen';
        ctx.lineWidth = 3;

        // Red Dispersion Ray
        ctx.beginPath();
        ctx.moveTo(prism.x, prism.y);
        ctx.lineTo(prism.x + Math.cos(refractR) * rayLength, prism.y + Math.sin(refractR) * rayLength);
        ctx.strokeStyle = palette[palette.length - 1]?.hex || '#EF4444';
        ctx.globalAlpha = 0.55 * sunState.intensity;
        ctx.stroke();

        // Green Dispersion Ray
        ctx.beginPath();
        ctx.moveTo(prism.x, prism.y);
        ctx.lineTo(prism.x + Math.cos(refractG) * rayLength, prism.y + Math.sin(refractG) * rayLength);
        ctx.strokeStyle = palette[Math.floor(palette.length / 2)]?.hex || '#10B981';
        ctx.globalAlpha = 0.65 * sunState.intensity;
        ctx.stroke();

        // Blue Dispersion Ray
        ctx.beginPath();
        ctx.moveTo(prism.x, prism.y);
        ctx.lineTo(prism.x + Math.cos(refractB) * rayLength, prism.y + Math.sin(refractB) * rayLength);
        ctx.strokeStyle = palette[0]?.hex || '#7C3AED';
        ctx.globalAlpha = 0.75 * sunState.intensity;
        ctx.stroke();

        // 5. Caustic Patch Projection on Ground Behind Prism
        const causticX = prism.x + Math.cos(refractG) * (dist * 0.85);
        const causticY = prism.y + Math.sin(refractG) * (dist * 0.85);

        const causticGrad = ctx.createRadialGradient(causticX, causticY, 2, causticX, causticY, prism.size * 1.4);
        causticGrad.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
        causticGrad.addColorStop(0.25, palette[1]?.hex || '#FFB800');
        causticGrad.addColorStop(0.65, palette[2]?.hex || '#06B6D4');
        causticGrad.addColorStop(1, 'transparent');

        ctx.beginPath();
        ctx.ellipse(causticX, causticY, prism.size * 0.9, prism.size * 0.35, refractG, 0, Math.PI * 2);
        ctx.fillStyle = causticGrad;
        ctx.globalAlpha = 0.45 * sunState.intensity;
        ctx.fill();

        ctx.restore();
      });

      // 6. Draw Sun Source Orb & Glow
      ctx.save();
      const sunGrad = ctx.createRadialGradient(sunX, sunY, 5, sunX, sunY, 140);
      sunGrad.addColorStop(0, '#FFFFFF');
      sunGrad.addColorStop(0.15, primaryColor);
      sunGrad.addColorStop(0.4, refractedColor);
      sunGrad.addColorStop(0.8, dispersionColor);
      sunGrad.addColorStop(1, 'transparent');

      ctx.beginPath();
      ctx.arc(sunX, sunY, 140, 0, Math.PI * 2);
      ctx.fillStyle = sunGrad;
      ctx.globalAlpha = 0.85 * sunState.intensity;
      ctx.fill();

      // Sun Center Core
      ctx.beginPath();
      ctx.arc(sunX, sunY, 22, 0, Math.PI * 2);
      ctx.fillStyle = '#FFFFFF';
      ctx.shadowColor = primaryColor;
      ctx.shadowBlur = 30;
      ctx.fill();
      ctx.restore();

      // 7. Floating Dust Motes / Photons Illuminated by Sunlight
      ctx.save();
      particlesRef.current.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        // Check distance to sunbeam line
        const distToSun = Math.hypot(p.x - sunX, p.y - sunY);
        const illum = Math.max(0.2, 1 - distToSun / (width * 0.7));

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * (illum * 1.3), 0, Math.PI * 2);
        ctx.fillStyle = illum > 0.6 ? '#FFFFFF' : palette[1]?.hex || '#FFB800';
        ctx.globalAlpha = p.alpha * illum;
        ctx.fill();
      });
      ctx.restore();

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [scrollProgress, activeSectionIndex, sunState, glassMaterial, palette, mousePos]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 transition-opacity duration-700"
      style={{ opacity: 0.92 }}
    />
  );
};
