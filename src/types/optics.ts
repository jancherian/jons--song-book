export interface ColorSwatch {
  hex: string;
  name: string;
  wavelengthNm: number;
  hsl: string;
  rgb: string;
  role: string;
}

export interface SunState {
  angleDeg: number;
  elevationDeg: number;
  colorTempK: number;
  intensity: number;
  rayCount: number;
}

export interface GlassMaterial {
  name: string;
  ior: number;
  dispersion: number;
  roughness: number;
  tintHex: string;
}

export interface SectionTheme {
  id: string;
  title: string;
  subtitle: string;
  tagline: string;
  timeOfDay: string;
  bgGradient: string;
  bgOrb1: string;
  bgOrb2: string;
  accentColor: string;
  sunState: SunState;
  glassMaterial: GlassMaterial;
  palette: ColorSwatch[];
  description: string;
  physicsDetails: {
    snellAngleIn: number;
    snellAngleOut: number;
    spectralShift: string;
    causticFocus: string;
  };
}

export interface VideoSourceOption {
  id: string;
  name: string;
  url: string;
  category: string;
}

export interface LiquidGlassConfig {
  refractionStrength: number; // 0 to 1
  dispersionStrength: number; // 0 to 1 (chromatic aberration)
  blurAmount: number; // 0 to 40px
  roughness: number; // 0 to 1
  liquidViscosity: number; // 0 to 1 (ripple speed)
  specularIntensity: number; // 0 to 1
  fresnelBias: number; // 0 to 1
}
