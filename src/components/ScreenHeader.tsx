import React, { ReactNode } from 'react';
import IconButton from './IconButton';

interface ScreenHeaderProps {
  title: string;
  onBack?: () => void;
  left?: ReactNode;
  right?: ReactNode;
  sideWidth?: number;
}

export default function ScreenHeader({ title, onBack, left, right, sideWidth = 64 }: ScreenHeaderProps) {
  return (
    <div className="flex items-center px-5 pt-2 mb-4">
      <div style={{ width: sideWidth }} className="flex items-center justify-start">
        {left ?? (onBack ? <IconButton icon="arrow_back" label="Volver" onClick={onBack} /> : null)}
      </div>
      <div className="flex-1 flex items-center justify-center">
        <h1 className="truncate font-serif-bold text-[16px] text-oliva dark:text-cream">{title}</h1>
      </div>
      <div style={{ width: sideWidth }} className="flex items-center justify-end">
        {right}
      </div>
    </div>
  );
}
