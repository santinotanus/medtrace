import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { UserStats } from '../types';
import { useAuth } from './useAuth';

export function useUserStats(refreshKey?: unknown) {
  const { session, isGuest } = useAuth();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    if (!session?.user || isGuest) {
      setStats(null);
      return;
    }

    setLoading(true);
    setError(null);
    const { data, error: fnError } = await supabase.functions.invoke<UserStats>('get-user-stats');
    if (fnError) {
      setError(fnError.message);
    } else if (data) {
      setStats(data);
    }
    setLoading(false);
  }, [session?.user, isGuest]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats, refreshKey]);

  return {
    stats,
    loading,
    error,
    refresh: fetchStats,
  };
}
