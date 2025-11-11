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

    try {
      const userId = session.user.id;

      // Obtener escaneos verificados
      const { count: verifiedCount } = await supabase
        .from('scan_history')
        .select('*', { count: 'exact', head: true })
        .eq('userId', userId);

      // Obtener alertas activas (isActive = true)
      const { count: alertsCount } = await supabase
        .from('alert')
        .select('*', { count: 'exact', head: true })
        .eq('isActive', true);

      // Obtener reportes del usuario (excluir anónimos)
      const { count: reportsCount } = await supabase
        .from('report')
        .select('*', { count: 'exact', head: true })
        .eq('userId', userId);

      setStats({
        verified: verifiedCount ?? 0,
        alerts: alertsCount ?? 0,
        reports: reportsCount ?? 0,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al obtener estadísticas');
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
