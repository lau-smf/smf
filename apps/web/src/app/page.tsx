'use client';

import Head from 'next/head';
import * as React from 'react';
import '@/utils/env';

import '@/styles/globals.css';
import { Glow } from '@/components/hero/Glow';
import { StarField } from '@/components/hero/StarField';
import { MusicPlayer } from '@/components/hero/MusicPlayer';
import { HorizontalTimeline } from '@/components/hero/Timeline';
import { HeroComponent } from '@/Hero';
import { RadioGroupComponent } from '@/components/RadioGroupComponent';
import { useGlobalStore } from '@/store/useGlobalStore';
import { cn } from '@/utils/twcn';
import { ShootingStar } from '@/components/star/Star';

export default function HomePage() {
  const experience = useGlobalStore.useExperience();

  return (
    <main className={'overflow-y-hidden'}>
      <Head>
        <title>Home</title>
      </Head>
      <section
        className={
          'relative w-screen h-screen flex flex-col items-center justify-center'
        }
      >
        <ShootingStar />
        <Glow />
        <StarField />
        <MusicPlayer />
        {experience ? (
          <div
            className={cn(
              'w-1/2 h-[70vh] overflow-y-scroll scrollbar-thin scrollbar-thumb-white scrollbar-track-transparent',
              'scrollbar-thumb-rounded-lg scrollbar-thumb-rounded-full scrollbar-track-rounded-full',
            )}
          >
            <RadioGroupComponent
              question={'hello world'}
              answers={[
                'something',
                'something1',
                'something2',
                'something3',
                'something4',
                'something5',
                'something6',
              ]}
            />
          </div>
        ) : (
          <HeroComponent />
        )}
      </section>
      <section
        className={'relative p-4 text-white h-screen w-screen bg-gray-950'}
      >
        <HorizontalTimeline />
        <div className='absolute top-0 inset-y-full right-0 bg-gradient-to-r from-transparent via-blue-500 to-transparent w-full h-px' />
        <div className={'h-full'}>
          <div className={'flex flex-col items-center justify-center h-full'}>
            <p className={'text-center text-white'}>
              Place holder for section two of the page, should be horizontally
              scrollable, and the menu should appear on the y-axis of the
              screen. The screens height should be decreased to less than 100vh.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
