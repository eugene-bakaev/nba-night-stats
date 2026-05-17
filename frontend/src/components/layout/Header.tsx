import React from 'react';

interface HeaderProps {
  date: string;
  refreshing: boolean;
  onRefresh: () => void;
  disabled: boolean;
}

export const Header: React.FC<HeaderProps> = ({ date, refreshing, onRefresh, disabled }) => {
  return (
    <header className="flex justify-between items-center mb-16 md:mb-32 bg-white p-5 md:p-8 rounded-[2rem] md:rounded-[3.5rem] shadow-sm border border-slate-200">
      <div>
        <h1 className="text-2xl md:text-4xl font-black tracking-tighter uppercase text-slate-800">
          NBA <span className="text-blue-600 italic">Night</span>
        </h1>
        <p className="text-[10px] md:text-[12px] uppercase tracking-[0.5em] md:tracking-[0.5em] font-black text-slate-400 mt-1 md:mt-2">
          {date || 'SYNCING...'}
        </p>
      </div>
      <button 
        onClick={onRefresh}
        disabled={disabled}
        className={`p-3 md:p-5 rounded-[1.2rem] md:rounded-[2rem] bg-slate-50 border border-slate-200 text-blue-600 transition-all ${refreshing ? 'animate-spin opacity-50' : 'active:scale-90'}`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 md:h-8 md:w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      </button>
    </header>
  );
};
