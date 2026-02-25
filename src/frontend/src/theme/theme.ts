/**
 * AVIS — Design System Tokens
 * Metáfora Visual: "El Cuaderno de Campo Vivo"
 */

// ─── COLORES ───────────────────────────────────────────────
export const colors = {
  // Paleta principal (Naturaleza Soft)
  primary: '#7C9A92',       // Verde Salvia — acciones principales
  secondary: '#D9A08B',     // Terracota Suave — alertas / combate
  background: '#FDFBF7',    // Papel Crema/Hueso — fondo principal
  text: '#2C3E50',          // Gris Carbón — texto principal

  // Variantes
  primaryLight: '#A8C2BB',
  primaryDark: '#5B7A72',
  secondaryLight: '#E8C4B5',
  secondaryDark: '#C07A63',

  // Posturas del Certamen (Triángulo de Poder)
  canto: '#E74C3C',         // Rojo — Canto vence a Plumaje
  plumaje: '#27AE60',       // Verde — Plumaje vence a Vuelo
  vuelo: '#3498DB',         // Azul — Vuelo vence a Canto

  // Biomas
  bosque: '#2D5016',
  costa: '#1A7BBF',
  montaña: '#8B7355',

  // Utilidades
  white: '#FFFFFF',
  black: '#000000',
  success: '#27AE60',
  warning: '#F39C12',
  error: '#E74C3C',
  overlay: 'rgba(0, 0, 0, 0.5)',
  glass: 'rgba(253, 251, 247, 0.7)',       // Glassmorphism
  glassBorder: 'rgba(255, 255, 255, 0.5)', // Borde glassmorphism
  disabled: 'rgba(44, 62, 80, 0.3)',

  // Clima (Fondo / UI)
  weatherSol: '#87CEEB',
  weatherLluvia: '#546E7A',
  weatherNoche: '#0D1B2A',
  weatherViento: '#90A4AE',
  weatherNublado: '#B0BEC5',
  weatherNieve: '#E1F5FE',
  weatherTormenta: '#37474F',
};

// ─── TIPOGRAFÍA ────────────────────────────────────────────
export const typography = {
  // Familias
  fontTitle: 'Georgia, serif',    // Merriweather/Lora fallback
  fontBody: 'system-ui, sans-serif', // Nunito/Quicksand fallback

  // Tamaños
  sizeHero: 48,
  sizeTitle: 24,
  sizeSubtitle: 18,
  sizeBody: 16,
  sizeCaption: 12,
  sizeSmall: 10,

  // Pesos
  weightBold: '700' as const,
  weightSemiBold: '600' as const,
  weightRegular: '400' as const,
};

// ─── ESPACIADO ─────────────────────────────────────────────
export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  huge: 48,
};

// ─── BORDES ────────────────────────────────────────────────
export const borders = {
  radiusSmall: 10,
  radiusMedium: 16,
  radiusLarge: 20,
  radiusFull: 999,
};

// ─── SOMBRAS ───────────────────────────────────────────────
export const shadows = {
  glass: {
    shadowColor: colors.text,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  bottomBar: {
    shadowColor: colors.text,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 8,
  },
  card: {
    shadowColor: colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
};

// ─── TEMA COMPLETO ─────────────────────────────────────────
const theme = {
  colors,
  typography,
  spacing,
  borders,
  shadows,
};

export default theme;
