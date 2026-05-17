import React, { useState } from 'react';
import { Game } from '../../types/nba';
import { GameCard } from './GameCard';

interface GameFeedProps {
  games: Game[];
  refreshing: boolean;
}

export const GameFeed: React.FC<GameFeedProps> = ({ games, refreshing }) => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const toggleExpand = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <div className={`space-y-12 md:space-y-28 transition-all duration-700 ${refreshing ? 'opacity-20 blur-xl' : 'opacity-100'}`}>
      {games.map((game, index) => (
        <GameCard 
          key={index} 
          game={game} 
          isExpanded={expandedIndex === index} 
          onToggle={() => toggleExpand(index)} 
        />
      ))}
    </div>
  );
};
