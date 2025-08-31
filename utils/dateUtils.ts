export const getTodayDateString = (): string => {
    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
};

export const ONE_DAY_MS = 24 * 60 * 60 * 1000;

export const parseUTCDate = (dateString: string): Date => {
    const [year, month, day] = dateString.split('-').map(Number);
    return new Date(Date.UTC(year, month - 1, day));
};

export const calculateStreaks = (log: Record<string, boolean> | undefined): { currentStreak: number; longestStreak: number } => {
    if (!log) {
        return { currentStreak: 0, longestStreak: 0 };
    }
    const logKeys = Object.keys(log);
    if (logKeys.length === 0) {
        return { currentStreak: 0, longestStreak: 0 };
    }
    const dateObjects = logKeys.sort().map(parseUTCDate);
    
    let longestStreak = 0;
    let currentRun = 0;
    if (dateObjects.length > 0) {
      longestStreak = 1;
      currentRun = 1;
    }

    for (let i = 1; i < dateObjects.length; i++) {
        const diff = dateObjects[i].getTime() - dateObjects[i-1].getTime();
        if (diff === ONE_DAY_MS) {
            currentRun++;
        } else if (diff > ONE_DAY_MS) {
            currentRun = 1;
        }
        if (currentRun > longestStreak) {
            longestStreak = currentRun;
        }
    }
    
    let currentStreak = 0;
    const today = parseUTCDate(getTodayDateString());
    const lastLogDate = dateObjects[dateObjects.length - 1];
    
    if (isNaN(lastLogDate.getTime())) {
         return { currentStreak: 0, longestStreak };
    }

    const diffFromToday = today.getTime() - lastLogDate.getTime();
    if (diffFromToday <= ONE_DAY_MS) {
        currentStreak = 1;
        for (let i = dateObjects.length - 1; i > 0; i--) {
            const diff = dateObjects[i].getTime() - dateObjects[i-1].getTime();
            if (diff === ONE_DAY_MS) {
                currentStreak++;
            } else {
                break;
            }
        }
    }

    return { currentStreak, longestStreak };
};