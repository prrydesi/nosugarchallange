
import React, { useMemo, useState, useEffect } from 'react';
import { db, ref, onValue, set, push, isFirebaseConfigured } from './firebase';

import type { Participant } from './types';
import useAuth from './hooks/useAuth';
import Header from './components/Header';
import AddParticipantForm from './components/AddParticipantForm';
import ParticipantCard from './components/ParticipantCard';
import ChallengeEndScreen from './components/ChallengeEndScreen';
import { getTodayDateString, calculateStreaks, parseUTCDate, ONE_DAY_MS } from './utils/dateUtils';
import { ConfigError } from './components/ConfigError';

// Type representing the structure of participant data in Firebase
type FirebaseParticipants = Record<string, Omit<Participant, 'id'>>;

// Challenge constants
const CHALLENGE_DURATION_DAYS = 30;


const App: React.FC = () => {
  if (!isFirebaseConfigured || !db) {
    return <ConfigError />;
  }

  const [participants, setParticipants] = useState<Participant[]>([]);
  const [challengeStartDate, setChallengeStartDate] = useState<string | null>(null);
  const userId = useAuth(); // Anonymous user ID

  useEffect(() => {
    const participantsRef = ref(db, 'participants');
    // Set up a listener for real-time updates
    const unsubscribe = onValue(participantsRef, (snapshot) => {
        const data: FirebaseParticipants | null = snapshot.val(); // Explicitly type the data from Firebase
        if (data) {
            // Convert the Firebase object of objects into an array
            const participantsArray: Participant[] = Object.keys(data).map(key => ({
                ...data[key],
                id: key,
            }));
            setParticipants(participantsArray);
        } else {
            setParticipants([]);
        }
    });

    // Cleanup listener on component unmount
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const startDateRef = ref(db, 'challenge/startDate');
    const unsubscribe = onValue(startDateRef, (snapshot) => {
        setChallengeStartDate(snapshot.val());
    });
    return () => unsubscribe();
  }, []);


  const processedParticipants = useMemo(() => {
    return participants.map(p => {
        const { currentStreak, longestStreak } = calculateStreaks(p.log);
        const totalDays = p.log ? Object.keys(p.log).length : 0;
        return { ...p, currentStreak, longestStreak, totalDays };
      })
  }, [participants]);

  const sortedParticipants = useMemo(() => {
    return [...processedParticipants].sort((a, b) => {
        if (b.currentStreak !== a.currentStreak) return b.currentStreak - a.currentStreak;
        if (b.longestStreak !== a.longestStreak) return b.longestStreak - a.longestStreak;
        return b.totalDays - a.totalDays;
    });
  }, [processedParticipants]);

  const challengeState = useMemo(() => {
    if (!challengeStartDate) {
      return { status: 'NOT_STARTED' as const, daysLeft: undefined, winners: [] };
    }
    
    const today = parseUTCDate(getTodayDateString());
    const start = parseUTCDate(challengeStartDate);
    // End date is on the morning of the day AFTER the challenge ends.
    const endDate = new Date(start.getTime() + CHALLENGE_DURATION_DAYS * ONE_DAY_MS);
    
    // Using Math.max to prevent negative days left before challenge end.
    const daysLeft = Math.max(0, Math.ceil((endDate.getTime() - today.getTime()) / ONE_DAY_MS));

    if (today.getTime() >= endDate.getTime()) {
      const maxStreak = Math.max(0, ...processedParticipants.map(p => p.longestStreak));
      const winners = maxStreak > 0 ? processedParticipants.filter(p => p.longestStreak === maxStreak) : [];
      return { status: 'ENDED' as const, daysLeft: 0, winners };
    }

    return { status: 'IN_PROGRESS' as const, daysLeft, winners: [] };
  }, [challengeStartDate, processedParticipants]);


  const handleAddParticipant = (name: string) => {
    if (!userId) {
        console.error("Cannot add participant without a user ID.");
        return;
    }

    // If this is the very first participant, start the challenge
    if (participants.length === 0 && !challengeStartDate) {
        const startDateRef = ref(db, 'challenge/startDate');
        set(startDateRef, getTodayDateString());
    }

    const participantsRef = ref(db, 'participants');
    const newParticipantRef = push(participantsRef);
    const newId = newParticipantRef.key;

    if (!newId) {
      console.error("Could not get new participant key from Firebase.");
      return;
    }
    
    const newParticipant: Omit<Participant, 'id'> = {
      name,
      avatar: `https://picsum.photos/seed/${newId}/200`, // Use unique ID for avatar
      currentStreak: 0,
      longestStreak: 0,
      totalDays: 0,
      log: {},
      ownerId: userId,
    };
    
    set(newParticipantRef, newParticipant);
  };

  const handleLogDay = (id: string) => {
    const today = getTodayDateString();
    const participant = participants.find(p => p.id === id);
    if (participant && participant.ownerId === userId && challengeState.status === 'IN_PROGRESS') {
        const logRef = ref(db, `participants/${id}/log/${today}`);
        set(logRef, true);
    }
  };
  
  const handleStartNewChallenge = () => {
    if (window.confirm("Are you sure you want to start a new challenge? This will delete all current participants and their progress.")) {
        const participantsRef = ref(db, 'participants');
        const challengeRef = ref(db, 'challenge');
        set(participantsRef, null);
        set(challengeRef, null);
    }
  };

  const renderContent = () => {
    switch (challengeState.status) {
        case 'ENDED':
            return <ChallengeEndScreen winners={challengeState.winners} onStartNew={handleStartNewChallenge} allParticipants={sortedParticipants} />;
        case 'IN_PROGRESS':
        case 'NOT_STARTED':
        default:
            return (
                <>
                    <AddParticipantForm onAddParticipant={handleAddParticipant} />
                    {sortedParticipants.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {sortedParticipants.map((p, index) => (
                            <ParticipantCard
                                key={p.id}
                                participant={p}
                                rank={index + 1}
                                onLogDay={handleLogDay}
                                hasLoggedToday={!!p.log && p.log[getTodayDateString()]}
                                isCurrentUser={p.ownerId === userId}
                                isChallengeActive={challengeState.status === 'IN_PROGRESS'}
                            />
                        ))}
                        </div>
                    ) : (
                        <div className="text-center py-16 px-6 bg-slate-800/50 rounded-2xl border border-slate-700">
                            <h2 className="text-2xl font-semibold text-white mb-2">The Challenge Awaits!</h2>
                            <p className="text-slate-400">Add yourself or your friends to get started.</p>
                        </div>
                    )}
                </>
            );
    }
  }


  return (
    <div className="min-h-screen bg-slate-900 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]">
      <Header daysLeft={challengeState.status === 'IN_PROGRESS' ? challengeState.daysLeft : undefined} />
      <main className="container mx-auto px-4 py-8">
        {renderContent()}
      </main>
    </div>
  );
};

export default App;
