import { useState, useEffect } from 'react';
import { ApiResponse } from '../types/nba';

export const useNbaData = () => {
  const [data, setData] = useState<ApiResponse>({ games: [], game_date: '', fetched_at: '', upcoming_games: [] });
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

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
  };

  useEffect(() => {
    fetchData();
  }, []);

  return { data, loading, refreshing, error, refetch: () => fetchData(true) };
};
