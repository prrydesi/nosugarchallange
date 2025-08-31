
import React from 'react';
import type { Participant } from '../types';
import { TrophyIcon, StarIcon, RefreshIcon } from './icons';

interface ChallengeEndScreenProps {
  winners: Participant[];
  allParticipants: Participant[];
  onStartNew: () => void;
}

const ChallengeEndScreen: React.FC<ChallengeEndScreenProps> = ({ winners, allParticipants, onStartNew }) => {
  const hasWinners = winners.length > 0;
  
  return (
    <div className="text-center py-16 px-6 bg-slate-800/50 rounded-2xl border border-amber-400/50 relative overflow-hidden">
        {/* Simple CSS confetti */}
        {[...Array(50)].map((_, i) => (
          <div key={i} className="absolute top-0 left-0 w-2 h-2 rounded-full animate-confetti" style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${3 + Math.random() * 2}s`,
            backgroundColor: ['#fde047', '#f97316', '#8b5cf6', '#22c55e'][i % 4]
          }}></div>
        ))}
        
        <style>{`
          @keyframes confetti {
            0% { transform: translateY(-10vh) rotate(0deg); opacity: 1; }
            100% { transform: translateY(110vh) rotate(720deg); opacity: 0; }
          }
        `}</style>

      <TrophyIcon className="w-24 h-24 text-amber-400 mx-auto mb-4 animate-bounce" />
      <h2 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-amber-400 to-orange-500 mb-4">
        Challenge Complete!
      </h2>
      
      {hasWinners ? (
        <>
          <p className="text-xl text-slate-300 mb-8">
            And the winner{winners.length > 1 ? 's are' : ' is'}...
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 mb-12">
            {winners.map(winner => (
              <div key={winner.id} className="flex flex-col items-center gap-3">
                <img src={winner.avatar} alt={winner.name} className="w-32 h-32 rounded-full border-4 border-amber-400 object-cover shadow-2xl shadow-amber-400/30" />
                <h3 className="text-3xl font-bold text-white">{winner.name}</h3>
                <div className="flex items-center gap-2 text-lg text-yellow-300">
                  <StarIcon className="w-6 h-6" />
                  <span>Longest Streak: {winner.longestStreak} days</span>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <p className="text-xl text-slate-300 mb-12">
          What an effort! Although there were no winners, everyone did a great job.
        </p>
      )}

      <div className="mb-10">
        <h4 className="text-2xl font-bold text-white mb-4">Final Leaderboard</h4>
        <ul className="max-w-md mx-auto bg-slate-900/50 rounded-lg p-4 border border-slate-700 space-y-2">
            {allParticipants.map((p, index) => (
                <li key={p.id} className="flex justify-between items-center text-lg p-2 rounded-md transition-colors hover:bg-slate-700/50">
                    <span className="font-semibold text-white"><span className="text-slate-400 w-8 inline-block">{index + 1}.</span> {p.name}</span>
                    <span className="text-slate-300">{p.longestStreak} day streak</span>
                </li>
            ))}
        </ul>
      </div>

      <button
        onClick={onStartNew}
        className="flex items-center justify-center gap-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold px-8 py-4 rounded-lg text-xl hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-emerald-500 transition-transform transform hover:scale-105"
      >
        <RefreshIcon className="w-7 h-7" />
        <span>Start a New Challenge</span>
      </button>
    </div>
  );
};

export default ChallengeEndScreen;
