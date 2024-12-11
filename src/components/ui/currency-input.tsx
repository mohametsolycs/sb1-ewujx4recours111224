import React from 'react';
import { Input } from './input';
import { cn } from '../../lib/utils';

interface CurrencyInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  value: number;
  onChange: (value: number) => void;
  className?: string;
}

export function CurrencyInput({ value, onChange, className, ...props }: CurrencyInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/[^0-9]/g, '');
    const numericValue = rawValue ? parseInt(rawValue, 10) : 0;
    onChange(numericValue);
  };

  const formattedValue = new Intl.NumberFormat('fr-FR', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);

  return (
    <div className="relative">
      <Input
        {...props}
        type="text"
        value={formattedValue}
        onChange={handleChange}
        className={cn("pl-16", className)}
      />
      <div className="absolute inset-y-0 left-0 flex items-center px-3 pointer-events-none text-gray-500 border-r">
        XOF
      </div>
    </div>
  );
}