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
import { RootStackParamList, AlertRecord } from '../../types';
import Button from '../../components/Button';
import { COLORS, SIZES, SHADOWS } from '../../constants/theme';
import { formatDate } from '../../utils/format';

type Props = NativeStackScreenProps<RootStackParamList, 'ScanResultAlert'>;

export default function ScanResultAlertScreen({ navigation, route }: Props) {
  const { batch } = route.params;

  const currentAlert = useMemo<AlertRecord | null>(() => {
    if (batch.alerts && batch.alerts.length > 0) {
      return batch.alerts[0];
    }
    return null;
  }, [batch.alerts]);

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
          <View style={styles.alertCard}>
            <View style={styles.alertIconContainer}>
              <View style={styles.alertIcon} />
            </View>
            <Text style={styles.alertTitle}>⚠️ NO USAR</Text>
            <Text style={styles.alertSubtitle}>
              Este lote tiene una alerta sanitaria vigente
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.detailsCard}>
            <View style={styles.detailsHeader}>
              <View style={styles.detailsIcon} />
              <View style={styles.detailsHeaderText}>
                <Text style={styles.detailsTitle}>
                  {currentAlert?.title ?? 'Lote en revisión'}
                </Text>
                <Text style={styles.detailsDate}>
                  {currentAlert
                    ? `Emitida ${formatDate(currentAlert.publishedAt, { includeTime: true })}`
                    : 'Estado crítico reportado'}
                </Text>
              </View>
            </View>
            <Text style={styles.detailsDescription}>
              {currentAlert?.message ??
                'Este lote fue marcado como no seguro. Por favor seguí las instrucciones para minimizar el riesgo.'}
            </Text>
            {currentAlert?.reason && (
              <View style={styles.reasonBox}>
                <Text style={styles.reasonText}>Motivo: {currentAlert.reason}</Text>
              </View>
            )}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Información del Producto</Text>
          <View style={styles.infoCard}>
            <Text style={styles.medicineTitle}>
              {batch.medicine?.name} {batch.medicine?.dosage}
            </Text>
            <InfoRow label="Laboratorio" value={batch.medicine?.laboratory ?? '—'} />
            <InfoRow label="Lote" value={batch.batchNumber} highlight />
            <InfoRow label="Vencimiento" value={formatDate(batch.expirationDate)} />
            <InfoRow label="Estado" value={batch.status} highlight />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>¿Qué hacer?</Text>
          <View style={styles.instructionsCard}>
            {currentAlert?.recommendations && currentAlert.recommendations.length > 0 ? (
              currentAlert.recommendations.map((rec, index) => (
                <Instruction key={rec} index={index + 1} text={rec} />
              ))
            ) : (
              <>
                <Instruction index={1} text="NO consumir el medicamento bajo ninguna circunstancia." />
                <Instruction index={2} text="Devolver el producto a la farmacia donde lo adquiriste." />
                <Instruction index={3} text="Si ya lo consumiste, consultá inmediatamente a tu médico." />
                <Instruction index={4} text="Reportá cualquier efecto adverso desde la app." />
              </>
            )}
          </View>
        </View>

        <View style={styles.actionsContainer}>
          <Button
            title="Reportar Problema"
            variant="danger"
            onPress={() =>
              navigation.navigate('Report', {
                batchId: batch.id,
                presetBatchNumber: batch.batchNumber,
                presetMedicine: batch.medicine?.name,
              })
            }
          />
          <Button
            title="Ver Comunicado ANMAT"
            variant="secondary"
            onPress={() => navigation.navigate('AlertDetail', { alertId: currentAlert?.id ?? batch.id })}
            style={styles.secondaryButton}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const InfoRow = ({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) => (
  <View style={styles.infoRow}>
    <Text style={styles.infoLabel}>{label}</Text>
    <Text style={[styles.infoValue, highlight && styles.infoValueDanger]}>{value}</Text>
  </View>
);

const Instruction = ({ index, text }: { index: number; text: string }) => (
  <View style={styles.instructionStep}>
    <View style={styles.stepNumber}>
      <Text style={styles.stepNumberText}>{index}</Text>
    </View>
    <Text style={styles.stepText}>{text}</Text>
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
  alertCard: {
    backgroundColor: COLORS.errorLight,
    borderWidth: 2,
    borderColor: COLORS.error,
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    ...SHADOWS.medium,
  },
  alertIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FEE2E2',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  alertIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.error,
  },
  alertTitle: {
    fontSize: SIZES.xxl,
    fontWeight: 'bold',
    color: '#991B1B',
    marginBottom: 8,
  },
  alertSubtitle: {
    fontSize: SIZES.base,
    color: COLORS.gray700,
    textAlign: 'center',
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
  detailsCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 24,
    ...SHADOWS.small,
  },
  detailsHeader: {
    flexDirection: 'row',
    gap: 16,
  },
  detailsIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.errorLight,
  },
  detailsHeaderText: {
    flex: 1,
  },
  detailsTitle: {
    fontSize: SIZES.base,
    fontWeight: '700',
    color: COLORS.gray900,
  },
  detailsDate: {
    fontSize: SIZES.sm,
    color: COLORS.gray500,
    marginTop: 4,
  },
  detailsDescription: {
    fontSize: SIZES.base,
    color: COLORS.gray700,
    marginTop: 12,
    lineHeight: 22,
  },
  reasonBox: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.error,
    marginTop: 12,
  },
  reasonText: {
    color: COLORS.error,
    fontWeight: '600',
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
  infoValueDanger: {
    color: COLORS.error,
  },
  instructionsCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    ...SHADOWS.small,
  },
  instructionStep: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.error,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumberText: {
    color: COLORS.white,
    fontWeight: '700',
  },
  stepText: {
    flex: 1,
    color: COLORS.gray800,
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
