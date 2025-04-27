'use client';

import * as React from 'react';
import * as SliderPrimitive from '@radix-ui/react-slider';
import { cn } from '@/lib/utils';
import { FaSmile, FaFrown } from 'react-icons/fa';

interface SentimentSliderProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string;
  value: number;
  onChange: (value: number) => void;
  gradientFrom: string;
  gradientTo: string;
  negativeLabel?: string;
  positiveLabel?: string;
  steps?: number;
}

export function SentimentSlider({
  name,
  value,
  onChange,
  gradientFrom,
  gradientTo,
  negativeLabel = 'Negative',
  positiveLabel = 'Positive',
  steps = 10,
  className,
  ...props
}: SentimentSliderProps) {
  // Calculate if the current value indicates positive sentiment (value > half of scale)
  const isPositive = value > steps / 2;
  const neutralPoint = steps / 2;

  // Get percentage for track gradient effect
  const percentage = Math.round((value / steps) * 100);

  return (
    <div className={cn('space-y-5 w-full', className)} {...props}>
      <div className='flex justify-between items-center text-sm text-white/80 mb-2'>
        <div className='flex items-center space-x-2'>
          <FaFrown className='text-red-500' />
          <span>{negativeLabel}</span>
        </div>
        <div className='flex items-center space-x-2'>
          <span>{positiveLabel}</span>
          <FaSmile className='text-green-500' />
        </div>
      </div>

      <div className='relative'>
        <SliderPrimitive.Root
          id={name}
          min={0}
          max={steps}
          step={1}
          value={[value]}
          onValueChange={(values) => onChange(values[0])}
          className='relative flex w-full touch-none select-none items-center'
        >
          {/* Custom track with gradient background */}
          <SliderPrimitive.Track className='relative h-3 w-full grow overflow-hidden rounded-full'>
            <div
              className='absolute inset-0 w-full h-full'
              style={{
                background: `linear-gradient(to right, #F87171, #FBCFE8 ${neutralPoint * 10}%, #86EFAC, #34D399)`,
                opacity: 0.3,
              }}
            />
            {/* Active range with dynamic gradient based on value */}
            <SliderPrimitive.Range
              className='absolute h-full'
              style={{
                background:
                  value === 0
                    ? 'transparent'
                    : isPositive
                      ? `linear-gradient(to right, #FBCFE8, ${gradientTo})`
                      : `linear-gradient(to right, ${gradientFrom}, #FBCFE8)`,
              }}
            />
          </SliderPrimitive.Track>

          {/* Thumb with dynamic styling based on sentiment */}
          <SliderPrimitive.Thumb
            className='block h-6 w-6 rounded-full shadow-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50'
            style={{
              background:
                value === 0
                  ? 'rgba(255, 255, 255, 0.3)'
                  : isPositive
                    ? gradientTo
                    : gradientFrom,
              border: '2px solid rgba(255, 255, 255, 0.8)',
            }}
          />
        </SliderPrimitive.Root>
      </div>

      {/* Value indicators */}
      <div className='flex justify-between items-center w-full mt-1'>
        {Array.from({ length: steps + 1 }, (_, i) => (
          <div key={i} className='flex flex-col items-center'>
            <span
              className={cn(
                'text-xs',
                value === i ? 'text-white font-medium' : 'text-white/60',
                i === neutralPoint && 'text-white/90',
              )}
            >
              {i === 0
                ? '0'
                : i === neutralPoint
                  ? 'Neutral'
                  : i === steps
                    ? steps
                    : ''}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SentimentSlider;
