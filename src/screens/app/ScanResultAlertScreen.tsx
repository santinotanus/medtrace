import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types';
import Button from '../../components/Button';
import { COLORS, SIZES, SHADOWS } from '../../constants/theme';

type Props = NativeStackScreenProps<RootStackParamList, 'ScanResultAlert'>;

export default function ScanResultAlertScreen({ navigation, route }: Props) {
  const isGuest = route.params?.guest;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => navigation.popToTop()}
        >
          <View style={styles.headerIcon} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Resultado</Text>
        <TouchableOpacity style={styles.headerButton}>
          <View style={styles.headerIcon} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Alert Status */}
        <View style={styles.statusContainer}>
          <View style={styles.alertCard}>
            <View style={styles.alertIconContainer}>
              <View style={styles.alertIcon} />
            </View>
            <Text style={styles.alertTitle}>⚠️ NO USAR</Text>
            <Text style={styles.alertSubtitle}>Medicamento con alerta sanitaria</Text>
          </View>
        </View>

        {/* Alert Details */}
        <View style={styles.section}>
          <View style={styles.detailsCard}>
            <View style={styles.detailsHeader}>
              <View style={styles.detailsIcon} />
              <View style={styles.detailsHeaderText}>
                <Text style={styles.detailsTitle}>Alerta Sanitaria Crítica</Text>
                <Text style={styles.detailsDate}>Emitida por ANMAT - 25/03/2024</Text>
              </View>
            </View>
            <Text style={styles.detailsDescription}>
              Este lote ha sido retirado del mercado por contaminación detectada
              durante controles de calidad. NO consumir bajo ninguna circunstancia.
            </Text>
            <View style={styles.reasonBox}>
              <Text style={styles.reasonText}>
                Motivo: Contaminación con sustancias no autorizadas
              </Text>
            </View>
          </View>
        </View>

        {/* Medicine Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Información del Producto</Text>
          <View style={styles.infoCard}>
            <Text style={styles.medicineTitle}>Ibuprofeno 600mg</Text>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Laboratorio</Text>
              <Text style={styles.infoValue}>Lab. XYZ S.A.</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Lote</Text>
              <Text style={[styles.infoValue, styles.infoValueDanger]}>X2847</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Vencimiento</Text>
              <Text style={styles.infoValue}>08/2025</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Estado</Text>
              <Text style={[styles.infoValue, styles.infoValueDanger]}>RETIRADO</Text>
            </View>
          </View>
        </View>

        {/* Instructions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>¿Qué hacer?</Text>
          <View style={styles.instructionsCard}>
            <View style={styles.instructionStep}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>1</Text>
              </View>
              <Text style={styles.stepText}>
                NO consumir el medicamento bajo ninguna circunstancia
              </Text>
            </View>
            <View style={styles.instructionStep}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>2</Text>
              </View>
              <Text style={styles.stepText}>
                Devolver el producto a la farmacia donde lo adquirió
              </Text>
            </View>
            <View style={styles.instructionStep}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>3</Text>
              </View>
              <Text style={styles.stepText}>
                Si ya lo consumió, consulte inmediatamente a su médico
              </Text>
            </View>
            <View style={styles.instructionStep}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>4</Text>
              </View>
              <Text style={styles.stepText}>
                Reporte cualquier efecto adverso a través de la app
              </Text>
            </View>
          </View>
        </View>

        {/* Actions */}
        <View style={styles.actionsContainer}>
          <Button
            title="Reportar Problema"
            variant="danger"
            onPress={() => navigation.navigate('Report')}
          />
          <Button
            title="Ver Comunicado ANMAT"
            variant="secondary"
            onPress={() => {}}
            style={styles.secondaryButton}
          />
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
  detailsCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    ...SHADOWS.small,
  },
  detailsHeader: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  detailsIcon: {
    width: 24,
    height: 24,
    backgroundColor: COLORS.error,
    borderRadius: 12,
    marginRight: 12,
    marginTop: 2,
  },
  detailsHeaderText: {
    flex: 1,
  },
  detailsTitle: {
    fontSize: SIZES.base,
    fontWeight: 'bold',
    color: '#991B1B',
    marginBottom: 4,
  },
  detailsDate: {
    fontSize: SIZES.sm,
    color: COLORS.gray500,
  },
  detailsDescription: {
    fontSize: SIZES.sm,
    color: COLORS.gray700,
    lineHeight: 20,
    marginBottom: 16,
  },
  reasonBox: {
    backgroundColor: COLORS.errorLight,
    borderRadius: 8,
    padding: 12,
  },
  reasonText: {
    fontSize: SIZES.sm,
    fontWeight: '600',
    color: '#991B1B',
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
    borderRadius: 12,
    padding: 24,
    ...SHADOWS.small,
  },
  instructionStep: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  stepNumberText: {
    fontSize: SIZES.xs,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  stepText: {
    flex: 1,
    fontSize: SIZES.sm,
    color: COLORS.gray700,
    lineHeight: 20,
  },
  actionsContainer: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  secondaryButton: {
    marginTop: 12,
  },
});