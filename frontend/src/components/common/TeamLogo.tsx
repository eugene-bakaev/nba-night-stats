import React from 'react';
import { getTeamInfo } from '../../utils/theme';

interface TeamLogoProps {
  teamCode: string;
  sizeClass?: string;
  className?: string;
  paddingClass?: string;
}

export const TeamLogo: React.FC<TeamLogoProps> = ({ 
  teamCode, 
  sizeClass = "w-12 h-12 md:w-28 md:h-28", 
  className = "",
  paddingClass = "p-1 md:p-2"
}) => {
  const info = getTeamInfo(teamCode);

  if (teamCode === "TBD" || !info) {
    return (
      <div className={`${sizeClass} rounded-full border border-slate-200 overflow-hidden flex items-center justify-center bg-slate-50 ${className}`}>
        <span className="text-[8px] md:text-xs font-black text-slate-300">TBD</span>
      </div>
    );
  }

  return (
    <div className={`relative z-10 ${sizeClass} bg-white rounded-full border border-slate-200 ${paddingClass} flex items-center justify-center ${className}`}>
      <img src={info.logo} alt={teamCode} className="w-full h-full object-contain" />
    </div>
  );
};
