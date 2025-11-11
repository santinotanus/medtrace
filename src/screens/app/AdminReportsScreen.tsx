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
  TextInput,
  Modal,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList, ReportRecord, ReportStatus } from '../../types';
import { COLORS, SIZES, SHADOWS } from '../../constants/theme';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../hooks/useAuth';
import { formatRelativeTime } from '../../utils/format';

type Props = NativeStackScreenProps<RootStackParamList, 'AdminReports'>;

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

export default function AdminReportsScreen({ navigation }: Props) {
  const [activeFilter, setActiveFilter] = useState<ReportStatus | 'ALL'>('PENDING');
  const [reports, setReports] = useState<ReportRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const { profile } = useAuth();

  // Modal state
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedReport, setSelectedReport] = useState<ReportRecord | null>(null);
  const [newStatus, setNewStatus] = useState<ReportStatus>('REVIEWING');
  const [reviewNotes, setReviewNotes] = useState('');
  const [updating, setUpdating] = useState(false);

  const fetchReports = useCallback(async () => {
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
      .order('createdAt', { ascending: false });

    if (!error && data) {
      setReports(data as ReportRecord[]);
    } else if (error) {
      console.error('[AdminReports] Error al cargar reportes:', error.message);
    }
    setLoading(false);
  }, []);

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

  const openUpdateModal = (report: ReportRecord) => {
    setSelectedReport(report);
    setNewStatus(report.status);
    setReviewNotes(report.reviewNotes ?? '');
    setModalVisible(true);
  };

  const handleUpdateReport = async () => {
    if (!selectedReport || !profile) return;

    setUpdating(true);
    const { error } = await supabase
      .from('report')
      .update({
        status: newStatus,
        reviewedBy: profile.id,
        reviewNotes: reviewNotes.trim() || null,
        updatedAt: new Date().toISOString(),
      })
      .eq('id', selectedReport.id);

    if (error) {
      console.error('[AdminReports] Error al actualizar reporte:', error.message);
      Alert.alert('Error', 'No se pudo actualizar el reporte. Intenta nuevamente.');
    } else {
      Alert.alert('Éxito', 'Reporte actualizado correctamente.');
      setModalVisible(false);
      setSelectedReport(null);
      setReviewNotes('');
      await fetchReports();
    }
    setUpdating(false);
  };

  const goToCreateAlert = (report: ReportRecord) => {
    navigation.navigate('CreateAlert', {
      reportId: report.id,
      batchId: report.batchId,
    });
  };

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

  if (profile?.role !== 'ADMIN') {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <View style={styles.backIcon} />
          </TouchableOpacity>
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>No tienes permisos para acceder a esta sección.</Text>
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
            <Text style={styles.title}>Gestión de Reportes</Text>
            <Text style={styles.subtitle}>Panel administrativo</Text>
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
          style={[styles.filterChip, activeFilter === 'PENDING' && styles.filterChipActive]}
          onPress={() => setActiveFilter('PENDING')}
        >
          <Text style={[styles.filterText, activeFilter === 'PENDING' && styles.filterTextActive]}>
            Pendientes ({reports.filter((r) => r.status === 'PENDING').length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterChip, activeFilter === 'REVIEWING' && styles.filterChipActive]}
          onPress={() => setActiveFilter('REVIEWING')}
        >
          <Text style={[styles.filterText, activeFilter === 'REVIEWING' && styles.filterTextActive]}>
            En Revisión ({reports.filter((r) => r.status === 'REVIEWING').length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterChip, activeFilter === 'RESOLVED' && styles.filterChipActive]}
          onPress={() => setActiveFilter('RESOLVED')}
        >
          <Text style={[styles.filterText, activeFilter === 'RESOLVED' && styles.filterTextActive]}>
            Resueltos ({reports.filter((r) => r.status === 'RESOLVED').length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterChip, activeFilter === 'REJECTED' && styles.filterChipActive]}
          onPress={() => setActiveFilter('REJECTED')}
        >
          <Text style={[styles.filterText, activeFilter === 'REJECTED' && styles.filterTextActive]}>
            Rechazados ({reports.filter((r) => r.status === 'REJECTED').length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterChip, activeFilter === 'ALL' && styles.filterChipActive]}
          onPress={() => setActiveFilter('ALL')}
        >
          <Text style={[styles.filterText, activeFilter === 'ALL' && styles.filterTextActive]}>
            Todos ({reports.length})
          </Text>
        </TouchableOpacity>
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
                ? 'No hay reportes en el sistema.'
                : `No hay reportes con estado "${STATUS_LABELS[activeFilter]}".`}
            </Text>
          </View>
        )}

        {filteredReports.map((report) => {
          const statusStyle = STATUS_COLORS[report.status];
          return (
            <View key={report.id} style={[styles.reportCard, { borderLeftColor: statusStyle.border }]}>
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

                {report.reviewedBy && report.reviewer && (
                  <View style={styles.reviewInfo}>
                    <Text style={styles.reviewLabel}>Revisado por: {report.reviewer.name}</Text>
                  </View>
                )}
              </View>

              <View style={styles.actionsRow}>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => navigation.navigate('ReportDetail', { reportId: report.id })}
                >
                  <Text style={styles.actionButtonText}>Ver Detalle</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.actionButton, styles.actionButtonPrimary]}
                  onPress={() => openUpdateModal(report)}
                >
                  <Text style={styles.actionButtonTextPrimary}>Actualizar</Text>
                </TouchableOpacity>
                {(report.status === 'REVIEWING' || report.severity === 'SEVERE') && (
                  <TouchableOpacity
                    style={[styles.actionButton, styles.actionButtonAlert]}
                    onPress={() => goToCreateAlert(report)}
                  >
                    <Text style={styles.actionButtonTextAlert}>Crear Alerta</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          );
        })}
      </ScrollView>

      {/* Modal de actualización */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalOverlay}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Actualizar Reporte</Text>

            <Text style={styles.modalLabel}>Estado:</Text>
            <View style={styles.statusOptions}>
              {(['PENDING', 'REVIEWING', 'RESOLVED', 'REJECTED'] as ReportStatus[]).map((status) => (
                <TouchableOpacity
                  key={status}
                  style={[
                    styles.statusOption,
                    newStatus === status && styles.statusOptionActive,
                  ]}
                  onPress={() => setNewStatus(status)}
                >
                  <Text
                    style={[
                      styles.statusOptionText,
                      newStatus === status && styles.statusOptionTextActive,
                    ]}
                  >
                    {STATUS_LABELS[status]}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.modalLabel}>Notas de revisión:</Text>
            <TextInput
              style={styles.textArea}
              placeholder="Escribe notas sobre la revisión..."
              placeholderTextColor={COLORS.gray400}
              value={reviewNotes}
              onChangeText={setReviewNotes}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalButtonCancel}
                onPress={() => setModalVisible(false)}
                disabled={updating}
              >
                <Text style={styles.modalButtonCancelText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalButtonConfirm}
                onPress={handleUpdateReport}
                disabled={updating}
              >
                {updating ? (
                  <ActivityIndicator color={COLORS.white} />
                ) : (
                  <Text style={styles.modalButtonConfirmText}>Guardar</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
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
  reviewInfo: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: COLORS.gray200,
  },
  reviewLabel: {
    fontSize: SIZES.xs,
    color: COLORS.primary,
    fontWeight: '600',
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  actionButton: {
    flex: 1,
    minWidth: 100,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: COLORS.gray100,
    alignItems: 'center',
  },
  actionButtonPrimary: {
    backgroundColor: COLORS.primary,
  },
  actionButtonAlert: {
    backgroundColor: COLORS.error,
  },
  actionButtonText: {
    fontSize: SIZES.sm,
    fontWeight: '600',
    color: COLORS.gray700,
  },
  actionButtonTextPrimary: {
    fontSize: SIZES.sm,
    fontWeight: '600',
    color: COLORS.white,
  },
  actionButtonTextAlert: {
    fontSize: SIZES.sm,
    fontWeight: '600',
    color: COLORS.white,
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  errorText: {
    fontSize: SIZES.base,
    color: COLORS.error,
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: SIZES.xl,
    fontWeight: '700',
    color: COLORS.gray900,
    marginBottom: 20,
  },
  modalLabel: {
    fontSize: SIZES.base,
    fontWeight: '600',
    color: COLORS.gray700,
    marginBottom: 8,
  },
  statusOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
  },
  statusOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: COLORS.gray100,
    borderWidth: 2,
    borderColor: COLORS.gray100,
  },
  statusOptionActive: {
    backgroundColor: COLORS.primaryLight,
    borderColor: COLORS.primary,
  },
  statusOptionText: {
    fontSize: SIZES.sm,
    fontWeight: '600',
    color: COLORS.gray700,
  },
  statusOptionTextActive: {
    color: COLORS.primary,
  },
  textArea: {
    backgroundColor: COLORS.gray50,
    borderRadius: 16,
    padding: 16,
    fontSize: SIZES.base,
    color: COLORS.gray900,
    minHeight: 100,
    marginBottom: 20,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButtonCancel: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 16,
    backgroundColor: COLORS.gray100,
    alignItems: 'center',
  },
  modalButtonCancelText: {
    fontSize: SIZES.base,
    fontWeight: '600',
    color: COLORS.gray700,
  },
  modalButtonConfirm: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 16,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
  },
  modalButtonConfirmText: {
    fontSize: SIZES.base,
    fontWeight: '600',
    color: COLORS.white,
  },
});
