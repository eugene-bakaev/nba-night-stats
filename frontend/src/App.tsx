import { useState, useEffect } from 'react'
import teamData from './team_colors.json'

interface TeamInfo {
  colors: string[];
  logo: string;
}

interface PeriodDelta {
  period: number;
  delta: number;
}

interface Game {
  teams: [string, string];
  delta: number;
  period_deltas: PeriodDelta[];
}

interface UpcomingGame {
  teams: string[];
  time: string;
  game_date: string;
  status: string;
}

interface ApiResponse {
  games: Game[];
  game_date: string;
  fetched_at: string;
  upcoming_date?: string;
  upcoming_games: UpcomingGame[];
  error?: string;
}

const UpcomingSection = ({ games }: { games: UpcomingGame[] }) => {
  if (!games || games.length === 0) return null;

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    } catch (e) {
      return dateStr;
    }
  };

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
              {formatDate(date)}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {dayGames.map((game, idx) => (
                <div key={idx} className="bg-white rounded-[1.5rem] md:rounded-[2rem] p-4 md:p-6 border border-slate-200 shadow-sm flex items-center justify-between group hover:border-blue-200 transition-all cursor-default">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center -space-x-2">
                      {game.teams.map((team, tIdx) => (
                        <div key={tIdx} className={`w-8 h-8 md:w-10 md:h-10 rounded-full border-2 border-white overflow-hidden flex items-center justify-center bg-slate-50 shadow-sm ${tIdx === 1 ? 'z-10' : 'z-0'}`}>
                          {team !== "TBD" ? (
                            <img src={`/logos/${team}.svg`} className="w-full h-full object-contain p-1" alt={team} />
                          ) : (
                            <span className="text-[8px] font-black text-slate-300">TBD</span>
                          )}
                        </div>
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

const getStripedBackground = (colors: string[]) => {
  if (!colors || colors.length === 0) return '#e2e8f0'; 
  if (colors.length === 1) return colors[0];
  
  const step = 100 / colors.length;
  const stops = colors.map((color, i) => {
    return `${color} ${i * step}%, ${color} ${(i + 1) * step}%`;
  }).join(', ');
  
  return `linear-gradient(to bottom, ${stops})`;
};

function App() {
  const [data, setData] = useState<ApiResponse>({ games: [], game_date: '', fetched_at: '' })
  const [loading, setLoading] = useState<boolean>(true)
  const [refreshing, setRefreshing] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null)

  const fetchData = async (force = false) => {
    if (force) setRefreshing(true);
    else setLoading(true);
    
    setError(null);
    
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      const response = await fetch(`${apiUrl}/api/deltas${force ? '?force=true' : ''}`);
      
      if (!response.ok) throw new Error('Failed to fetch data');
      
      const result: ApiResponse = await response.json();
      if (result.error) throw new Error(result.error);
      
      setData({
        games: result.games || [],
        game_date: result.game_date || '',
        fetched_at: result.fetched_at || '',
        upcoming_date: result.upcoming_date,
        upcoming_games: result.upcoming_games || []
      });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, [])

  const toggleExpand = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  }

  const games = data.games || [];

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 p-4 md:p-16 font-sans">
      <div className="max-w-2xl mx-auto">
        <header className="flex justify-between items-center mb-16 md:mb-32 bg-white p-5 md:p-8 rounded-[2rem] md:rounded-[3.5rem] shadow-sm border border-slate-200">
          <div>
            <h1 className="text-2xl md:text-4xl font-black tracking-tighter uppercase text-slate-800">NBA <span className="text-blue-600 italic">Night</span></h1>
            <p className="text-[10px] md:text-[12px] uppercase tracking-[0.5em] md:tracking-[0.5em] font-black text-slate-400 mt-1 md:mt-2">{data.game_date || 'SYNCING...'}</p>
          </div>
          <button 
            onClick={() => fetchData(true)}
            disabled={loading || refreshing}
            className={`p-3 md:p-5 rounded-[1.2rem] md:rounded-[2rem] bg-slate-50 border border-slate-200 text-blue-600 transition-all ${refreshing ? 'animate-spin opacity-50' : 'active:scale-90'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 md:h-8 md:w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </header>

        {loading && !refreshing && (
          <div className="flex flex-col justify-center items-center h-64 md:h-96 space-y-4 md:space-y-8">
            <div className="animate-spin rounded-full h-12 w-12 md:h-20 md:w-20 border-t-4 border-r-4 border-blue-600"></div>
            <span className="text-[10px] md:text-sm font-black text-slate-400 uppercase tracking-[0.4em] md:tracking-[0.6em] animate-pulse">Scanning Court</span>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-100 text-red-600 p-8 md:p-12 rounded-[2rem] md:rounded-[3.5rem] mb-12 md:mb-16 text-xs md:text-sm font-black uppercase tracking-[0.3em] text-center shadow-sm">
            {error}
          </div>
        )}

        {!loading && games.length === 0 && !error && (
          <div className="text-slate-400 text-center py-20 md:py-32 font-black uppercase tracking-[0.5em] md:tracking-[0.6em] text-[10px] md:text-sm">
            No Games Today
          </div>
        )}

        <div className={`space-y-12 md:space-y-28 transition-all duration-700 ${refreshing ? 'opacity-20 blur-xl' : 'opacity-100'}`}>
          {games.map((game, index) => {
            const [t1, t2] = game.teams;
            const info1 = (teamData as Record<string, TeamInfo>)[t1];
            const info2 = (teamData as Record<string, TeamInfo>)[t2];
            const isExpanded = expandedIndex === index;

            return (
              <div key={index} className="flex flex-col">
                <div 
                  onClick={() => toggleExpand(index)}
                  className="relative flex items-center justify-between px-2 md:px-6 cursor-pointer group"
                >
                  {/* Connecting Bars with Stripes */}
                  <div className="absolute inset-x-12 md:inset-x-28 top-1/2 -translate-y-1/2 h-10 md:h-20 flex items-center justify-between z-0">
                    <div className="w-[40%] h-full rounded-l-full shadow-inner" 
                         style={{ background: getStripedBackground(info1?.colors) }}></div>
                    <div className="w-[40%] h-full rounded-r-full shadow-inner" 
                         style={{ background: getStripedBackground(info2?.colors) }}></div>
                  </div>

                  {/* Team 1 Logo */}
                  <div className="relative z-10 w-20 h-20 md:w-44 md:h-44 bg-white rounded-[2rem] md:rounded-[4rem] border-2 border-slate-200 p-4 md:p-8 flex items-center justify-center shadow-md group-active:scale-95 transition-transform">
                    <img src={info1?.logo} alt={t1} className="w-12 h-12 md:w-28 md:h-28 object-contain" />
                  </div>

                  {/* Center DIF Box */}
                  <div className={`relative z-20 flex flex-col items-center justify-center min-w-[80px] md:min-w-[160px] h-16 md:h-32 rounded-2xl md:rounded-[2.5rem] shadow-2xl border transition-all duration-300 ${isExpanded ? 'bg-blue-600 border-blue-500' : 'bg-slate-900 border-slate-800'}`}>
                    <span className="text-3xl md:text-6xl font-[1000] tracking-tighter text-white leading-none">{game.delta}</span>
                    <span className={`text-[8px] md:text-xs font-black uppercase tracking-[0.25em] mt-1 transition-colors ${isExpanded ? 'text-blue-100' : 'text-slate-500'}`}>DIF</span>
                  </div>

                  {/* Team 2 Logo */}
                  <div className="relative z-10 w-20 h-20 md:w-44 md:h-44 bg-white rounded-[2rem] md:rounded-[4rem] border-2 border-slate-200 p-4 md:p-8 flex items-center justify-center shadow-md group-active:scale-95 transition-transform">
                    <img src={info2?.logo} alt={t2} className="w-12 h-12 md:w-28 md:h-28 object-contain" />
                  </div>
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
          })}
        </div>

        {!loading && !refreshing && (
          <UpcomingSection games={data.upcoming_games} />
        )}

        <footer className="mt-20 md:mt-48 pb-16 md:pb-32 flex flex-col items-center space-y-6 md:space-y-10 opacity-30">
          <div className="h-[2px] md:h-[3px] w-12 md:w-16 bg-slate-300 rounded-full"></div>
          {data.fetched_at && (
            <p className="text-[8px] md:text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] md:tracking-[0.6em] italic text-center leading-loose">
              Sync State: {data.fetched_at}
            </p>
          )}
        </footer>
      </div>
    </div>
  )
}

export default App
