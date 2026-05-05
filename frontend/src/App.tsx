import { useState, useEffect } from 'react'

interface Game {
  matchup: string;
  delta: number;
}

interface ApiResponse {
  games: Game[];
  game_date: string;
  fetched_at: string;
  error?: string;
}

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
    <div className="min-h-screen bg-gray-900 text-white p-4 md:p-8">
      <div className="max-w-md mx-auto">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-blue-400">NBA Night Stats</h1>
            <p className="text-sm text-gray-500">Games for {data.game_date || '...'}</p>
          </div>
          <button 
            onClick={() => fetchData(true)}
            disabled={loading || refreshing}
            className={`p-2 rounded-full hover:bg-gray-800 transition-colors ${refreshing ? 'animate-spin' : ''}`}
            title="Force Refresh"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </header>
        
        {data.fetched_at && (
          <div className="text-xs text-gray-600 mb-6 text-right italic">
            Last fetched: {data.fetched_at}
          </div>
        )}

        {loading && !refreshing && (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        )}

        {error && (
          <div className="bg-red-900/50 border border-red-500 text-red-200 p-4 rounded-lg mb-4">
            Error: {error}
          </div>
        )}

        {!loading && games.length === 0 && !error && (
          <div className="text-gray-500 text-center py-8">
            No games found for this date.
          </div>
        )}

        <div className={`space-y-3 transition-opacity ${refreshing ? 'opacity-50' : 'opacity-100'}`}>
          {games.map((game, index) => (
            <div key={index} className="bg-gray-800 border border-gray-700 p-4 rounded-xl flex justify-between items-center hover:border-blue-500 transition-colors group">
              <span className="text-lg font-medium group-hover:text-blue-300 transition-colors">{game.matchup}</span>
              <div className="flex flex-col items-end">
                <span className="text-2xl font-bold text-blue-400">{game.delta}</span>
                <span className="text-xs text-gray-500 uppercase tracking-widest">Delta</span>
              </div>
            </div>
          ))}
        </div>

        <footer className="mt-12 text-center text-gray-600 text-xs">
          Data provided by NBA API • No Auto-Refresh
        </footer>
      </div>
    </div>
  )
}

export default App
