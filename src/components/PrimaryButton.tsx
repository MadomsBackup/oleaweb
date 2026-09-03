import React, { ButtonHTMLAttributes } from 'react';
import Icon from './Icon';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  loading?: boolean;
  variant?: 'primary' | 'outline' | 'danger';
  icon?: string;
}

export default function PrimaryButton({
  label,
  loading,
  variant = 'primary',
  icon,
  disabled,
  className,
  ...rest
}: Props) {
  const isOutline = variant === 'outline';
  const isDanger = variant === 'danger';
  return (
    <button
      type="button"
      disabled={disabled || loading}
      className={`w-full rounded-full py-3.5 flex items-center justify-center gap-2 transition-opacity active:opacity-80 disabled:cursor-not-allowed ${
        isDanger
          ? 'bg-danger shadow-md border border-black/5 hover:brightness-105'
          : isOutline
            ? 'border-2 border-oliva/25 dark:border-white/20'
            : 'bg-terracota shadow-md border border-black/5 hover:brightness-105'
      } ${className ?? ''}`}
      style={{ opacity: disabled ? 0.6 : 1 }}
      {...rest}
    >
      {loading ? (
        <span
          className={`inline-block w-4 h-4 rounded-full border-2 border-t-transparent animate-spin ${
            isOutline ? 'border-oliva' : 'border-white'
          }`}
        />
      ) : (
        <>
          {icon ? (
            <Icon name={icon} size={16} className={isOutline ? 'text-oliva dark:text-cream' : 'text-white'} />
          ) : null}
          <span
            className={
              isOutline ? 'text-oliva dark:text-cream font-sans-bold text-[13px]' : 'text-white font-sans-bold text-[13px]'
            }
          >
            {label}
          </span>
        </>
      )}
    </button>
  );
}
