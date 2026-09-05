import React, { useRef, useState } from 'react';
import Icon from './Icon';
import DurationPicker from './DurationPicker';
import { wrapSelection } from '../utils/richText';

export interface StepRowValue {
  content: string;
  timerSeconds: string;
}

interface Props {
  value: StepRowValue;
  index: number;
  total: number;
  onChange: (value: StepRowValue) => void;
  onRemove: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  error?: string;
}

const FORMAT_BUTTON_CLASS =
  'w-8 h-8 rounded-lg flex items-center justify-center bg-cream dark:bg-oliva-dark border border-subtle dark:border-subtle-dark hover:opacity-70 text-oliva dark:text-cream';

export default function StepFormRow({
  value,
  index,
  total,
  onChange,
  onRemove,
  onMoveUp,
  onMoveDown,
  error,
}: Props) {
  const [selection, setSelection] = useState({ start: 0, end: 0 });
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const applyToken = (token: '**' | '*' | '~~') => {
    const { text, cursor } = wrapSelection(value.content, selection.start, selection.end, token);
    onChange({ ...value, content: text });
    requestAnimationFrame(() => {
      textareaRef.current?.focus();
      textareaRef.current?.setSelectionRange(cursor, cursor);
    });
  };

  return (
    <div className="bg-white dark:bg-oliva-900 rounded-2xl border border-subtle dark:border-subtle-dark p-3.5 mb-3">
      <div className="flex items-center justify-between mb-2">
        <span className="font-sans-bold text-[11px] text-terracota">Paso {index + 1}</span>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={onMoveUp}
            disabled={index === 0}
            className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-cream dark:hover:bg-white/5"
            style={{ opacity: index === 0 ? 0.3 : 1 }}
          >
            <Icon name="keyboard_arrow_up" size={18} className="text-oliva dark:text-cream" />
          </button>
          <button
            type="button"
            onClick={onMoveDown}
            disabled={index === total - 1}
            className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-cream dark:hover:bg-white/5"
            style={{ opacity: index === total - 1 ? 0.3 : 1 }}
          >
            <Icon name="keyboard_arrow_down" size={18} className="text-oliva dark:text-cream" />
          </button>
          <button
            type="button"
            onClick={onRemove}
            className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-cream dark:hover:bg-white/5 ml-1"
          >
            <Icon name="close" size={16} className="text-terracota" />
          </button>
        </div>
      </div>

      <div className="flex mb-2 gap-2">
        <button type="button" onClick={() => applyToken('**')} className={FORMAT_BUTTON_CLASS} title="Negrita">
          <Icon name="format_bold" size={16} />
        </button>
        <button type="button" onClick={() => applyToken('*')} className={FORMAT_BUTTON_CLASS} title="Cursiva">
          <Icon name="format_italic" size={16} />
        </button>
        <button
          type="button"
          onClick={() => applyToken('~~')}
          className={FORMAT_BUTTON_CLASS}
          title="Tachado"
        >
          <Icon name="format_strikethrough" size={16} />
        </button>
      </div>

      <textarea
        ref={textareaRef}
        placeholder="Describe este paso…"
        value={value.content}
        onChange={(e) => onChange({ ...value, content: e.target.value })}
        onSelect={(e) => {
          const t = e.currentTarget;
          setSelection({ start: t.selectionStart, end: t.selectionEnd });
        }}
        className={`w-full text-[13px] text-oliva dark:text-cream font-sans min-h-[60px] border-2 rounded-xl px-2 py-1.5 outline-none resize-y placeholder:text-muted ${
          error ? 'border-red-500' : 'border-subtle dark:border-subtle-dark focus:border-terracota/50'
        }`}
      />
      {error ? <p className="text-red-600 text-[10.5px] font-sans-medium mt-1">{error}</p> : null}

      <div className="mt-3">
        <DurationPicker
          totalSeconds={value.timerSeconds}
          onChange={(timerSeconds) => onChange({ ...value, timerSeconds })}
        />
      </div>
    </div>
  );
}
