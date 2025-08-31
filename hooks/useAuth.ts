import { useState, useEffect } from 'react';

const generateUUID = () => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

const useAuth = (): string | null => {
  const [userId, setUserId] = useState<string | null>(() => {
    try {
      return window.localStorage.getItem('sugar-challenge-userId');
    } catch (e) {
      console.error("Could not read from localStorage", e);
      return null;
    }
  });

  useEffect(() => {
    if (!userId) {
      const newUserId = generateUUID();
      try {
        window.localStorage.setItem('sugar-challenge-userId', newUserId);
        setUserId(newUserId);
      } catch (e) {
        console.error("Could not write to localStorage", e);
      }
    }
  }, [userId]);

  return userId;
};

export default useAuth;