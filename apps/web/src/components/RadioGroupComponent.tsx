import { useState } from 'react';
import { RadioGroup } from '@headlessui/react';
import { cn } from '@/utils/twcn';

const settings = [
  {
    name: 'Public access',
    description: 'This project would be available to anyone who has the link',
  },
  {
    name: 'Private to Project Members',
    description: 'Only members of this project would be able to access',
  },
  {
    name: 'Private to you',
    description: 'You are the only one able to access this project',
  },
];

export interface RadioGroupComponent {
  question: string;
  answers: string[];
}

export function RadioGroupComponent({
  question,
  answers,
}: RadioGroupComponent) {
  const [selected, setSelected] = useState(answers[0]);

  return (
    <RadioGroup value={selected} onChange={setSelected}>
      <RadioGroup.Label className='sr-only'>{question}</RadioGroup.Label>
      <div className='space-y-5 rounded-md w-full bg-transparent'>
        {answers.map((setting, settingIdx) => (
          <RadioGroup.Option
            key={setting}
            value={setting}
            className={({ checked }) =>
              cn(
                'relative flex cursor-pointer px-4 py-5 bg-black rounded-lg opacity-100 backdrop-blur mx-4',
                ' bg-transparent border border-gray-500 focus:outline-none',
                'rounded-lg bg-white/2.5 ring-1 ring-white/15',
                checked && 'border-sky-500',
                'hover:border-sky-500',
              )
            }
          >
            {({ active, checked }) => (
              <RadioGroup.Label
                as='span'
                className={cn(
                  'block text-sm font-medium ml-3 text-white opacity-100',
                )}
              >
                {setting}
              </RadioGroup.Label>
            )}
          </RadioGroup.Option>
        ))}
      </div>
    </RadioGroup>
  );
}
