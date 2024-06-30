import { PropsWithChildren } from 'react';

export const ChatBox: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <div
      className={
        'absolute w-[40vw] h-[40vh] bottom-10 left-10 border border-sky-500 rounded-lg bg-transparent backdrop-blur peer z-0'
      }
    >
      <div>{children}</div>
    </div>
  );
};
