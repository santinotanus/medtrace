import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Image,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList, ReportRecord, ReportStatus } from '../../types';
import { COLORS, SIZES, SHADOWS } from '../../constants/theme';
import { supabase } from '../../lib/supabase';
import { formatRelativeTime } from '../../utils/format';

type Props = NativeStackScreenProps<RootStackParamList, 'ReportDetail'>;

const { width } = Dimensions.get('window');

const STATUS_LABELS: Record<ReportStatus, string> = {
  PENDING: 'Pendiente',
  REVIEWING: 'En Revisión',
  RESOLVED: 'Resuelto',
  REJECTED: 'Rechazado',
};

const STATUS_COLORS: Record<ReportStatus, { bg: string; text: string }> = {
  PENDING: { bg: '#FEF3C7', text: '#78350F' },
  REVIEWING: { bg: COLORS.primaryLight, text: COLORS.primary },
  RESOLVED: { bg: COLORS.successLight, text: COLORS.success },
  REJECTED: { bg: COLORS.errorLight, text: COLORS.error },
};

export default function ReportDetailScreen({ navigation, route }: Props) {
  const { reportId } = route.params;
  const [report, setReport] = useState<ReportRecord | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchReport = useCallback(async () => {
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
        ),
        reporter:userId (
          id,
          name,
          email
        )
      `,
      )
      .eq('id', reportId)
      .single();

    if (!error && data) {
      setReport(data as ReportRecord);
    } else if (error) {
      console.error('[ReportDetail] Error al cargar reporte:', error.message);
    }
    setLoading(false);
  }, [reportId]);

  useEffect(() => {
    fetchReport();
  }, [fetchReport]);

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

  const getSeverityLabel = (severity: ReportRecord['severity']) => {
    switch (severity) {
      case 'SEVERE':
        return 'Alta';
      case 'MODERATE':
        return 'Media';
      case 'MILD':
        return 'Leve';
      default:
        return severity;
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

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <View style={styles.backIcon} />
          </TouchableOpacity>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Cargando reporte...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!report) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <View style={styles.backIcon} />
          </TouchableOpacity>
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>No se pudo cargar el reporte.</Text>
        </View>
      </SafeAreaView>
    );
  }

  const statusStyle = STATUS_COLORS[report.status];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <View style={styles.backIcon} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Detalle del Reporte</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <View style={styles.statusContainer}>
            <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg }]}>
              <Text style={[styles.statusText, { color: statusStyle.text }]}>
                {STATUS_LABELS[report.status]}
              </Text>
            </View>
            <Text style={styles.dateText}>{formatRelativeTime(report.createdAt)}</Text>
          </View>

          <Text style={styles.reportType}>{getReportTypeLabel(report.type)}</Text>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Medicamento:</Text>
            <Text style={styles.infoValue}>
              {report.batch?.medicine?.name ?? 'Desconocido'}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Dosis:</Text>
            <Text style={styles.infoValue}>
              {report.batch?.medicine?.dosage ?? '—'}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Laboratorio:</Text>
            <Text style={styles.infoValue}>
              {report.batch?.medicine?.laboratory ?? '—'}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Lote:</Text>
            <Text style={styles.infoValue}>{report.batch?.batchNumber ?? '—'}</Text>
          </View>

          {!report.isAnonymous && report.reporter && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Reportado por:</Text>
              <Text style={styles.infoValue}>{report.reporter.name}</Text>
            </View>
          )}

          {report.isAnonymous && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Reportado por:</Text>
              <Text style={styles.infoValue}>Anónimo</Text>
            </View>
          )}

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Severidad:</Text>
            <View style={styles.severityContainer}>
              <View
                style={[styles.severityDot, { backgroundColor: getSeverityColor(report.severity) }]}
              />
              <Text style={[styles.infoValue, { color: getSeverityColor(report.severity) }]}>
                {getSeverityLabel(report.severity)}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Descripción</Text>
          <Text style={styles.description}>{report.description}</Text>
        </View>

        {report.photos && report.photos.length > 0 && (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Fotos adjuntas ({report.photos.length})</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.photosScroll}>
              {report.photos.map((photoUrl, index) => (
                <View key={index} style={styles.photoContainer}>
                  <Image source={{ uri: photoUrl }} style={styles.photo} />
                </View>
              ))}
            </ScrollView>
          </View>
        )}

        {report.reviewNotes && (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Respuesta del Equipo</Text>
            {report.reviewer && (
              <View style={styles.reviewInfo}>
                <Text style={styles.reviewLabel}>Revisado por:</Text>
                <Text style={styles.reviewValue}>{report.reviewer.name}</Text>
              </View>
            )}
            <Text style={styles.reviewLabel}>Notas:</Text>
            <Text style={styles.reviewNotes}>{report.reviewNotes}</Text>
          </View>
        )}

        {report.status === 'PENDING' && (
          <View style={styles.infoCard}>
            <Text style={styles.infoCardText}>
              Tu reporte está pendiente de revisión. Te notificaremos cuando haya actualizaciones.
            </Text>
          </View>
        )}

        {report.status === 'REVIEWING' && (
          <View style={[styles.infoCard, { backgroundColor: COLORS.primaryLight }]}>
            <Text style={styles.infoCardText}>
              Tu reporte está siendo revisado por nuestro equipo. Gracias por tu colaboración.
            </Text>
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
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
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
  headerTitle: {
    fontSize: SIZES.lg,
    fontWeight: '700',
    color: COLORS.gray900,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    ...SHADOWS.medium,
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  statusBadge: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    fontSize: SIZES.sm,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  dateText: {
    fontSize: SIZES.sm,
    color: COLORS.gray500,
  },
  reportType: {
    fontSize: SIZES.xxl,
    fontWeight: '700',
    color: COLORS.gray900,
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray100,
  },
  infoLabel: {
    fontSize: SIZES.base,
    color: COLORS.gray600,
    fontWeight: '500',
  },
  infoValue: {
    fontSize: SIZES.base,
    color: COLORS.gray900,
    fontWeight: '600',
    maxWidth: '60%',
    textAlign: 'right',
  },
  severityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  severityDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  sectionTitle: {
    fontSize: SIZES.lg,
    fontWeight: '700',
    color: COLORS.gray900,
    marginBottom: 12,
  },
  description: {
    fontSize: SIZES.base,
    color: COLORS.gray700,
    lineHeight: 24,
  },
  photosScroll: {
    marginTop: 8,
  },
  photoContainer: {
    marginRight: 12,
    borderRadius: 12,
    overflow: 'hidden',
  },
  photo: {
    width: width * 0.6,
    height: width * 0.6,
    borderRadius: 12,
  },
  reviewInfo: {
    marginBottom: 12,
  },
  reviewLabel: {
    fontSize: SIZES.sm,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: 4,
  },
  reviewValue: {
    fontSize: SIZES.base,
    color: COLORS.gray700,
    marginBottom: 12,
  },
  reviewNotes: {
    fontSize: SIZES.base,
    color: COLORS.gray700,
    lineHeight: 24,
    marginTop: 4,
  },
  infoCard: {
    backgroundColor: COLORS.warningLight,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  infoCardText: {
    fontSize: SIZES.sm,
    color: COLORS.gray700,
    lineHeight: 20,
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  loadingText: {
    fontSize: SIZES.base,
    color: COLORS.gray600,
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
});
