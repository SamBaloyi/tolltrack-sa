import { useState, useEffect } from 'react';
import { tollGatesApi } from '@/services/api';
import type { TollGate } from '@/types';

interface UseTollGatesReturn {
  tollGates: TollGate[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Custom hook for fetching toll gates
 */
export function useTollGates(): UseTollGatesReturn {
  const [tollGates, setTollGates] = useState<TollGate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTollGates = async (): Promise<void> => {
    try {
      setLoading(true);
      const data = await tollGatesApi.getAll();
      setTollGates(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching toll gates:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch toll gates');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTollGates();
  }, []);

  return { tollGates, loading, error, refetch: fetchTollGates };
}
