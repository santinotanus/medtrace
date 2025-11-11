import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList, TraceabilityStep } from '../../types';
import Button from '../../components/Button';
import { COLORS, SIZES, SHADOWS } from '../../constants/theme';
import { formatDate } from '../../utils/format';

type Props = NativeStackScreenProps<RootStackParamList, 'ScanResultSafe'>;

export default function ScanResultSafeScreen({ navigation, route }: Props) {
  const { batch } = route.params;
  const traceSteps = useMemo<TraceabilityStep[]>(
    () =>
      (batch.trace_steps ?? []).slice().sort((a, b) => (a.step ?? 0) - (b.step ?? 0)),
    [batch.trace_steps],
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => navigation.popToTop()}
        >
          <View style={styles.headerIcon} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Resultado</Text>
        <View style={styles.headerButton} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.statusContainer}>
          <View style={styles.statusCard}>
            <View style={styles.statusIconContainer}>
              <View style={styles.statusIcon} />
            </View>
            <Text style={styles.statusTitle}>Medicamento Seguro</Text>
            <Text style={styles.statusSubtitle}>Verificado en blockchain</Text>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.infoCard}>
            <Text style={styles.medicineTitle}>
              {batch.medicine?.name} {batch.medicine?.dosage}
            </Text>
            <InfoRow label="Laboratorio" value={batch.medicine?.laboratory ?? '—'} />
            <InfoRow label="Lote" value={batch.batchNumber} />
            <InfoRow label="Vencimiento" value={formatDate(batch.expirationDate)} />
            <InfoRow
              label="Registro ANMAT"
              value={batch.medicine?.anmatRegistry ?? 'No informado'}
            />
            <InfoRow label="Estado" value={batch.status} />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Trazabilidad</Text>
          <View style={styles.traceCard}>
            {traceSteps.length === 0 && (
              <Text style={styles.emptyTrace}>
                Aún no se registraron pasos de trazabilidad para este lote.
              </Text>
            )}
            {traceSteps.map((step, index) => (
              <View key={step.id} style={styles.traceStep}>
                <View style={styles.traceStepLeft}>
                  <View style={styles.traceStepIcon}>
                    <View style={styles.traceStepIconInner} />
                  </View>
                  {index < traceSteps.length - 1 && <View style={styles.traceStepLine} />}
                </View>
                <View style={styles.traceStepContent}>
                  <Text style={styles.traceStepTitle}>{step.title}</Text>
                  <Text style={styles.traceStepDescription}>{step.location}</Text>
                  <Text style={styles.traceStepDate}>
                    {formatDate(step.timestamp, { includeTime: true })}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.actionsContainer}>
          <Button
            title="Reportar un problema"
            onPress={() =>
              navigation.navigate('Report', {
                batchId: batch.id,
                presetBatchNumber: batch.batchNumber,
                presetMedicine: batch.medicine?.name,
              })
            }
          />
          <Button
            title="Ver alertas sanitarias"
            variant="secondary"
            onPress={() => navigation.navigate('Alerts')}
            style={styles.secondaryButton}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const InfoRow = ({ label, value }: { label: string; value: string }) => (
  <View style={styles.infoRow}>
    <Text style={styles.infoLabel}>{label}</Text>
    <Text style={styles.infoValue}>{value}</Text>
  </View>
);

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
  headerTitle: {
    fontSize: SIZES.lg,
    fontWeight: '600',
    color: COLORS.primary,
  },
  statusContainer: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  statusCard: {
    backgroundColor: COLORS.successLight,
    borderWidth: 2,
    borderColor: COLORS.success,
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    ...SHADOWS.medium,
  },
  statusIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#D1FAE5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  statusIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.success,
  },
  statusTitle: {
    fontSize: SIZES.xxl,
    fontWeight: 'bold',
    color: '#065F46',
    marginBottom: 8,
  },
  statusSubtitle: {
    fontSize: SIZES.base,
    color: COLORS.gray600,
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
  infoCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 24,
    ...SHADOWS.small,
  },
  medicineTitle: {
    fontSize: SIZES.xl,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  infoLabel: {
    fontSize: SIZES.base,
    color: COLORS.gray500,
  },
  infoValue: {
    fontSize: SIZES.base,
    fontWeight: '600',
    color: COLORS.gray900,
  },
  traceCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 24,
    ...SHADOWS.small,
  },
  emptyTrace: {
    color: COLORS.gray500,
    textAlign: 'center',
  },
  traceStep: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  traceStepLeft: {
    alignItems: 'center',
    marginRight: 16,
  },
  traceStepIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 4,
    borderColor: COLORS.success,
    alignItems: 'center',
    justifyContent: 'center',
  },
  traceStepIconInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: COLORS.success,
  },
  traceStepLine: {
    width: 2,
    flex: 1,
    backgroundColor: COLORS.gray200,
    marginTop: 4,
  },
  traceStepContent: {
    flex: 1,
  },
  traceStepTitle: {
    fontSize: SIZES.base,
    fontWeight: '600',
    color: COLORS.gray900,
  },
  traceStepDescription: {
    fontSize: SIZES.sm,
    color: COLORS.gray600,
  },
  traceStepDate: {
    fontSize: SIZES.xs,
    color: COLORS.gray500,
    marginTop: 4,
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
