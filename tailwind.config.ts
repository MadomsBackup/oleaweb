import type { Config } from 'tailwindcss';
import { oleaColors } from './src/theme/colors';

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Paleta OLEA — leída de src/theme/colors.ts (única fuente de verdad).
        // Para cambiar un color de toda la app, editá ese archivo, no este.
        cream: oleaColors.cream,
        oliva: oleaColors.oliva,
        'oliva-dark': oleaColors.olivaDark,
        'oliva-900': oleaColors.oliva900,
        terracota: oleaColors.terracota,
        'terracota-dark': oleaColors.terracotaDark,
        salvia: oleaColors.salvia,
        rose: oleaColors.rose,
        bege: oleaColors.bege,
        'text-muted': oleaColors.textMuted,
        'text-muted-dark': oleaColors.textMutedDark,
        danger: oleaColors.danger,
      },
      borderColor: {
        subtle: oleaColors.border,
        'subtle-dark': oleaColors.borderDark,
      },
      backgroundColor: {
        'danger-soft': oleaColors.dangerSoft,
      },
      fontFamily: {
        serif: ['Lora-Regular', 'serif'],
        'serif-bold': ['Lora-Bold', 'serif'],
        'serif-italic': ['Lora-Italic', 'serif'],
        sans: ['Poppins-Regular', 'sans-serif'],
        'sans-medium': ['Poppins-Medium', 'Poppins-Regular', 'sans-serif'],
        'sans-bold': ['Poppins-Bold', 'sans-serif'],
      },
      boxShadow: {
        sm: '0 1px 3px rgba(46,44,30,0.08)',
        md: '0 4px 14px rgba(46,44,30,0.14)',
        lg: '0 10px 30px rgba(46,44,30,0.18)',
      },
    },
  },
  plugins: [],
} satisfies Config;
