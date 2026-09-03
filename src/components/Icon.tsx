import React, { CSSProperties } from 'react';

interface Props {
  /** Nombre exacto del ícono en Material Symbols, ej. "arrow_back", "favorite". */
  name: string;
  size?: number;
  /** Relleno: 0 = solo contorno (default), 1 = ícono sólido (ej. favorito activo). */
  filled?: boolean;
  weight?: 300 | 400 | 500 | 600;
  className?: string;
  style?: CSSProperties;
}

/**
 * Ícono de Google Material Symbols (https://fonts.google.com/icons).
 * Reemplaza los emoji usados antes en botones: se ven consistentes en
 * cualquier plataforma/navegador y centran perfecto en círculos/pills
 * porque son un glifo monoespaciado con line-height 1.
 */
export default function Icon({ name, size = 20, filled = false, weight = 400, className, style }: Props) {
  return (
    <span
      className={`material-symbols-outlined select-none ${className ?? ''}`}
      style={{
        fontSize: size,
        fontVariationSettings: `'FILL' ${filled ? 1 : 0}, 'wght' ${weight}, 'GRAD' 0, 'opsz' ${size}`,
        ...style,
      }}
      aria-hidden="true"
    >
      {name}
    </span>
  );
}
