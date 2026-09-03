import React from 'react';
import Icon from './Icon';

interface Props {
  icon?: string;
  title: string;
  subtitle?: string;
}

export default function EmptyState({ icon = 'eco', title, subtitle }: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-8 text-center">
      <div className="w-14 h-14 rounded-full bg-white dark:bg-oliva-900 border border-subtle dark:border-subtle-dark flex items-center justify-center mb-1">
        <Icon name={icon} size={26} className="text-terracota" />
      </div>
      <p className="font-serif-bold text-[16px] text-oliva dark:text-cream mt-3">{title}</p>
      {subtitle ? <p className="font-sans text-[12px] text-muted mt-1.5">{subtitle}</p> : null}
    </div>
  );
}
