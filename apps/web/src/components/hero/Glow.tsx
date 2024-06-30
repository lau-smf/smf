import { useId } from 'react';

export function Glow() {
  let id = useId();

  return (
    <div className='absolute inset-0 -z-10 overflow-hidden bg-gray-950'>
      <svg
        className='absolute -bottom-[10rem] h-[80rem] w-[180%] left-1/2 transform -translate-x-1/2 lg:top-0 lg:bottom-auto'
        aria-hidden='true'
      >
        <defs>
          <radialGradient id={`${id}-desktop`} cy='0%'>
            <stop offset='0%' stopColor='rgba(56, 189, 248, 0.3)' />
            <stop offset='53.95%' stopColor='rgba(0, 71, 255, 0.09)' />
            <stop offset='100%' stopColor='rgba(10, 14, 23, 0)' />
          </radialGradient>
          <radialGradient id={`${id}-mobile`} cy='100%'>
            <stop offset='0%' stopColor='rgba(56, 189, 248, 0.3)' />
            <stop offset='53.95%' stopColor='rgba(0, 71, 255, 0.09)' />
            <stop offset='100%' stopColor='rgba(10, 14, 23, 0)' />
          </radialGradient>
        </defs>
        <rect
          width='100%'
          height='100%'
          fill={`url(#${id}-desktop)`}
          className='hidden lg:block'
        />
        <rect
          width='100%'
          height='100%'
          fill={`url(#${id}-mobile)`}
          className='lg:hidden'
        />
      </svg>
    </div>
  );
}
