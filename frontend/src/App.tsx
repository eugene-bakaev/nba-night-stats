import { useNbaData } from './hooks/useNbaData'
import { Header } from './components/layout/Header'
import { Footer } from './components/layout/Footer'
import { FeedbackState } from './components/common/FeedbackState'
import { GameFeed } from './components/game/GameFeed'
import { UpcomingSection } from './components/upcoming/UpcomingSection'

function App() {
  const { data, loading, refreshing, error, refetch } = useNbaData()

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 p-4 md:p-16 font-sans">
      <div className="max-w-2xl mx-auto">
        <Header 
          date={data.game_date} 
          refreshing={refreshing} 
          onRefresh={refetch} 
          disabled={loading || refreshing} 
        />

        <FeedbackState 
          loading={loading && !refreshing} 
          error={error} 
          isEmpty={!loading && data.games.length === 0 && !error} 
        />

        {!loading && !error && (
          <>
            <GameFeed games={data.games} refreshing={refreshing} />
            <UpcomingSection games={data.upcoming_games} />
          </>
        )}

        <Footer fetchedAt={data.fetched_at} />
      </div>
    </div>
  )
}

export default App
