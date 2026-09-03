import React, { useEffect, useRef, useState } from 'react';
import Icon from './Icon';

function format(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
  const s = Math.floor(totalSeconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

export default function Timer({ seconds }: { seconds: number }) {
  const [remaining, setRemaining] = useState(seconds);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    setRemaining(seconds);
    setRunning(false);
  }, [seconds]);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setRemaining((prev) => {
          if (prev <= 1) {
            setRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [running]);

  return (
    <div className="flex items-center self-center bg-oliva dark:bg-terracota rounded-full pl-4 pr-1.5 py-1.5 mt-4 mx-auto w-fit border border-black/10">
      <Icon name="timer" size={16} className="text-white mr-1.5" />
      <span className="text-white font-sans-bold text-[14px] mr-2 tabular-nums">{format(remaining)}</span>
      <button
        type="button"
        onClick={() => {
          if (remaining === 0) setRemaining(seconds);
          setRunning((r) => !r);
        }}
        className="w-8 h-8 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center"
      >
        <Icon name={running ? 'pause' : 'play_arrow'} size={18} filled className="text-white" />
      </button>
    </div>
  );
}
