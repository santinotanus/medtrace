import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  Linking,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList, AlertRecord } from '../../types';
import Button from '../../components/Button';
import { COLORS, SIZES, SHADOWS } from '../../constants/theme';
import { supabase } from '../../lib/supabase';
import { formatDate } from '../../utils/format';

type Props = NativeStackScreenProps<RootStackParamList, 'AlertDetail'>;

export default function AlertDetailScreen({ navigation, route }: Props) {
  const { alertId } = route.params;
  const [alert, setAlert] = useState<AlertRecord | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchAlert = useCallback(async () => {
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
      .eq('id', alertId)
      .maybeSingle();

    if (!error && data) {
      setAlert(data as AlertRecord);
    }
    setLoading(false);
  }, [alertId]);

  useEffect(() => {
    fetchAlert();
  }, [fetchAlert]);

  if (loading || !alert) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator color={COLORS.primary} />
        <Text style={styles.loadingText}>Cargando alerta...</Text>
      </SafeAreaView>
    );
  }

  const recommendations = Array.isArray(alert.recommendations)
    ? alert.recommendations
    : [];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => navigation.goBack()}
        >
          <View style={styles.headerIcon} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Detalle de Alerta</Text>
        <TouchableOpacity style={styles.headerButton} onPress={fetchAlert}>
          <View style={styles.refreshIcon} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.badgeContainer}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>
              {alert.type === 'CRITICAL'
                ? 'ALERTA CRÍTICA'
                : alert.type === 'WARNING'
                ? 'ADVERTENCIA'
                : 'INFORMACIÓN'}
            </Text>
          </View>
        </View>

        <View style={styles.titleContainer}>
          <Text style={styles.title}>{alert.title}</Text>
          {alert.batch?.batchNumber && (
            <Text style={styles.subtitle}>Lote {alert.batch.batchNumber}</Text>
          )}
          <Text style={styles.date}>
            Emitida: {formatDate(alert.publishedAt, { includeTime: true })}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Descripción</Text>
          <View style={styles.card}>
            <Text style={styles.description}>{alert.message}</Text>
            {alert.reason ? (
              <Text style={styles.description}>Motivo: {alert.reason}</Text>
            ) : null}
          </View>
        </View>

        {alert.batch && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Producto Afectado</Text>
            <View style={styles.card}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Medicamento:</Text>
                <Text style={styles.infoValue}>
                  {alert.medicine?.name ?? '—'}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Laboratorio:</Text>
                <Text style={styles.infoValue}>
                  {alert.medicine?.laboratory ?? '—'}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Lote:</Text>
                <Text style={[styles.infoValue, styles.dangerText]}>
                  {alert.batch.batchNumber}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Vencimiento:</Text>
                <Text style={styles.infoValue}>
                  {formatDate(alert.batch.expirationDate)}
                </Text>
              </View>
            </View>
          </View>
        )}

        {recommendations.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recomendaciones</Text>
            <View style={styles.card}>
              {recommendations.map((rec, index) => (
                <View key={rec + index} style={styles.recommendationItem}>
                  <View style={styles.numberBadge}>
                    <Text style={styles.numberText}>{index + 1}</Text>
                  </View>
                  <Text style={styles.recommendationText}>{rec}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {alert.contactInfo && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Contacto</Text>
            <View style={styles.card}>
              {alert.contactInfo.phone && (
                <Text style={styles.contactInfo}>📞 {alert.contactInfo.phone}</Text>
              )}
              {alert.contactInfo.email && (
                <Text style={styles.contactInfo}>✉️ {alert.contactInfo.email}</Text>
              )}
              {alert.contactInfo.website && (
                <Text style={styles.contactInfo}>🌐 {alert.contactInfo.website}</Text>
              )}
            </View>
          </View>
        )}

        <View style={styles.actionsContainer}>
          <Button
            title="Reportar que lo consumí"
            variant="danger"
            onPress={() => navigation.navigate('Report', {
              batchId: alert.batch?.id,
              presetBatchNumber: alert.batch?.batchNumber,
              presetMedicine: alert.medicine?.name,
            })}
            disabled={!alert.batch}
          />
          {alert.officialDocumentUrl && (
            <Button
              title="Ver Comunicado Oficial"
              variant="secondary"
              onPress={() => Linking.openURL(alert.officialDocumentUrl as string)}
              style={styles.secondaryButton}
            />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.background,
  },
  loadingText: {
    marginTop: 12,
    color: COLORS.gray600,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.small,
  },
  headerIcon: {
    width: 20,
    height: 20,
    backgroundColor: COLORS.gray700,
    borderRadius: 4,
  },
  refreshIcon: {
    width: 20,
    height: 2,
    backgroundColor: COLORS.gray700,
  },
  headerTitle: {
    fontSize: SIZES.lg,
    fontWeight: '600',
    color: COLORS.primary,
  },
  badgeContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  badge: {
    backgroundColor: COLORS.errorLight,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
  },
  badgeText: {
    color: COLORS.error,
    fontSize: SIZES.sm,
    fontWeight: '600',
  },
  titleContainer: {
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  title: {
    fontSize: SIZES.xxl,
    fontWeight: '700',
    color: COLORS.gray900,
  },
  subtitle: {
    fontSize: SIZES.base,
    color: COLORS.gray600,
    marginTop: 4,
  },
  date: {
    fontSize: SIZES.sm,
    color: COLORS.gray500,
    marginTop: 4,
  },
  section: {
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: SIZES.lg,
    fontWeight: '600',
    color: COLORS.gray900,
    marginBottom: 12,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 20,
    ...SHADOWS.small,
  },
  description: {
    fontSize: SIZES.base,
    color: COLORS.gray700,
    lineHeight: 22,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: SIZES.sm,
    color: COLORS.gray500,
  },
  infoValue: {
    fontSize: SIZES.sm,
    fontWeight: '600',
    color: COLORS.gray900,
  },
  dangerText: {
    color: COLORS.error,
  },
  recommendationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  numberBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  numberText: {
    color: COLORS.white,
    fontWeight: '700',
  },
  recommendationText: {
    flex: 1,
    fontSize: SIZES.base,
    color: COLORS.gray700,
  },
  contactInfo: {
    fontSize: SIZES.base,
    color: COLORS.gray700,
    marginBottom: 8,
  },
  actionsContainer: {
    paddingHorizontal: 24,
    marginBottom: 32,
    gap: 12,
  },
  secondaryButton: {
    marginTop: 8,
  },
});
