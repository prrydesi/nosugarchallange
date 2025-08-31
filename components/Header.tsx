
import React from 'react';
import { TrophyIcon } from './icons';

interface HeaderProps {
    daysLeft?: number;
}

const Header: React.FC<HeaderProps> = ({ daysLeft }) => {
  return (
    <header className="text-center p-6 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-10">
      <div className="flex items-center justify-center gap-4">
        <TrophyIcon className="w-10 h-10 text-amber-400" />
        <h1 className="text-4xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-green-300 via-blue-400 to-purple-500">
          No Sugar Streak Challenge
        </h1>
      </div>
      {typeof daysLeft !== 'undefined' && daysLeft >= 0 ? (
         <p className="mt-2 text-lg text-emerald-300 font-semibold animate-pulse">
            {daysLeft > 1 ? `${daysLeft} days left!` : daysLeft === 1 ? '1 day left - final push!' : 'Final Day!'}
         </p>
      ) : (
        <p className="mt-2 text-lg text-slate-400">Log your success daily and climb the leaderboard!</p>
      )}
    </header>
  );
};

export default Header;
