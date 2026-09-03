import React, { ButtonHTMLAttributes, CSSProperties } from 'react';
import Icon from './Icon';

interface Props extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'style'> {
  /** Nombre del ícono de Material Symbols, ej. "arrow_back". */
  icon: string;
  /** 'plain': sin fondo, para headers sobre fondo liso.
   *  'circle': fondo circular con borde sutil, para íconos flotando sobre una foto o en toolbars. */
  variant?: 'plain' | 'circle';
  size?: 'sm' | 'md';
  tone?: 'default' | 'muted' | 'danger';
  filled?: boolean;
  circleBg?: string;
  /** Texto accesible — también se usa como tooltip nativo (title). */
  label?: string;
  style?: CSSProperties;
}

const DIMENSION = { sm: 32, md: 40 };
const ICON_SIZE = { sm: 17, md: 20 };

export default function IconButton({
  icon,
  variant = 'plain',
  size = 'md',
  tone = 'default',
  filled = false,
  circleBg = 'rgba(255,255,255,0.9)',
  label,
  style,
  className,
  ...rest
}: Props) {
  const dimension = DIMENSION[size];
  const toneClass =
    tone === 'danger'
      ? 'text-danger'
      : tone === 'muted'
        ? 'text-text-muted'
        : 'text-oliva dark:text-cream';

  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      className={`inline-flex items-center justify-center shrink-0 transition-colors hover:opacity-70 ${
        variant === 'circle' ? 'border border-subtle dark:border-subtle-dark shadow-sm' : ''
      } ${className ?? ''}`}
      style={{
        width: dimension,
        height: dimension,
        borderRadius: variant === 'circle' ? dimension / 2 : 8,
        backgroundColor: variant === 'circle' ? circleBg : undefined,
        ...style,
      }}
      {...rest}
    >
      <Icon name={icon} size={ICON_SIZE[size]} filled={filled} className={toneClass} />
    </button>
  );
}
