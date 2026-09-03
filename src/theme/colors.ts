/**
 * ============================================================
 *  PALETA DE COLORES — OLEA
 * ============================================================
 * Este es el ÚNICO lugar donde se definen los colores de la app.
 * Para cambiar cualquier color, modificá el valor acá — se
 * propaga automáticamente a:
 *   1. Tailwind (tailwind.config.ts lo importa directamente)
 *   2. Cualquier componente React que necesite el valor "crudo"
 *      (import { oleaColors } from '../theme/colors')
 *
 * No definas colores nuevos sueltos en otros archivos: agregalos
 * acá para que todo quede centralizado.
 *
 * Notas de contraste (por qué estos valores y no otros):
 * - `salvia` (#939274) tiene muy bajo contraste con texto blanco
 *   (~1.7:1, el mínimo AA es 4.5:1). Se usa solo para fondos
 *   sutiles o texto sobre `cream`, nunca como fondo con texto
 *   blanco encima — para eso usar `oliva`.
 * - `border` / `borderDark` son para el borde sutil que separa
 *   tarjetas blancas de fondos `cream` casi idénticos en tono
 *   (ese bajo contraste era buena parte de por qué costaba
 *   distinguir los elementos).
 * ============================================================
 */

export const oleaColors = {
  // Fondos
  cream: '#FBF4E9',
  white: '#FFFFFF',
  oliva: '#5D5A35',
  olivaDark: '#2E2C1E',
  oliva900: '#3A3826', // superficie de tarjeta en modo oscuro (sobre olivaDark)

  // Acento primario (botones, CTA, elementos activos)
  terracota: '#C17C53',
  terracotaDark: '#A2643F', // hover/active de terracota

  // Secundarios / paleta cálida
  salvia: '#939274',
  rose: '#DAAC95',
  bege: '#D8BCA2',

  // Texto
  textMuted: '#8A8470',
  textMutedDark: '#C9C2AB',

  // Bordes sutiles (para separar tarjetas de fondos de tono similar)
  border: 'rgba(93, 90, 53, 0.14)',
  borderDark: 'rgba(255, 255, 255, 0.14)',

  // Estados
  danger: '#B15C4A',
  dangerSoft: 'rgba(177, 92, 74, 0.10)',
  dangerBorder: 'rgba(177, 92, 74, 0.35)',
} as const;

export default oleaColors;
