import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types';
import Button from '../../components/Button';
import { COLORS, SIZES, SHADOWS } from '../../constants/theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Report'>;

type ProblemType = 'adverse_effect' | 'quality_issue' | 'counterfeit';
type Severity = 'mild' | 'moderate' | 'severe';

export default function ReportScreen({ navigation }: Props) {
  const [selectedType, setSelectedType] = useState<ProblemType>('adverse_effect');
  const [description, setDescription] = useState('');
  const [severity, setSeverity] = useState<Severity>('moderate');
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [loading, setLoading] = useState(false);

  const problemTypes: { type: ProblemType; title: string; subtitle: string }[] = [
    {
      type: 'adverse_effect',
      title: 'Efecto adverso',
      subtitle: 'Reacción no esperada al medicamento',
    },
    {
      type: 'quality_issue',
      title: 'Problema de calidad',
      subtitle: 'Defecto en el producto o envase',
    },
    {
      type: 'counterfeit',
      title: 'Sospecha de falsificación',
      subtitle: 'El producto parece no ser auténtico',
    },
  ];

  const handleSubmit = async () => {
    setLoading(true);
    // Simular envío
    setTimeout(() => {
      setLoading(false);
      navigation.goBack();
    }, 1500);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <View style={styles.backIcon} />
          </TouchableOpacity>
          <View style={styles.headerText}>
            <Text style={styles.headerTitle}>Reportar Problema</Text>
            <Text style={styles.headerSubtitle}>Ayuda a proteger a otros</Text>
          </View>
        </View>

        <ScrollView
          style={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {/* Medicine Info */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Medicamento</Text>
            <View style={styles.medicineCard}>
              <View style={styles.medicineInfo}>
                <Text style={styles.medicineName}>Paracetamol 500mg</Text>
                <Text style={styles.medicineBatch}>Lote A1234567</Text>
              </View>
              <TouchableOpacity>
                <Text style={styles.changeButton}>Cambiar</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Problem Type */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Tipo de problema</Text>
            {problemTypes.map((problem) => (
              <TouchableOpacity
                key={problem.type}
                style={[
                  styles.problemTypeCard,
                  selectedType === problem.type && styles.problemTypeCardActive,
                ]}
                onPress={() => setSelectedType(problem.type)}
              >
                <View
                  style={[
                    styles.radio,
                    selectedType === problem.type && styles.radioActive,
                  ]}
                >
                  {selectedType === problem.type && <View style={styles.radioDot} />}
                </View>
                <View style={styles.problemTypeText}>
                  <Text style={styles.problemTypeTitle}>{problem.title}</Text>
                  <Text style={styles.problemTypeSubtitle}>
                    {problem.subtitle}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {/* Description */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Descripción detallada</Text>
            <TextInput
              style={styles.textArea}
              placeholder="Describe lo que sucedió con el mayor detalle posible..."
              placeholderTextColor={COLORS.gray400}
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={6}
              textAlignVertical="top"
            />
          </View>

          {/* Severity */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Gravedad</Text>
            <View style={styles.severityGrid}>
              {(['mild', 'moderate', 'severe'] as Severity[]).map((sev) => (
                <TouchableOpacity
                  key={sev}
                  style={[
                    styles.severityButton,
                    severity === sev && styles.severityButtonActive,
                  ]}
                  onPress={() => setSeverity(sev)}
                >
                  <Text
                    style={[
                      styles.severityText,
                      severity === sev && styles.severityTextActive,
                    ]}
                  >
                    {sev === 'mild' ? 'Leve' : sev === 'moderate' ? 'Moderada' : 'Grave'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Photos */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Fotos (opcional)</Text>
            <TouchableOpacity style={styles.photoUpload}>
              <View style={styles.photoIcon} />
              <Text style={styles.photoText}>Toca para agregar fotos</Text>
            </TouchableOpacity>
          </View>

          {/* Anonymous Toggle */}
          <View style={styles.section}>
            <TouchableOpacity
              style={styles.anonymousCard}
              onPress={() => setIsAnonymous(!isAnonymous)}
            >
              <View style={styles.anonymousText}>
                <Text style={styles.anonymousTitle}>Reporte anónimo</Text>
                <Text style={styles.anonymousSubtitle}>
                  No se compartirá tu identidad
                </Text>
              </View>
              <View style={[styles.toggle, isAnonymous && styles.toggleActive]}>
                <View
                  style={[
                    styles.toggleThumb,
                    isAnonymous && styles.toggleThumbActive,
                  ]}
                />
              </View>
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* Submit Button */}
        <View style={styles.footer}>
          <Button
            title="Enviar Reporte"
            onPress={handleSubmit}
            loading={loading}
            disabled={!description.trim()}
          />
          <Text style={styles.footerNote}>
            Tu reporte será revisado por ANMAT y podrá ayudar a prevenir problemas
            en otros pacientes
          </Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  keyboardView: {
    flex: 1,
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
    width: 20,
    height: 20,
    backgroundColor: COLORS.gray700,
    borderRadius: 4,
  },
  headerText: {
    flex: 1,
  },
  headerTitle: {
    fontSize: SIZES.xl,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 2,
  },
  headerSubtitle: {
    fontSize: SIZES.sm,
    color: COLORS.gray600,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: SIZES.sm,
    fontWeight: '600',
    color: COLORS.gray900,
    marginBottom: 8,
  },
  medicineCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    ...SHADOWS.small,
  },
  medicineInfo: {
    flex: 1,
  },
  medicineName: {
    fontSize: SIZES.base,
    fontWeight: '600',
    color: COLORS.gray900,
    marginBottom: 4,
  },
  medicineBatch: {
    fontSize: SIZES.sm,
    color: COLORS.gray500,
  },
  changeButton: {
    fontSize: SIZES.sm,
    fontWeight: '600',
    color: COLORS.primary,
  },
  problemTypeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.gray200,
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    ...SHADOWS.small,
  },
  problemTypeCardActive: {
    borderColor: COLORS.primary,
    borderWidth: 2,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: COLORS.gray300,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  radioActive: {
    borderColor: COLORS.primary,
  },
  radioDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: COLORS.primary,
  },
  problemTypeText: {
    flex: 1,
  },
  problemTypeTitle: {
    fontSize: SIZES.base,
    fontWeight: '600',
    color: COLORS.gray900,
    marginBottom: 2,
  },
  problemTypeSubtitle: {
    fontSize: SIZES.sm,
    color: COLORS.gray500,
  },
  textArea: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.gray200,
    borderRadius: 12,
    padding: 16,
    minHeight: 120,
    fontSize: SIZES.base,
    color: COLORS.gray900,
    ...SHADOWS.small,
  },
  severityGrid: {
    flexDirection: 'row',
    gap: 8,
  },
  severityButton: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.gray200,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    ...SHADOWS.small,
  },
  severityButtonActive: {
    borderColor: COLORS.warning,
    borderWidth: 2,
    backgroundColor: COLORS.warningLight,
  },
  severityText: {
    fontSize: SIZES.sm,
    fontWeight: '600',
    color: COLORS.gray900,
  },
  severityTextActive: {
    color: '#92400E',
  },
  photoUpload: {
    backgroundColor: COLORS.white,
    borderWidth: 2,
    borderColor: COLORS.gray300,
    borderStyle: 'dashed',
    borderRadius: 12,
    padding: 32,
    alignItems: 'center',
    ...SHADOWS.small,
  },
  photoIcon: {
    width: 32,
    height: 32,
    backgroundColor: COLORS.gray400,
    borderRadius: 8,
    marginBottom: 8,
  },
  photoText: {
    fontSize: SIZES.sm,
    color: COLORS.gray500,
  },
  anonymousCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    ...SHADOWS.small,
  },
  anonymousText: {
    flex: 1,
  },
  anonymousTitle: {
    fontSize: SIZES.base,
    fontWeight: '600',
    color: COLORS.gray900,
    marginBottom: 4,
  },
  anonymousSubtitle: {
    fontSize: SIZES.sm,
    color: COLORS.gray500,
  },
  toggle: {
    width: 48,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.gray300,
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  toggleActive: {
    backgroundColor: COLORS.primary,
  },
  toggleThumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.white,
    ...SHADOWS.small,
  },
  toggleThumbActive: {
    alignSelf: 'flex-end',
  },
  footer: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.gray200,
  },
  footerNote: {
    fontSize: SIZES.xs,
    color: COLORS.gray500,
    textAlign: 'center',
    marginTop: 12,
    lineHeight: 16,
  },
});