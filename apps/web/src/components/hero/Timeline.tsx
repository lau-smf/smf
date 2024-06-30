import { useId } from 'react';

export function Timeline() {
  // eslint-disable-next-line no-undef
  let id = useId();

  return (
    <div className='pointer-events-none absolute inset-0 z-50 overflow-hidden lg:right-[calc(max(2rem,50%-38rem)+40rem)] lg:min-w-[32rem] lg:overflow-visible'>
      <svg
        className='absolute left-[max(0px,calc(50%-18.125rem))] top-0 h-full w-1.5 lg:left-full lg:ml-1 xl:left-auto xl:right-1 xl:ml-0'
        aria-hidden='true'
      >
        <defs>
          <pattern id={id} width='6' height='8' patternUnits='userSpaceOnUse'>
            <path
              d='M0 0H6M0 8H6'
              className='stroke-sky-900/10 xl:stroke-white/10 dark:stroke-white/10'
              fill='none'
            />
          </pattern>
        </defs>
        <rect width='100%' height='100%' fill={`url(#${id})`} />
      </svg>
    </div>
  );
}

export const HorizontalTimeline = () => {
  let id = useId();
  let maskId = `mask-${id}`;

  return (
    <div className='pointer-events-none absolute inset-0 z-50 overflow-hidden bottom-0 lg:min-h-[32rem] lg:overflow-visible'>
      <svg
        className='absolute left-0 top-0 h-2 w-full lg:mt-1'
        aria-hidden='true'
      >
        <defs>
          <pattern id={id} width='8' height='6' patternUnits='userSpaceOnUse'>
            <path
              d='M0 0V6M8 0V6'
              className='stroke-current text-white'
              fill='none'
            />
          </pattern>

          <linearGradient
            id='gradient'
            gradientUnits='userSpaceOnUse'
            x1='0%'
            y1='0%'
            x2='100%'
            y2='0%'
          >
            <stop offset='0%' stopColor='white' stopOpacity='0' />
            <stop offset='50%' stopColor='white' stopOpacity='1' />
            <stop offset='100%' stopColor='white' stopOpacity='0' />
          </linearGradient>

          <mask id={maskId}>
            <rect
              x='0'
              y='0'
              width='100%'
              height='100%'
              fill='url(#gradient)'
            />
          </mask>
        </defs>
        <rect
          width='100%'
          height='100%'
          fill={`url(#${id})`}
          fillOpacity='0.4'
          mask={`url(#${maskId})`}
        />
      </svg>
    </div>
  );
};
