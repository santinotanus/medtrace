import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { CompositeScreenProps } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import type {
  MainTabParamList,
  RootStackParamList,
  AlertRecord,
  ScanHistoryEntry,
  BatchRecord,
} from '../../types';
import { COLORS, SIZES, SHADOWS } from '../../constants/theme';
import { useAuth } from '../../hooks/useAuth';
import { useUserStats } from '../../hooks/useUserStats';
import { supabase } from '../../lib/supabase';
import { formatDate, formatRelativeTime } from '../../utils/format';

type HomeProps = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, 'Home'>,
  NativeStackScreenProps<RootStackParamList>
>;

export default function HomeScreen({ navigation }: HomeProps) {
  const { profile, isGuest } = useAuth();
  const { stats, loading: statsLoading, refresh: refreshStats } = useUserStats();
  const [bannerAlert, setBannerAlert] = useState<AlertRecord | null>(null);
  const [history, setHistory] = useState<ScanHistoryEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fetchHomeData = useCallback(async () => {
    if (isGuest) {
      setBannerAlert(null);
      setHistory([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const [alertRes, historyRes] = await Promise.all([
      supabase
        .from('alert')
        .select(
          `
          *,
          medicine:medicineId (*),
          batch:batchId (*)
        `,
        )
        .eq('isActive', true)
        .order('publishedAt', { ascending: false })
        .limit(1)
        .maybeSingle(),
      supabase
        .from('scan_history')
        .select(
          `
          *,
          batch:batchId (
            *,
            medicine:medicineId (*)
          )
        `,
        )
        .order('scannedAt', { ascending: false })
        .limit(4),
    ]);

    if (!alertRes.error) {
      setBannerAlert(alertRes.data as AlertRecord | null);
    }
    if (!historyRes.error && historyRes.data) {
      setHistory(historyRes.data as ScanHistoryEntry[]);
    }

    setLoading(false);
  }, [isGuest]);

  useEffect(() => {
    fetchHomeData();
  }, [fetchHomeData]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([fetchHomeData(), refreshStats()]);
    setRefreshing(false);
  }, [fetchHomeData, refreshStats]);

  const userName = useMemo(() => {
    if (isGuest) return 'Invitado';
    return profile?.name ?? 'Usuario';
  }, [isGuest, profile]);

  const statsDisplay = useMemo(
    () => ({
      verified: stats?.verified ?? '-',
      alerts: stats?.alerts ?? '-',
      reports: stats?.reports ?? '-',
    }),
    [stats],
  );

  const canReport = !isGuest;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />}
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.welcomeText}>Bienvenido</Text>
            <Text style={styles.userName}>{userName}</Text>
            {isGuest && (
              <Text style={styles.guestHint}>Inicia sesión para sincronizar tus datos y escaneos.</Text>
            )}
          </View>
          {!isGuest && (
            <TouchableOpacity
              style={styles.notificationButton}
              onPress={() => navigation.navigate('Alerts')}
            >
              <View style={styles.bellIcon}>
                <View style={styles.bellTop} />
                <View style={styles.bellBody} />
              </View>
              <View style={styles.notificationBadge} />
            </TouchableOpacity>
          )}
        </View>

        {loading && !refreshing && (
          <View style={styles.loadingRow}>
            <ActivityIndicator color={COLORS.primary} />
            <Text style={styles.loadingText}>Sincronizando datos...</Text>
          </View>
        )}

        {bannerAlert && (
          <TouchableOpacity
            style={styles.alertBanner}
            onPress={() => navigation.navigate('AlertDetail', { alertId: bannerAlert.id })}
          >
            <View style={styles.alertIconContainer}>
              <View style={styles.alertTriangle} />
            </View>
            <View style={styles.alertContent}>
              <Text style={styles.alertTitle}>Alerta Activa</Text>
              <Text style={styles.alertMessage}>
                {bannerAlert.title}
                {bannerAlert.batch?.batchNumber ? ` - Lote ${bannerAlert.batch.batchNumber}` : ''}
              </Text>
              <Text style={styles.alertTimestamp}>
                {formatRelativeTime(bannerAlert.publishedAt)}
              </Text>
            </View>
          </TouchableOpacity>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Acciones Rápidas</Text>
          <View style={styles.quickActionsGrid}>
            <TouchableOpacity
              style={[styles.quickActionPrimary, isGuest && styles.quickActionDisabled]}
              onPress={() => navigation.navigate('Scanner')}
              disabled={isGuest}
            >
              <View style={styles.qrIconContainer}>
                <View style={styles.qrSquare1} />
                <View style={styles.qrSquare2} />
                <View style={styles.qrSquare3} />
                <View style={styles.qrSquare4} />
              </View>
              <Text style={styles.quickActionTextPrimary}>
                {isGuest ? 'Inicia sesión para escanear' : 'Escanear QR'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.quickActionSecondary, (!canReport || isGuest) && styles.quickActionDisabled]}
              onPress={() => navigation.navigate('Report')}
              disabled={!canReport}
            >
              <View style={styles.reportIconContainer}>
                <View style={styles.reportTriangle} />
              </View>
              <Text style={styles.quickActionTextSecondary}>Reportar</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Estadísticas</Text>
          <View style={styles.statsGrid}>
            <TouchableOpacity
              style={styles.statCard}
              disabled
            >
              <Text style={[styles.statNumber, { color: COLORS.success }]}>
                {statsLoading && !stats ? '...' : statsDisplay.verified}
              </Text>
              <Text style={styles.statLabel}>Escaneos</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.statCard}
              onPress={() => navigation.navigate('Alerts')}
              disabled={isGuest}
            >
              <Text style={[styles.statNumber, { color: COLORS.primary }]}>
                {statsLoading && !stats ? '...' : statsDisplay.alerts}
              </Text>
              <Text style={styles.statLabel}>Alertas</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.statCard}
              disabled
            >
              <Text style={[styles.statNumber, { color: COLORS.gray700 }]}>
                {statsLoading && !stats ? '...' : statsDisplay.reports}
              </Text>
              <Text style={styles.statLabel}>Reportes</Text>
            </TouchableOpacity>
          </View>
        </View>

        {!isGuest && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Actividad Reciente</Text>
            <View style={styles.activityList}>
              {history.length === 0 && (
                <View style={styles.emptyState}>
                  <Text style={styles.emptyTitle}>Sin escaneos aún</Text>
                  <Text style={styles.emptySubtitle}>
                    Escanea un medicamento para ver el historial aquí.
                  </Text>
                </View>
              )}
              {history.map((entry) => (
                <TouchableOpacity
                  key={entry.id}
                  style={styles.activityItem}
                  disabled={!entry.batch}
                  onPress={() => {
                    if (!entry.batch) return;
                    navigation.navigate(
                      entry.result === 'SAFE' ? 'ScanResultSafe' : 'ScanResultAlert',
                      { batch: entry.batch as BatchRecord },
                    );
                  }}
                >
                  <View style={styles.activityIconContainer}>
                    <View
                      style={[
                        styles.checkIcon,
                        entry.result !== 'SAFE' && styles.activityIconAlert,
                      ]}
                    />
                  </View>
                  <View style={styles.activityContent}>
                    <Text style={styles.activityTitle}>
                      {entry.batch?.medicine?.name ?? 'Medicamento'}
                    </Text>
                    <Text style={styles.activitySubtitle}>
                      {entry.batch?.medicine?.dosage ?? ''} - Lote{' '}
                      {entry.batch?.batchNumber ?? '—'}
                    </Text>
                    <Text style={styles.activityTime}>
                      {formatRelativeTime(entry.scannedAt)}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 16,
  },
  welcomeText: {
    fontSize: SIZES.sm,
    color: COLORS.gray500,
  },
  userName: {
    fontSize: SIZES.xxxl,
    fontWeight: '700',
    color: COLORS.primary,
  },
  guestHint: {
    marginTop: 4,
    color: COLORS.gray600,
    fontSize: SIZES.sm,
  },
  notificationButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.medium,
  },
  bellIcon: {
    width: 20,
    height: 20,
    alignItems: 'center',
  },
  bellTop: {
    width: 12,
    height: 8,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    borderWidth: 2,
    borderColor: COLORS.gray700,
  },
  bellBody: {
    width: 16,
    height: 12,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    backgroundColor: COLORS.gray700,
    marginTop: 2,
  },
  notificationBadge: {
    position: 'absolute',
    top: 8,
    right: 12,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.error,
  },
  alertBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    marginHorizontal: 24,
    marginBottom: 16,
    borderRadius: 16,
    padding: 16,
    ...SHADOWS.medium,
  },
  alertIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.errorLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  alertTriangle: {
    width: 0,
    height: 0,
    borderLeftWidth: 12,
    borderRightWidth: 12,
    borderBottomWidth: 24,
    borderStyle: 'solid',
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: COLORS.error,
  },
  alertContent: {
    flex: 1,
  },
  alertTitle: {
    fontSize: SIZES.sm,
    fontWeight: '600',
    color: COLORS.error,
  },
  alertMessage: {
    fontSize: SIZES.base,
    fontWeight: '600',
    color: COLORS.gray900,
    marginTop: 4,
  },
  alertTimestamp: {
    fontSize: SIZES.xs,
    color: COLORS.gray500,
    marginTop: 4,
  },
  section: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: SIZES.lg,
    fontWeight: '600',
    color: COLORS.gray900,
    marginBottom: 16,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    gap: 16,
  },
  quickActionPrimary: {
    flex: 1,
    backgroundColor: COLORS.primary,
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.medium,
  },
  quickActionSecondary: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.gray200,
    ...SHADOWS.medium,
  },
  quickActionDisabled: {
    opacity: 0.4,
  },
  qrIconContainer: {
    width: 48,
    height: 48,
    position: 'relative',
    marginBottom: 12,
  },
  qrSquare1: {
    position: 'absolute',
    width: 16,
    height: 16,
    backgroundColor: COLORS.white,
    borderRadius: 2,
    top: 0,
    left: 0,
  },
  qrSquare2: {
    position: 'absolute',
    width: 16,
    height: 16,
    backgroundColor: COLORS.white,
    borderRadius: 2,
    top: 0,
    right: 0,
  },
  qrSquare3: {
    position: 'absolute',
    width: 16,
    height: 16,
    backgroundColor: COLORS.white,
    borderRadius: 2,
    bottom: 0,
    left: 0,
  },
  qrSquare4: {
    position: 'absolute',
    width: 16,
    height: 16,
    backgroundColor: COLORS.white,
    borderRadius: 2,
    bottom: 0,
    right: 0,
  },
  quickActionTextPrimary: {
    color: COLORS.white,
    fontSize: SIZES.base,
    fontWeight: '600',
    textAlign: 'center',
  },
  quickActionTextSecondary: {
    color: COLORS.gray900,
    fontSize: SIZES.base,
    fontWeight: '600',
    textAlign: 'center',
  },
  reportIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.errorLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  reportTriangle: {
    width: 0,
    height: 0,
    borderLeftWidth: 12,
    borderRightWidth: 12,
    borderBottomWidth: 24,
    borderStyle: 'solid',
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: COLORS.error,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: 16,
    paddingVertical: 20,
    alignItems: 'center',
    ...SHADOWS.small,
  },
  statNumber: {
    fontSize: SIZES.xxxl,
    fontWeight: '700',
    marginBottom: 8,
  },
  statLabel: {
    fontSize: SIZES.sm,
    color: COLORS.gray500,
  },
  activityList: {
    gap: 12,
  },
  activityItem: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    ...SHADOWS.small,
  },
  activityIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.successLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  checkIcon: {
    width: 20,
    height: 12,
    borderLeftWidth: 4,
    borderBottomWidth: 4,
    borderColor: COLORS.success,
    transform: [{ rotate: '-45deg' }],
  },
  activityIconAlert: {
    borderColor: COLORS.error,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: SIZES.base,
    fontWeight: '600',
    color: COLORS.gray900,
  },
  activitySubtitle: {
    fontSize: SIZES.sm,
    color: COLORS.gray600,
    marginTop: 2,
  },
  activityTime: {
    fontSize: SIZES.xs,
    color: COLORS.gray500,
    marginTop: 4,
  },
  emptyState: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    ...SHADOWS.small,
  },
  emptyTitle: {
    fontSize: SIZES.base,
    fontWeight: '600',
    color: COLORS.gray900,
    marginBottom: 4,
  },
  emptySubtitle: {
    fontSize: SIZES.sm,
    color: COLORS.gray500,
    textAlign: 'center',
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginHorizontal: 24,
    marginBottom: 12,
  },
  loadingText: {
    color: COLORS.gray600,
    fontSize: SIZES.sm,
  },
});
