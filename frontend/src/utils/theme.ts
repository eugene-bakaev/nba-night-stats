import teamData from '../team_colors.json';
import { TeamInfo } from '../types/nba';

export const getStripedBackground = (colors: string[]) => {
  if (!colors || colors.length === 0) return '#e2e8f0';
  if (colors.length === 1) return colors[0];

  const step = 100 / colors.length;
  const stops = colors.map((color, i) => {
    return `${color} ${i * step}%, ${color} ${(i + 1) * step}%`;
  }).join(', ');

  return `linear-gradient(to bottom, ${stops})`;
};

export const getTeamInfo = (teamCode: string): TeamInfo | undefined => {
  return (teamData as Record<string, TeamInfo>)[teamCode];
};
