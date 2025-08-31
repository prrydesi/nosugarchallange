
import React from 'react';
import type { Participant } from '../types';
import { FlameIcon, StarIcon, TrophyIcon, CheckCircleIcon } from './icons';

interface ParticipantCardProps {
  participant: Participant;
  rank: number;
  onLogDay: (id: string) => void;
  hasLoggedToday: boolean;
  isCurrentUser: boolean;
  isChallengeActive: boolean;
}

const Stat: React.FC<{ icon: React.ElementType; value: number; label: string; color: string }> = ({ icon: Icon, value, label, color }) => (
  <div className="flex flex-col items-center text-center">
    <div className={`relative w-12 h-12 flex items-center justify-center rounded-full mb-1 ${color}`}>
      <Icon className="w-7 h-7" />
    </div>
    <span className="text-xl font-bold text-white">{value}</span>
    <span className="text-xs text-slate-400">{label}</span>
  </div>
);


const ParticipantCard: React.FC<ParticipantCardProps> = ({ participant, rank, onLogDay, hasLoggedToday, isCurrentUser, isChallengeActive }) => {
  const rankColor = rank === 1 ? 'border-amber-400' : rank === 2 ? 'border-slate-400' : rank === 3 ? 'border-amber-600' : 'border-slate-700';
  const isButtonDisabled = !isCurrentUser || hasLoggedToday || !isChallengeActive;

  let buttonText = isCurrentUser ? "Log Today's Success" : "Locked";
  let buttonHoverText = isCurrentUser ? "Let's Go! 💪" : "Locked";
  if (!isChallengeActive) {
      buttonText = "Challenge Inactive";
      buttonHoverText = "Challenge Inactive";
  }


  return (
    <div className={`bg-slate-800/50 rounded-2xl p-5 border-2 ${rankColor} shadow-lg backdrop-blur-sm transition-all duration-300 transform hover:-translate-y-1 ${isCurrentUser ? 'shadow-purple-500/40 border-purple-500' : 'hover:shadow-purple-500/20 hover:border-purple-500'}`}>
      <div className="flex items-center gap-4">
        <div className="relative">
          <img src={participant.avatar} alt={participant.name} className="w-20 h-20 rounded-full border-4 border-slate-600 object-cover" />
          {rank <= 3 && (
            <span className={`absolute -top-1 -left-1 w-8 h-8 rounded-full flex items-center justify-center text-lg font-bold ${rank === 1 ? 'bg-amber-400 text-slate-900' : rank === 2 ? 'bg-slate-400 text-slate-900' : 'bg-amber-600 text-white'}`} aria-hidden="true">
              {rank}
            </span>
          )}
           {isCurrentUser && (
            <span className="absolute -bottom-1 -right-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs font-bold px-2 py-1 rounded-full">
              YOU
            </span>
          )}
        </div>
        <div className="flex-1">
          <h3 className="text-2xl font-bold truncate text-white">
            {participant.name}
            <span className="sr-only">(Rank {rank})</span>
          </h3>
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-4 my-6">
        <Stat icon={FlameIcon} value={participant.currentStreak} label="Current Streak" color="text-orange-400" />
        <Stat icon={StarIcon} value={participant.longestStreak} label="Longest Streak" color="text-yellow-400" />
        <Stat icon={TrophyIcon} value={participant.totalDays} label="Total Days" color="text-green-400" />
      </div>

      <button
        onClick={() => onLogDay(participant.id)}
        disabled={isButtonDisabled}
        aria-label={isButtonDisabled ? `Success already logged today for ${participant.name}` : `Log today's success for ${participant.name}`}
        className="w-full flex items-center justify-center gap-3 text-lg font-semibold py-3 rounded-lg transition-all duration-300 disabled:cursor-not-allowed group"
        style={{
            background: hasLoggedToday 
                ? 'linear-gradient(to right, #16a34a, #22c55e)'
                : 'linear-gradient(to right, #4f46e5, #7c3aed)',
            color: 'white',
            opacity: isButtonDisabled ? 0.5 : 1,
        }}
      >
        {hasLoggedToday ? (
          <>
            <CheckCircleIcon className="w-6 h-6" />
            <span>Success Logged!</span>
          </>
        ) : (
          <>
            <span className="group-hover:hidden">{buttonText}</span>
            <span className="hidden group-hover:inline">{buttonHoverText}</span>
          </>
        )}
      </button>
    </div>
  );
};

export default ParticipantCard;
