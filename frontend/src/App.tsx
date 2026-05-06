import { useState, useEffect } from 'react'
import teamData from './team_colors.json'

interface TeamInfo {
  colors: string[];
  logo: string;
}

interface Game {
  teams: [string, string];
  delta: number;
}

interface ApiResponse {
  games: Game[];
  game_date: string;
  fetched_at: string;
  error?: string;
}

const getStripedBackground = (colors: string[]) => {
  if (!colors || colors.length === 0) return '#e2e8f0'; // slate-200 fallback
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
        fetched_at: result.fetched_at || ''
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

  const games = data.games || [];

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 p-8 md:p-16 font-sans">
      <div className="max-w-2xl mx-auto">
        <header className="flex justify-between items-center mb-32 bg-white p-8 rounded-[3.5rem] shadow-sm border border-slate-200">
          <div>
            <h1 className="text-4xl font-black tracking-tighter uppercase text-slate-800">NBA <span className="text-blue-600 italic">Night</span></h1>
            <p className="text-[12px] uppercase tracking-[0.5em] font-black text-slate-400 mt-2">{data.game_date || 'SYNCING...'}</p>
          </div>
          <button 
            onClick={() => fetchData(true)}
            disabled={loading || refreshing}
            className={`p-5 rounded-[2rem] bg-slate-50 border border-slate-200 text-blue-600 transition-all ${refreshing ? 'animate-spin opacity-50' : 'active:scale-90'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </header>

        {loading && !refreshing && (
          <div className="flex flex-col justify-center items-center h-96 space-y-8">
            <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-r-4 border-blue-600"></div>
            <span className="text-sm font-black text-slate-400 uppercase tracking-[0.6em] animate-pulse">Scanning Court</span>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-100 text-red-600 p-12 rounded-[3.5rem] mb-16 text-sm font-black uppercase tracking-[0.3em] text-center shadow-sm">
            {error}
          </div>
        )}

        {!loading && games.length === 0 && !error && (
          <div className="text-slate-400 text-center py-32 font-black uppercase tracking-[0.6em] text-sm">
            No Games Today
          </div>
        )}

        <div className={`space-y-28 transition-all duration-700 ${refreshing ? 'opacity-20 blur-xl' : 'opacity-100'}`}>
          {games.map((game, index) => {
            const [t1, t2] = game.teams;
            const info1 = (teamData as Record<string, TeamInfo>)[t1];
            const info2 = (teamData as Record<string, TeamInfo>)[t2];

            return (
              <div key={index} className="relative flex items-center justify-between px-6">
                
                {/* Connecting Bars with Stripes */}
                <div className="absolute inset-x-28 top-1/2 -translate-y-1/2 h-20 flex items-center justify-between z-0">
                  {/* Left Stripes */}
                  <div className="w-[40%] h-full rounded-l-full shadow-inner" 
                       style={{ background: getStripedBackground(info1?.colors) }}></div>
                  {/* Right Stripes */}
                  <div className="w-[40%] h-full rounded-r-full shadow-inner" 
                       style={{ background: getStripedBackground(info2?.colors) }}></div>
                </div>

                {/* Team 1 Logo */}
                <div className="relative z-10 w-44 h-44 bg-white rounded-[4rem] border border-slate-200 p-8 flex items-center justify-center shadow-md">
                  <img src={info1?.logo} alt={t1} className="w-28 h-28 object-contain" />
                </div>

                {/* Center DIF Box */}
                <div className="relative z-20 flex flex-col items-center justify-center min-w-[160px] h-32 bg-slate-900 rounded-[2.5rem] shadow-2xl border border-slate-800">
                  <span className="text-6xl font-[1000] tracking-tighter text-white leading-none">{game.delta}</span>
                  <span className="text-xs font-black uppercase tracking-[0.4em] text-slate-500 mt-1">DIF</span>
                </div>

                {/* Team 2 Logo */}
                <div className="relative z-10 w-44 h-44 bg-white rounded-[4rem] border border-slate-200 p-8 flex items-center justify-center shadow-md">
                  <img src={info2?.logo} alt={t2} className="w-28 h-28 object-contain" />
                </div>

              </div>
            );
          })}
        </div>

        <footer className="mt-48 pb-32 flex flex-col items-center space-y-10 opacity-30">
          <div className="h-[3px] w-16 bg-slate-300 rounded-full"></div>
          {data.fetched_at && (
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.6em] italic text-center leading-loose">
              Sync State: {data.fetched_at}
            </p>
          )}
        </footer>
      </div>
    </div>
  )
}

export default App
