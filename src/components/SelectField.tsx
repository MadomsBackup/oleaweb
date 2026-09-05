import React, { SelectHTMLAttributes } from 'react';
import Icon from './Icon';

interface Option {
  value: string;
  label: string;
}

interface Props extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
  label?: string;
  options: Option[];
  placeholder?: string;
  onChangeValue?: (value: string) => void;
}

export default function SelectField({ label, options, placeholder, onChangeValue, className, ...rest }: Props) {
  return (
    <div className="mb-4">
      {label ? (
        <label className="block font-sans-medium text-[12px] text-oliva dark:text-cream mb-1.5">{label}</label>
      ) : null}
      <div className="relative">
        <select
          className={`w-full appearance-none bg-white dark:bg-oliva-900 rounded-2xl pl-4 pr-10 py-3 text-[14px] text-oliva dark:text-cream font-sans border-2 border-subtle dark:border-subtle-dark outline-none focus:border-terracota/50 transition-colors ${className ?? ''}`}
          onChange={(e) => onChangeValue?.(e.target.value)}
          {...rest}
        >
          {placeholder ? <option value="">{placeholder}</option> : null}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <Icon
          name="expand_more"
          size={18}
          className="text-muted pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2"
        />
      </div>
    </div>
  );
}
