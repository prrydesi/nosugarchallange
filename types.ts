
export interface Participant {
  id: string;
  name: string;
  avatar: string;
  currentStreak: number;
  longestStreak: number;
  totalDays: number;
  log: Record<string, boolean>; // e.g. { "2024-01-01": true, "2024-01-02": true }
  ownerId: string; // The anonymous ID of the user who created this participant
}