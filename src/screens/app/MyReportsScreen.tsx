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
import { RootStackParamList, ReportRecord, ReportStatus } from '../../types';
import { COLORS, SIZES, SHADOWS } from '../../constants/theme';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../hooks/useAuth';
import { formatRelativeTime } from '../../utils/format';

type Props = NativeStackScreenProps<RootStackParamList, 'MyReports'>;

const STATUS_LABELS: Record<ReportStatus, string> = {
  PENDING: 'Pendiente',
  REVIEWING: 'En Revisión',
  RESOLVED: 'Resuelto',
  REJECTED: 'Rechazado',
};

const STATUS_COLORS: Record<ReportStatus, { bg: string; text: string; border: string }> = {
  PENDING: { bg: '#FEF3C7', text: '#78350F', border: COLORS.warning },
  REVIEWING: { bg: COLORS.primaryLight, text: COLORS.primary, border: COLORS.primary },
  RESOLVED: { bg: COLORS.successLight, text: COLORS.success, border: COLORS.success },
  REJECTED: { bg: COLORS.errorLight, text: COLORS.error, border: COLORS.error },
};

export default function MyReportsScreen({ navigation }: Props) {
  const [activeFilter, setActiveFilter] = useState<ReportStatus | 'ALL'>('ALL');
  const [reports, setReports] = useState<ReportRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const { profile, isGuest } = useAuth();

  const fetchReports = useCallback(async () => {
    if (isGuest || !profile) {
      setReports([]);
      return;
    }

    setLoading(true);
    const { data, error } = await supabase
      .from('report')
      .select(
        `
        *,
        batch:batchId (
          *,
          medicine:medicineId (*)
        ),
        reviewer:reviewedBy (
          id,
          name
        )
      `,
      )
      .eq('userId', profile.id)
      .order('createdAt', { ascending: false });

    if (!error && data) {
      setReports(data as ReportRecord[]);
    } else if (error) {
      console.error('[MyReports] Error al cargar reportes:', error.message);
    }
    setLoading(false);
  }, [isGuest, profile]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchReports();
    setRefreshing(false);
  }, [fetchReports]);

  const filteredReports = useMemo(() => {
    if (activeFilter === 'ALL') return reports;
    return reports.filter((r) => r.status === activeFilter);
  }, [reports, activeFilter]);

  const getReportTypeLabel = (type: ReportRecord['type']) => {
    switch (type) {
      case 'ADVERSE_EFFECT':
        return 'Efecto Adverso';
      case 'QUALITY_ISSUE':
        return 'Problema de Calidad';
      case 'COUNTERFEIT':
        return 'Falsificación';
      default:
        return type;
    }
  };

  const getSeverityColor = (severity: ReportRecord['severity']) => {
    switch (severity) {
      case 'SEVERE':
        return COLORS.error;
      case 'MODERATE':
        return COLORS.warning;
      case 'MILD':
        return COLORS.gray600;
      default:
        return COLORS.gray600;
    }
  };

  if (isGuest) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <View style={styles.backIcon} />
          </TouchableOpacity>
          <View>
            <Text style={styles.title}>Mis Reportes</Text>
          </View>
        </View>
        <View style={styles.disabledCard}>
          <Text style={styles.disabledText}>Inicia sesión para ver tus reportes.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <View style={styles.backIcon} />
          </TouchableOpacity>
          <View>
            <Text style={styles.title}>Mis Reportes</Text>
            <Text style={styles.subtitle}>Historial de problemas reportados</Text>
          </View>
        </View>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filtersScroll}
        contentContainerStyle={styles.filtersContent}
      >
        <TouchableOpacity
          style={[styles.filterChip, activeFilter === 'ALL' && styles.filterChipActive]}
          onPress={() => setActiveFilter('ALL')}
        >
          <Text style={[styles.filterText, activeFilter === 'ALL' && styles.filterTextActive]}>
            Todos ({reports.length})
          </Text>
        </TouchableOpacity>
        {(['PENDING', 'REVIEWING', 'RESOLVED', 'REJECTED'] as ReportStatus[]).map((status) => (
          <TouchableOpacity
            key={status}
            style={[styles.filterChip, activeFilter === status && styles.filterChipActive]}
            onPress={() => setActiveFilter(status)}
          >
            <Text style={[styles.filterText, activeFilter === status && styles.filterTextActive]}>
              {STATUS_LABELS[status]} ({reports.filter((r) => r.status === status).length})
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView
        style={styles.reportsList}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />
        }
      >
        {loading && !refreshing ? (
          <View style={styles.loader}>
            <ActivityIndicator color={COLORS.primary} />
            <Text style={styles.loaderText}>Cargando reportes...</Text>
          </View>
        ) : null}

        {!loading && filteredReports.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>Sin reportes</Text>
            <Text style={styles.emptySubtitle}>
              {activeFilter === 'ALL'
                ? 'Aún no has reportado ningún problema.'
                : `No tienes reportes con estado "${STATUS_LABELS[activeFilter]}".`}
            </Text>
          </View>
        )}

        {filteredReports.map((report) => {
          const statusStyle = STATUS_COLORS[report.status];
          return (
            <TouchableOpacity
              key={report.id}
              style={[styles.reportCard, { borderLeftColor: statusStyle.border }]}
              onPress={() => navigation.navigate('ReportDetail', { reportId: report.id })}
            >
              <View style={styles.reportHeader}>
                <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg }]}>
                  <Text style={[styles.statusText, { color: statusStyle.text }]}>
                    {STATUS_LABELS[report.status]}
                  </Text>
                </View>
                <Text style={styles.reportTime}>{formatRelativeTime(report.createdAt)}</Text>
              </View>

              <View style={styles.reportBody}>
                <Text style={styles.reportType}>{getReportTypeLabel(report.type)}</Text>
                <Text style={styles.reportMedicine}>
                  {report.batch?.medicine?.name ?? 'Medicamento'} -{' '}
                  {report.batch?.medicine?.dosage ?? ''}
                </Text>
                <Text style={styles.reportBatch}>Lote: {report.batch?.batchNumber ?? '—'}</Text>
                <Text style={styles.reportDescription} numberOfLines={2}>
                  {report.description}
                </Text>

                <View style={styles.reportFooter}>
                  <View style={styles.severityContainer}>
                    <View
                      style={[
                        styles.severityDot,
                        { backgroundColor: getSeverityColor(report.severity) },
                      ]}
                    />
                    <Text style={styles.severityText}>
                      Severidad:{' '}
                      {report.severity === 'SEVERE'
                        ? 'Alta'
                        : report.severity === 'MODERATE'
                          ? 'Media'
                          : 'Leve'}
                    </Text>
                  </View>
                  {report.photos && report.photos.length > 0 && (
                    <View style={styles.photoIndicator}>
                      <Text style={styles.photoCount}>📷 {report.photos.length}</Text>
                    </View>
                  )}
                </View>

                {report.reviewNotes && (
                  <View style={styles.reviewNotesContainer}>
                    {report.reviewer && (
                      <Text style={styles.reviewNotesLabel}>
                        Respuesta de {report.reviewer.name}:
                      </Text>
                    )}
                    {!report.reviewer && (
                      <Text style={styles.reviewNotesLabel}>Respuesta del equipo:</Text>
                    )}
                    <Text style={styles.reviewNotesText} numberOfLines={2}>
                      {report.reviewNotes}
                    </Text>
                  </View>
                )}
              </View>

              <View style={styles.linkContainer}>
                <Text style={styles.reportLink}>Ver detalles</Text>
                <View style={styles.arrow} />
              </View>
            </TouchableOpacity>
          );
        })}
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
  filtersScroll: {
    maxHeight: 50,
    marginBottom: 12,
  },
  filtersContent: {
    paddingHorizontal: 24,
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.gray200,
  },
  filterChipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  filterText: {
    fontSize: SIZES.sm,
    fontWeight: '600',
    color: COLORS.gray700,
  },
  filterTextActive: {
    color: COLORS.white,
  },
  reportsList: {
    flex: 1,
    paddingHorizontal: 24,
  },
  reportCard: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    ...SHADOWS.medium,
  },
  reportHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: SIZES.xs,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  reportTime: {
    fontSize: SIZES.xs,
    color: COLORS.gray500,
  },
  reportBody: {
    marginBottom: 12,
  },
  reportType: {
    fontSize: SIZES.lg,
    fontWeight: '700',
    color: COLORS.gray900,
    marginBottom: 4,
  },
  reportMedicine: {
    fontSize: SIZES.base,
    fontWeight: '600',
    color: COLORS.gray700,
    marginBottom: 2,
  },
  reportBatch: {
    fontSize: SIZES.sm,
    color: COLORS.gray600,
    marginBottom: 8,
  },
  reportDescription: {
    fontSize: SIZES.sm,
    color: COLORS.gray600,
    lineHeight: 20,
  },
  reportFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  severityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  severityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  severityText: {
    fontSize: SIZES.xs,
    color: COLORS.gray600,
  },
  photoIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  photoCount: {
    fontSize: SIZES.xs,
    color: COLORS.gray600,
  },
  reviewNotesContainer: {
    marginTop: 12,
    padding: 12,
    backgroundColor: COLORS.primaryLight,
    borderRadius: 12,
  },
  reviewNotesLabel: {
    fontSize: SIZES.xs,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: 4,
  },
  reviewNotesText: {
    fontSize: SIZES.sm,
    color: COLORS.gray700,
    lineHeight: 18,
  },
  linkContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  reportLink: {
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
