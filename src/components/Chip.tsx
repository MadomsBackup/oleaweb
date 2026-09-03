import React from 'react';

interface Props {
  label: string;
  active?: boolean;
  onPress?: () => void;
}

export default function Chip({ label, active, onPress }: Props) {
  return (
    <button
      type="button"
      onClick={onPress}
      className={`shrink-0 px-4 py-2 rounded-full mr-2 border transition-colors hover:opacity-80 ${
        active ? 'bg-terracota border-black/5' : 'bg-white dark:bg-oliva-900 border-subtle dark:border-subtle-dark'
      }`}
    >
      <span
        className={
          active
            ? 'text-white font-sans-bold text-[11px] leading-none whitespace-nowrap'
            : 'text-oliva dark:text-cream font-sans-bold text-[11px] leading-none whitespace-nowrap'
        }
      >
        {label}
      </span>
    </button>
  );
}
