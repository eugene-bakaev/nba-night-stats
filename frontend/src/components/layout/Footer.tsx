import React from 'react';

interface FooterProps {
  fetchedAt?: string;
}

export const Footer: React.FC<FooterProps> = ({ fetchedAt }) => {
  return (
    <footer className="mt-20 md:mt-48 pb-16 md:pb-32 flex flex-col items-center space-y-6 md:space-y-10 opacity-30">
      <div className="h-[2px] md:h-[3px] w-12 md:w-16 bg-slate-300 rounded-full"></div>
      {fetchedAt && (
        <p className="text-[8px] md:text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] md:tracking-[0.6em] italic text-center leading-loose">
          Sync State: {fetchedAt}
        </p>
      )}
    </footer>
  );
};
