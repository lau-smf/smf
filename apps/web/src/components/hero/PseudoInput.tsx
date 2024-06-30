import React from 'react';
import { cn } from '@/utils/twcn';
import Typewriter from 'typewriter-effect';

export const PseudoInput = () => {
  const [input, setInput] = React.useState('');

  return (
    <div
      className={cn(
        'relative flex items-center justify-center h-11 w-1/4 pl-4 text-gray-400 text-md border border-sky-500 rounded-lg bg-transparent backdrop-blur peer',
      )}
    >
      <Typewriter
        options={{
          strings: [
            'I want to be a doctor!',
            'Should I study engineering?',
            "I'm interested in computer science.",
          ],
          autoStart: true,
          loop: true,
        }}
      />
    </div>
  );
};
