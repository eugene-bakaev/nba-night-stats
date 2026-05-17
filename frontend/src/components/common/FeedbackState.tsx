import React from 'react';

interface FeedbackStateProps {
  loading: boolean;
  error: string | null;
  isEmpty: boolean;
}

export const FeedbackState: React.FC<FeedbackStateProps> = ({ loading, error, isEmpty }) => {
  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-64 md:h-96 space-y-4 md:space-y-8">
        <div className="animate-spin rounded-full h-12 w-12 md:h-20 md:w-20 border-t-4 border-r-4 border-blue-600"></div>
        <span className="text-[10px] md:text-sm font-black text-slate-400 uppercase tracking-[0.4em] md:tracking-[0.6em] animate-pulse">Scanning Court</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-100 text-red-600 p-8 md:p-12 rounded-[2rem] md:rounded-[3.5rem] mb-12 md:mb-16 text-xs md:text-sm font-black uppercase tracking-[0.3em] text-center shadow-sm">
        {error}
      </div>
    );
  }

  if (isEmpty) {
    return (
      <div className="text-slate-400 text-center py-20 md:py-32 font-black uppercase tracking-[0.5em] md:tracking-[0.6em] text-[10px] md:text-sm">
        No Games Today
      </div>
    );
  }

  return null;
};
