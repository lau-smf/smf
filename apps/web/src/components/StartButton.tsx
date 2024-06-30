import { useGlobalStore } from '@/store/useGlobalStore';

export const StartButton = () => {
  const setExperience = useGlobalStore.useSetExperience();

  return (
    <button
      className='bg-transparent flex justify-center items-center relative cursor-pointer pointer-events-auto m-5 group' // loader__item
      onClick={() => setExperience(true)}
    >
      <svg
        className='origin-center transition transform duration-500 svg_animation w-[180px] h-[180px] pointer-events-none' // loader__Svg
        viewBox='0 0 306.5 306.5'
        xmlns='http://www.w3.org/2000/svg'
      >
        <g
          className='opacity-1 pointer-events-none' //  loader__loaded
        >
          {/*  <!-- circle dots --> */}
          <g
            className='origin-center animate-dots' // loaded__dots-g
          >
            <path
              className={'stroke-white opacity-75 fill-none origin-top-left'} // loaded__dots
              strokeDasharray={'0.8, 5'}
              d='M289.1,83.9c-4.9-9.7-10.9-18.7-17.7-27.1c-2.7-3.3-5.6-6.6-8.6-9.7 M44.5,260.2c13.6,13.9,29.9,25.1,48,33c18.6,8.1,39.1,12.6,60.7,12.6c10.9,0,21.5-1.1,31.7-3.3c7.5-1.6,14.8-3.7,21.8-6.3c2.5-0.9,4.9-1.9,7.3-2.9c9.3-4.1,18.2-9,26.4-14.8c22.3-15.5,40.2-36.9,51.6-61.8c2.2-4.7,4.1-9.6,5.8-14.5c1-3,2-6.1,2.8-9.2 M70.7,25c-8.3,5.3-16,11.5-23.1,18.3 M40.2,50.9c-9,9.9-16.7,21-22.8,33C6.7,104.7,0.8,128.3,0.8,153.2c0,27.6,7.4,53.6,20.2,75.9 M120.2,4.3c10.6-2.3,21.7-3.6,33-3.6c23.9,0,46.5,5.5,66.7,15.3c7.2,3.5,14,7.5,20.5,12'
              vectorEffect='non-scaling-stroke'
              data-svg-origin='150.6999939084053 153.2500033378601'
              transform='matrix(1.2,0,0,1.2,-30.14,-30.65)'
            ></path>
          </g>

          {/* <!-- circle rings --> */}
          <g
            className='origin-center transition-all transform scale-100 ease-custom group-hover:scale-90 duration-1000' // loaded__circles
          >
            <circle // loaded__circle
              className='stroke-[#565E7B] opacity-100 origin-top-left fill-none stroke-2 group-hover:stroke-sky-500 transition-colors duration-500 ease-custom' // loaded__circle
              cx='153.2'
              cy='153.2'
              r='152.5'
              vectorEffect='non-scaling-stroke'
              data-svg-origin='153.1999969482422 153.1999969482422'
              transform='matrix(1,0,0,1,0,0)'
            />
            <circle // loaded__circle
              className='stroke-[#565E7B] opacity-80 origin-top-left fill-none stroke-2 group-hover:stroke-sky-500 transition-colors duration-500 ease-custom'
              cx='153.2'
              cy='153.2'
              r='152.5'
              vectorEffect='non-scaling-stroke'
              data-svg-origin='153.1999969482422 153.1999969482422'
              transform='matrix(0.97,0,0,0.97,4.596,4.596)'
            />
            <circle // loaded__circle
              className='stroke-[#565E7B] opacity-60 origin-top-left fill-none stroke-2 group-hover:stroke-sky-500 transition-colors duration-500 ease-custom'
              cx='153.2'
              cy='153.2'
              r='152.5'
              vectorEffect='non-scaling-stroke'
              data-svg-origin='153.1999969482422 153.1999969482422'
              transform='matrix(0.94,0,0,0.94,9.192,9.192)'
            />
            <circle // loaded__circle
              cx='153.2'
              cy='153.2'
              r='152.5'
              vectorEffect='non-scaling-stroke'
              className='stroke-[#565E7B] opacity-40 origin-top-left fill-none stroke-2 group-hover:stroke-sky-500 transition-colors duration-500 ease-custom'
              data-svg-origin='153.1999969482422 153.1999969482422'
              transform='matrix(0.91,0,0,0.91,13.788,13.788)'
            />
            <circle // loaded__circle
              className='stroke-[#565E7B] opacity-20 origin-top-left fill-none stroke-2 group-hover:stroke-sky-500 transition-colors duration-500 ease-custom'
              cx='153.2'
              cy='153.2'
              r='152.5'
              vectorEffect='non-scaling-stroke'
              data-svg-origin='153.1999969482422 153.1999969482422'
              transform='matrix(0.88,0,0,0.88,18.384,18.384)'
            />
          </g>
        </g>
      </svg>

      {/* <!-- Circle Text -->  */}
      <div
        className={'text-gray-100 absolute top-1/2 left-1/2 uppercase'} // loader__center
        style={{
          transform: 'translate3d(-50%, -50%, 0)',
          transition: 'opacity 0.4s cubic-bezier(.5, 1, .89, 1)',
        }}
      >
        <p
          className='transition-none text-md font-medium tracking-widest leading-none' // loader__start
          data-animation='text'
        >
          <div
            style={{
              position: 'relative',
              display: 'inline-block',
            }}
          >
            <div
              style={{
                position: 'relative',
                display: 'inline-block',
                transform: 'translate(0px)',
              }}
            >
              b
            </div>
            <div
              style={{
                position: 'relative',
                display: 'inline-block',
                transform: 'translate(0px)',
              }}
            >
              e
            </div>
            <div
              style={{
                position: 'relative',
                display: 'inline-block',
                transform: 'translate(0px)',
              }}
            >
              g
            </div>
            <div
              style={{
                position: 'relative',
                display: 'inline-block',
                transform: 'translate(0px)',
              }}
            >
              i
            </div>
            <div
              style={{
                position: 'relative',
                display: 'inline-block',
                transform: 'translate(0px)',
              }}
            >
              n
            </div>
          </div>
        </p>
      </div>
    </button>
  );
};
