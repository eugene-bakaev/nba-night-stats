import React from 'react';
import { UpcomingGame } from '../../types/nba';
import { TeamLogo } from '../common/TeamLogo';
import { formatDateShort } from '../../utils/dates';

interface UpcomingSectionProps {
  games: UpcomingGame[];
}

export const UpcomingSection: React.FC<UpcomingSectionProps> = ({ games }) => {
  if (!games || games.length === 0) return null;

  // Group games by date
  const grouped = games.reduce((acc, game) => {
    if (!acc[game.game_date]) acc[game.game_date] = [];
    acc[game.game_date].push(game);
    return acc;
  }, {} as Record<string, UpcomingGame[]>);

  return (
    <div className="mt-20 md:mt-32">
      <div className="flex items-center space-x-4 mb-12 opacity-60">
        <div className="h-px flex-1 bg-slate-300"></div>
        <h2 className="text-[10px] md:text-xs font-black uppercase tracking-[0.4em] text-slate-500 whitespace-nowrap">
          Next Up
        </h2>
        <div className="h-px flex-1 bg-slate-300"></div>
      </div>

      <div className="space-y-12">
        {Object.entries(grouped).map(([date, dayGames]) => (
          <div key={date} className="space-y-4">
            <div className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 ml-2">
              {formatDateShort(date)}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {dayGames.map((game, idx) => (
                <div key={idx} className="bg-white rounded-[1.5rem] md:rounded-[2rem] p-4 md:p-6 border border-slate-200 shadow-sm flex items-center justify-between group hover:border-blue-200 transition-all cursor-default">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center -space-x-3">
                      {game.teams.map((team, tIdx) => (
                        <TeamLogo 
                          key={tIdx} 
                          teamCode={team} 
                          sizeClass="w-10 h-10 md:w-12 md:h-12" 
                          paddingClass="p-1.5"
                          className={`${tIdx === 1 ? 'z-10' : 'z-0'} border-2 border-white`} 
                        />
                      ))}
                    </div>
                    <div className="text-[11px] md:text-sm font-black text-slate-700 uppercase tracking-tight">
                      {game.teams[0]} <span className="text-slate-400 mx-1">@</span> {game.teams[1]}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] md:text-xs font-black text-blue-600 uppercase tracking-wider">{game.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
