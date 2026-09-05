import React from 'react';
import Icon from './Icon';

interface Props {
  /** Total en segundos, como string (mismo formato que se guarda/envía al backend). Vacío = sin temporizador. */
  totalSeconds: string;
  onChange: (totalSeconds: string) => void;
}

/**
 * Antes había un solo input de texto "en segundos", fácil de confundir
 * con minutos (alguien escribía "40" pensando en 40 minutos y en
 * realidad quedaban 40 segundos). Este picker separa minutos y segundos
 * en dos campos con su unidad al lado, sin ambigüedad posible.
 */
export default function DurationPicker({ totalSeconds, onChange }: Props) {
  const total = Number(totalSeconds) || 0;
  const minutes = Math.floor(total / 60);
  const seconds = total % 60;

  const update = (newMinutes: number, newSeconds: number) => {
    const clampedMinutes = Math.max(0, Math.min(180, newMinutes || 0));
    const clampedSeconds = Math.max(0, Math.min(59, newSeconds || 0));
    const newTotal = clampedMinutes * 60 + clampedSeconds;
    onChange(newTotal > 0 ? String(newTotal) : '');
  };

  return (
    <div>
      <p className="flex items-center gap-1 font-sans-medium text-[11px] text-oliva dark:text-cream mb-1.5">
        <Icon name="timer" size={14} className="text-muted" />
        Temporizador (opcional)
      </p>
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1.5 bg-cream dark:bg-oliva-dark rounded-xl px-3 py-1.5 border border-subtle dark:border-subtle-dark">
          <input
            type="number"
            min={0}
            max={180}
            inputMode="numeric"
            placeholder="0"
            value={minutes || ''}
            onChange={(e) => update(Number(e.target.value), seconds)}
            className="w-10 bg-transparent text-[13px] text-oliva dark:text-cream font-sans-bold outline-none text-right"
          />
          <span className="text-[11px] text-muted font-sans">min</span>
        </div>
        <div className="flex items-center gap-1.5 bg-cream dark:bg-oliva-dark rounded-xl px-3 py-1.5 border border-subtle dark:border-subtle-dark">
          <input
            type="number"
            min={0}
            max={59}
            inputMode="numeric"
            placeholder="0"
            value={seconds || ''}
            onChange={(e) => update(minutes, Number(e.target.value))}
            className="w-10 bg-transparent text-[13px] text-oliva dark:text-cream font-sans-bold outline-none text-right"
          />
          <span className="text-[11px] text-muted font-sans">seg</span>
        </div>
        {total > 0 ? (
          <button
            type="button"
            onClick={() => onChange('')}
            className="text-[11px] text-terracota font-sans-bold hover:opacity-70"
          >
            Quitar
          </button>
        ) : null}
      </div>
    </div>
  );
}
