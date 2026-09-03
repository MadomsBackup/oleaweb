import React, { ReactNode, useEffect } from 'react';
import IconButton from './IconButton';

interface Props {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
}

export default function Modal({ open, onClose, title, children }: Props) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-5"
      style={{ backgroundColor: 'rgba(46,44,30,0.45)' }}
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm bg-white dark:bg-oliva-900 rounded-3xl border border-subtle dark:border-subtle-dark shadow-lg p-5 animate-[modalIn_0.15s_ease-out]"
      >
        <div className="flex items-start justify-between mb-3">
          {title ? (
            <h2 className="font-serif-bold text-[16px] text-oliva dark:text-cream pr-4">{title}</h2>
          ) : (
            <div />
          )}
          <IconButton icon="close" size="sm" label="Cerrar" onClick={onClose} className="-mr-1 -mt-1" />
        </div>
        {children}
      </div>
    </div>
  );
}
