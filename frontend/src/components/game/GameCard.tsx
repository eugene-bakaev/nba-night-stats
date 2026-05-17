import React from 'react';
import { Game } from '../../types/nba';
import { TeamLogo } from '../common/TeamLogo';
import { getStripedBackground } from '../../utils/theme';
import { getTeamInfo } from '../../utils/theme';

interface GameCardProps {
  game: Game;
  isExpanded: boolean;
  onToggle: () => void;
}

export const GameCard: React.FC<GameCardProps> = ({ game, isExpanded, onToggle }) => {
  const [t1, t2] = game.teams;
  const info1 = getTeamInfo(t1);
  const info2 = getTeamInfo(t2);

  return (
    <div className="flex flex-col">
      <div 
        onClick={onToggle}
        className="relative flex items-center justify-between px-2 md:px-6 cursor-pointer group"
      >
        {/* Connecting Bars with Stripes */}
        <div className="absolute inset-x-12 md:inset-x-28 top-1/2 -translate-y-1/2 h-10 md:h-20 flex items-center justify-between z-0">
          <div className="w-[40%] h-full rounded-l-full shadow-inner" 
               style={{ background: getStripedBackground(info1?.colors || []) }}></div>
          <div className="w-[40%] h-full rounded-r-full shadow-inner" 
               style={{ background: getStripedBackground(info2?.colors || []) }}></div>
        </div>

        {/* Team 1 Logo */}
        <TeamLogo 
          teamCode={t1} 
          sizeClass="w-20 h-20 md:w-44 md:h-44"
          paddingClass="p-4 md:p-8"
          className="!rounded-[2rem] md:!rounded-[4rem] border-2 shadow-md group-active:scale-95 transition-transform" 
        />

        {/* Center DIF Box */}
        <div className={`relative z-20 flex flex-col items-center justify-center min-w-[80px] md:min-w-[160px] h-16 md:h-32 rounded-2xl md:rounded-[2.5rem] shadow-2xl border transition-all duration-300 ${isExpanded ? 'bg-blue-600 border-blue-500' : 'bg-slate-900 border-slate-800'}`}>
          <span className="text-3xl md:text-6xl font-[1000] tracking-tighter text-white leading-none">{game.delta}</span>
          <span className={`text-[8px] md:text-xs font-black uppercase tracking-[0.25em] mt-1 transition-colors ${isExpanded ? 'text-blue-100' : 'text-slate-500'}`}>DIF</span>
        </div>

        {/* Team 2 Logo */}
        <TeamLogo 
          teamCode={t2} 
          sizeClass="w-20 h-20 md:w-44 md:h-44"
          paddingClass="p-4 md:p-8"
          className="!rounded-[2rem] md:!rounded-[4rem] border-2 shadow-md group-active:scale-95 transition-transform" 
        />
      </div>

      {/* Sliding Quarter Panel */}
      <div className={`grid transition-all duration-500 ease-in-out ${isExpanded ? 'grid-rows-[1fr] opacity-100 mt-8' : 'grid-rows-[0fr] opacity-0 mt-0'}`}>
        <div className="overflow-hidden">
          <div className="flex justify-center space-x-2 md:space-x-4 px-4 pb-4">
            {game.period_deltas.map((p) => (
              <div key={p.period} className="flex flex-col items-center bg-white border border-slate-200 rounded-2xl p-3 md:p-5 shadow-sm min-w-[60px] md:min-w-[100px]">
                <span className="text-xs md:text-sm font-black text-slate-400 uppercase tracking-widest">Q{p.period}</span>
                <span className="text-xl md:text-3xl font-black text-slate-800 tabular-nums">{p.delta}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
