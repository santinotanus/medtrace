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

type Props = NativeStackScreenProps<RootStackParamList, 'ScanResultSafe'>;

interface TraceStep {
  title: string;
  description: string;
  date: string;
  completed: boolean;
}

const traceSteps: TraceStep[] = [
  {
    title: 'Fabricación',
    description: 'Planta Buenos Aires',
    date: '15/03/2024 10:30',
    completed: true,
  },
  {
    title: 'Control de Calidad',
    description: 'Aprobado ANMAT',
    date: '16/03/2024 14:20',
    completed: true,
  },
  {
    title: 'Distribución',
    description: 'Droguería del Sud',
    date: '18/03/2024 09:15',
    completed: true,
  },
  {
    title: 'Farmacia',
    description: 'Farmacity Palermo',
    date: '20/03/2024 11:45',
    completed: true,
  },
];

export default function ScanResultSafeScreen({ navigation }: Props) {
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => navigation.goBack()}
        >
          <View style={styles.headerIcon} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Resultado</Text>
        <TouchableOpacity style={styles.headerButton}>
          <View style={styles.headerIcon} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Status */}
        <View style={styles.statusContainer}>
          <View style={styles.statusCard}>
            <View style={styles.statusIconContainer}>
              <View style={styles.statusIcon} />
            </View>
            <Text style={styles.statusTitle}>Medicamento Seguro</Text>
            <Text style={styles.statusSubtitle}>Verificado en blockchain</Text>
          </View>
        </View>

        {/* Medicine Info */}
        <View style={styles.section}>
          <View style={styles.infoCard}>
            <Text style={styles.medicineTitle}>Paracetamol 500mg</Text>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Laboratorio</Text>
              <Text style={styles.infoValue}>Roemmers S.A.</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Lote</Text>
              <Text style={styles.infoValue}>A1234567</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Vencimiento</Text>
              <Text style={styles.infoValue}>12/2026</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Registro ANMAT</Text>
              <Text style={styles.infoValue}>54.321</Text>
            </View>
          </View>
        </View>

        {/* Traceability */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Trazabilidad</Text>
          <View style={styles.traceCard}>
            {traceSteps.map((step, index) => (
              <View key={index} style={styles.traceStep}>
                <View style={styles.traceStepLeft}>
                  <View style={styles.traceStepIcon}>
                    <View style={styles.traceStepIconInner} />
                  </View>
                  {index < traceSteps.length - 1 && (
                    <View style={styles.traceStepLine} />
                  )}
                </View>
                <View style={styles.traceStepContent}>
                  <Text style={styles.traceStepTitle}>{step.title}</Text>
                  <Text style={styles.traceStepDescription}>
                    {step.description}
                  </Text>
                  <Text style={styles.traceStepDate}>{step.date}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Actions */}
        <View style={styles.actionsContainer}>
          <Button title="Guardar en Historial" onPress={() => {}} />
          <Button
            title="Ver Prospecto"
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
    backgroundColor: COLORS.success,
    alignItems: 'center',
    justifyContent: 'center',
  },
  traceStepIconInner: {
    width: 16,
    height: 16,
    backgroundColor: COLORS.white,
    borderRadius: 8,
  },
  traceStepLine: {
    width: 2,
    flex: 1,
    backgroundColor: COLORS.gray200,
    marginVertical: 4,
  },
  traceStepContent: {
    flex: 1,
    paddingBottom: 16,
  },
  traceStepTitle: {
    fontSize: SIZES.base,
    fontWeight: '600',
    color: COLORS.gray900,
    marginBottom: 4,
  },
  traceStepDescription: {
    fontSize: SIZES.sm,
    color: COLORS.gray500,
    marginBottom: 4,
  },
  traceStepDate: {
    fontSize: SIZES.xs,
    color: COLORS.gray400,
  },
  actionsContainer: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  secondaryButton: {
    marginTop: 12,
  },
});