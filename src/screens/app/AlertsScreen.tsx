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
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList, AlertRecord } from '../../types';
import { COLORS, SIZES, SHADOWS } from '../../constants/theme';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../hooks/useAuth';
import { formatRelativeTime } from '../../utils/format';

type Props = NativeStackScreenProps<RootStackParamList, 'Alerts'>;

export default function AlertsScreen({ navigation }: Props) {
  const [activeTab, setActiveTab] = useState<'active' | 'history'>('active');
  const [alerts, setAlerts] = useState<AlertRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const { isGuest } = useAuth();

  const fetchAlerts = useCallback(async () => {
    if (isGuest) {
      setAlerts([]);
      return;
    }

    setLoading(true);
    const { data, error } = await supabase
      .from('alert')
      .select(
        `
        *,
        medicine:medicineId (*),
        batch:batchId (*)
      `,
      )
      .order('publishedAt', { ascending: false });

    if (!error && data) {
      setAlerts(data as AlertRecord[]);
    }
    setLoading(false);
  }, [isGuest]);

  useEffect(() => {
    fetchAlerts();
  }, [fetchAlerts]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchAlerts();
    setRefreshing(false);
  }, [fetchAlerts]);

  const filteredAlerts = useMemo(
    () => alerts.filter((alert) => (activeTab === 'active' ? alert.isActive : !alert.isActive)),
    [alerts, activeTab],
  );

  const getAlertStyle = (type: AlertRecord['type']) => {
    switch (type) {
      case 'CRITICAL':
        return {
          borderColor: COLORS.error,
          iconBg: COLORS.errorLight,
          iconColor: COLORS.error,
          badgeBg: '#FEE2E2',
          badgeColor: '#991B1B',
          badgeLabel: 'CRÍTICA',
        };
      case 'WARNING':
        return {
          borderColor: COLORS.warning,
          iconBg: COLORS.warningLight,
          iconColor: COLORS.warning,
          badgeBg: '#FEF3C7',
          badgeColor: '#78350F',
          badgeLabel: 'ADVERTENCIA',
        };
      default:
        return {
          borderColor: COLORS.primary,
          iconBg: COLORS.primaryLight,
          iconColor: COLORS.primary,
          badgeBg: COLORS.primaryLight,
          badgeColor: COLORS.primary,
          badgeLabel: 'INFO',
        };
    }
  };

  const disabledMessage = isGuest
    ? 'Inicia sesión para ver las alertas sanitarias más recientes.'
    : null;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <View style={styles.backIcon} />
          </TouchableOpacity>
          <View>
            <Text style={styles.title}>Alertas Sanitarias</Text>
            <Text style={styles.subtitle}>
              Mantente informado sobre medicamentos
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.tabsContainer}>
        <View style={styles.tabs}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'active' && styles.tabActive, isGuest && styles.tabDisabled]}
            onPress={() => setActiveTab('active')}
            disabled={isGuest}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === 'active' && styles.tabTextActive,
              ]}
            >
              Activas ({alerts.filter((a) => a.isActive).length})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'history' && styles.tabActive, isGuest && styles.tabDisabled]}
            onPress={() => setActiveTab('history')}
            disabled={isGuest}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === 'history' && styles.tabTextActive,
              ]}
            >
              Historial ({alerts.filter((a) => !a.isActive).length})
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {disabledMessage ? (
        <View style={styles.disabledCard}>
          <Text style={styles.disabledText}>{disabledMessage}</Text>
        </View>
      ) : (
        <ScrollView
          style={styles.alertsList}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />
          }
        >
          {loading && !refreshing ? (
            <View style={styles.loader}>
              <ActivityIndicator color={COLORS.primary} />
              <Text style={styles.loaderText}>Cargando alertas...</Text>
            </View>
          ) : null}

          {!loading && filteredAlerts.length === 0 && (
            <View style={styles.emptyState}>
              <Text style={styles.emptyTitle}>
                {activeTab === 'active' ? 'Sin alertas activas' : 'Historial vacío'}
              </Text>
              <Text style={styles.emptySubtitle}>
                {activeTab === 'active'
                  ? 'Te avisaremos apenas se publique una nueva alerta.'
                  : 'Aún no tienes alertas anteriores registradas.'}
              </Text>
            </View>
          )}

          {filteredAlerts.map((alert) => {
            const style = getAlertStyle(alert.type);
            return (
              <TouchableOpacity
                key={alert.id}
                style={[styles.alertCard, { borderLeftColor: style.borderColor }]}
                onPress={() => navigation.navigate('AlertDetail', { alertId: alert.id })}
              >
                <View style={styles.alertHeader}>
                  <View
                    style={[
                      styles.alertIconContainer,
                      { backgroundColor: style.iconBg },
                    ]}
                  >
                    <View
                      style={[
                        styles.alertIcon,
                        { backgroundColor: style.iconColor },
                      ]}
                    />
                  </View>
                  <View style={styles.alertContent}>
                    <View style={styles.alertMeta}>
                      <View
                        style={[styles.badge, { backgroundColor: style.badgeBg }]}
                      >
                        <Text
                          style={[styles.badgeText, { color: style.badgeColor }]}
                        >
                          {style.badgeLabel}
                        </Text>
                      </View>
                      <Text style={styles.alertTime}>
                        {formatRelativeTime(alert.publishedAt)}
                      </Text>
                    </View>
                    <Text style={styles.alertTitle}>{alert.title}</Text>
                    <Text style={styles.alertMessage}>{alert.message}</Text>
                    <View style={styles.linkContainer}>
                      <Text style={styles.alertLink}>Ver detalles</Text>
                      <View style={styles.arrow} />
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.small,
  },
  backIcon: {
    width: 12,
    height: 12,
    borderLeftWidth: 3,
    borderBottomWidth: 3,
    borderColor: COLORS.gray700,
    transform: [{ rotate: '45deg' }],
  },
  title: {
    fontSize: SIZES.xxl,
    fontWeight: '700',
    color: COLORS.gray900,
  },
  subtitle: {
    fontSize: SIZES.sm,
    color: COLORS.gray500,
    marginTop: 4,
  },
  tabsContainer: {
    paddingHorizontal: 24,
    marginBottom: 12,
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 4,
    ...SHADOWS.small,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  tabActive: {
    backgroundColor: COLORS.primary,
  },
  tabDisabled: {
    opacity: 0.5,
  },
  tabText: {
    fontSize: SIZES.sm,
    fontWeight: '600',
    color: COLORS.gray600,
  },
  tabTextActive: {
    color: COLORS.white,
  },
  alertsList: {
    flex: 1,
    paddingHorizontal: 24,
  },
  alertCard: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    ...SHADOWS.medium,
  },
  alertHeader: {
    flexDirection: 'row',
    gap: 16,
  },
  alertIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  alertIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  alertContent: {
    flex: 1,
  },
  alertMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  badgeText: {
    fontSize: SIZES.xs,
    fontWeight: '700',
  },
  alertTime: {
    fontSize: SIZES.xs,
    color: COLORS.gray500,
  },
  alertTitle: {
    fontSize: SIZES.base,
    fontWeight: '700',
    color: COLORS.gray900,
    marginBottom: 4,
  },
  alertMessage: {
    fontSize: SIZES.sm,
    color: COLORS.gray600,
  },
  linkContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    gap: 6,
  },
  alertLink: {
    fontSize: SIZES.sm,
    fontWeight: '600',
    color: COLORS.primary,
  },
  arrow: {
    width: 12,
    height: 12,
    borderTopWidth: 2,
    borderRightWidth: 2,
    borderColor: COLORS.primary,
    transform: [{ rotate: '45deg' }],
  },
  loader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  loaderText: {
    color: COLORS.gray500,
    fontSize: SIZES.sm,
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
  disabledCard: {
    marginHorizontal: 24,
    marginTop: 24,
    backgroundColor: COLORS.white,
    padding: 20,
    borderRadius: 16,
    ...SHADOWS.small,
  },
  disabledText: {
    color: COLORS.gray600,
    fontSize: SIZES.base,
    textAlign: 'center',
  },
});
