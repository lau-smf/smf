// ChipsGroup.tsx
'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';
import { LucideIcon } from 'lucide-react';

interface ChipsGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  options: { id: string; text: string; icon?: LucideIcon }[];
  name: string;
  selectedValues: Set<string>;
  onChange: (value: string) => void;
  gradientFrom: string;
  gradientTo: string;
}

export function ChipsGroup({
  options,
  name,
  selectedValues,
  onChange,
  gradientFrom,
  gradientTo,
  className,
  ...props
}: ChipsGroupProps) {
  return (
    <div className={cn('flex flex-wrap gap-3', className)} {...props}>
      {options.map((option) => {
        const isSelected = selectedValues?.has?.(option.id) || false;
        const Icon = option.icon;

        return (
          <button
            key={option.id}
            type='button'
            onClick={() => onChange(option.id)}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200',
              'border focus:outline-none focus:ring-2 focus:ring-white/50',
              isSelected
                ? 'text-white shadow-lg scale-105'
                : 'text-white/70 border-white/30 bg-black/30 hover:bg-black/40',
            )}
            style={{
              background: isSelected
                ? `linear-gradient(to right, ${gradientFrom}, ${gradientTo})`
                : undefined,
              borderColor: isSelected ? 'transparent' : undefined,
            }}
          >
            {Icon && <Icon className='h-4 w-4' />}
            <span>{option.text}</span>
          </button>
        );
      })}
    </div>
  );
}

export default ChipsGroup;
