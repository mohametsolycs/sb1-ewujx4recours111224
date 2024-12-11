import { useState, useEffect } from 'react';
import { initDatabase, resetDatabase, closeDatabase } from '../database/db';

export function useDatabase() {
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;

    async function init() {
      try {
        await initDatabase();
        if (mounted) {
          setIsInitialized(true);
          setError(null);
        }
      } catch (error) {
        console.error('Database initialization failed:', error);
        if (mounted) {
          setError(error instanceof Error ? error : new Error('Unknown database error'));
        }
      }
    }

    init();

    return () => {
      mounted = false;
      closeDatabase();
      setIsInitialized(false);
    };
  }, []);

  return { isInitialized, error };
}