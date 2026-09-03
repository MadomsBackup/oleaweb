import React, { InputHTMLAttributes, TextareaHTMLAttributes } from 'react';

type SharedProps = {
  label?: string;
  error?: string;
  onChangeText?: (value: string) => void;
};

interface SingleLineProps
  extends SharedProps,
    Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  multiline?: false;
}

interface MultilineProps
  extends SharedProps,
    Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'onChange'> {
  multiline: true;
}

type Props = SingleLineProps | MultilineProps;

export default function TextField(props: Props) {
  const { label, error, multiline, className, onChangeText, ...rest } = props;

  const baseClasses = `w-full bg-white dark:bg-oliva-900 rounded-2xl px-4 py-3 text-[14px] text-oliva dark:text-cream font-sans border-2 outline-none placeholder:text-muted transition-colors ${
    error ? 'border-red-500' : 'border-subtle dark:border-subtle-dark focus:border-terracota/50'
  } ${className ?? ''}`;

  return (
    <div className="mb-4">
      {label ? (
        <label className="block font-sans-medium text-[12px] text-oliva dark:text-cream mb-1.5">
          {label}
        </label>
      ) : null}
      {multiline ? (
        <textarea
          className={`${baseClasses} min-h-[90px] resize-y`}
          onChange={(e) => onChangeText?.(e.target.value)}
          {...(rest as Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'onChange'>)}
        />
      ) : (
        <input
          className={baseClasses}
          onChange={(e) => onChangeText?.(e.target.value)}
          {...(rest as Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'>)}
        />
      )}
      {error ? <p className="text-red-600 text-[11px] mt-1 font-sans-medium">{error}</p> : null}
    </div>
  );
}
