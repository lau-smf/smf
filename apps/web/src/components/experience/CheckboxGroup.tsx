'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Check } from 'lucide-react';

interface CheckboxGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  options: { id: string; text: string }[];
  name: string;
  selectedValues: Set<string>;
  onChange: (value: string) => void;
  gradientFrom: string;
  gradientTo: string;
}

export function CheckboxGroup({
  options,
  name,
  selectedValues,
  onChange,
  gradientFrom,
  gradientTo,
  className,
  ...props
}: CheckboxGroupProps) {
  return (
    <div className={cn('space-y-3', className)} {...props}>
      {options.map((option) => {
        const isSelected = selectedValues.has(option.id);

        return (
          <div key={option.id} className='flex items-center space-x-2'>
            <Checkbox
              id={`${name}-${option.id}`}
              checked={isSelected}
              onCheckedChange={() => onChange(option.id)}
              className={cn(
                'h-5 w-5 rounded-md border',
                isSelected ? 'border-transparent' : 'border-white/30',
              )}
              style={{
                background: isSelected
                  ? `linear-gradient(to right, ${gradientFrom}, ${gradientTo})`
                  : 'rgba(0, 0, 0, 0.5)',
              }}
              icon={
                isSelected ? <Check className='h-3.5 w-3.5 text-white' /> : null
              }
            />
            <Label
              htmlFor={`${name}-${option.id}`}
              className='text-base text-white cursor-pointer transition-colors hover:text-white/90'
            >
              {option.text}
            </Label>
          </div>
        );
      })}
    </div>
  );
}
