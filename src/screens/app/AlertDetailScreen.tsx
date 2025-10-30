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

type Props = NativeStackScreenProps<RootStackParamList, 'MainTabs'>;

export default function AlertDetailScreen({ navigation }: Props) {
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
        <Text style={styles.headerTitle}>Detalle de Alerta</Text>
        <TouchableOpacity style={styles.headerButton}>
          <View style={styles.headerIcon} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Alert Badge */}
        <View style={styles.badgeContainer}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>ALERTA CRÍTICA</Text>
          </View>
        </View>

        {/* Title */}
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Ibuprofeno 600mg</Text>
          <Text style={styles.subtitle}>Lote X2847</Text>
          <Text style={styles.date}>Emitida: 25 de marzo, 2024</Text>
        </View>

        {/* Alert Description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Descripción</Text>
          <View style={styles.card}>
            <Text style={styles.description}>
              La ANMAT ha ordenado el retiro preventivo del mercado del lote X2847
              de Ibuprofeno 600mg debido a la detección de contaminación con
              sustancias no autorizadas durante los controles de calidad rutinarios.
            </Text>
          </View>
        </View>

        {/* Reason */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Motivo del Retiro</Text>
          <View style={styles.card}>
            <View style={styles.reasonItem}>
              <View style={styles.reasonBullet} />
              <Text style={styles.reasonText}>
                Contaminación detectada en análisis de laboratorio
              </Text>
            </View>
            <View style={styles.reasonItem}>
              <View style={styles.reasonBullet} />
              <Text style={styles.reasonText}>
                Riesgo potencial para la salud de los pacientes
              </Text>
            </View>
            <View style={styles.reasonItem}>
              <View style={styles.reasonBullet} />
              <Text style={styles.reasonText}>
                Incumplimiento de normas de calidad farmacéutica
              </Text>
            </View>
          </View>
        </View>

        {/* Affected Products */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Productos Afectados</Text>
          <View style={styles.card}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Medicamento:</Text>
              <Text style={styles.infoValue}>Ibuprofeno 600mg</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Laboratorio:</Text>
              <Text style={styles.infoValue}>Lab. XYZ S.A.</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Lote:</Text>
              <Text style={[styles.infoValue, styles.dangerText]}>X2847</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Vencimiento:</Text>
              <Text style={styles.infoValue}>08/2025</Text>
            </View>
          </View>
        </View>

        {/* Recommendations */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recomendaciones</Text>
          <View style={styles.card}>
            <View style={styles.recommendationItem}>
              <View style={styles.numberBadge}>
                <Text style={styles.numberText}>1</Text>
              </View>
              <Text style={styles.recommendationText}>
                Suspender inmediatamente el consumo del producto
              </Text>
            </View>
            <View style={styles.recommendationItem}>
              <View style={styles.numberBadge}>
                <Text style={styles.numberText}>2</Text>
              </View>
              <Text style={styles.recommendationText}>
                Devolver el medicamento a la farmacia de compra
              </Text>
            </View>
            <View style={styles.recommendationItem}>
              <View style={styles.numberBadge}>
                <Text style={styles.numberText}>3</Text>
              </View>
              <Text style={styles.recommendationText}>
                Consultar con su médico si ya consumió el producto
              </Text>
            </View>
            <View style={styles.recommendationItem}>
              <View style={styles.numberBadge}>
                <Text style={styles.numberText}>4</Text>
              </View>
              <Text style={styles.recommendationText}>
                Reportar cualquier efecto adverso a través de la aplicación
              </Text>
            </View>
          </View>
        </View>

        {/* Contact Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Información de Contacto</Text>
          <View style={styles.card}>
            <Text style={styles.contactTitle}>ANMAT - Línea de Consultas</Text>
            <Text style={styles.contactInfo}>📞 0800-333-1234</Text>
            <Text style={styles.contactInfo}>✉️ consultas@anmat.gov.ar</Text>
            <Text style={styles.contactInfo}>🌐 www.anmat.gov.ar</Text>
          </View>
        </View>

        {/* Actions */}
        <View style={styles.actionsContainer}>
          <Button
            title="Reportar que lo consumí"
            variant="danger"
            onPress={() => navigation.navigate('Report', {})}
          />
          <Button
            title="Descargar Comunicado Oficial"
            variant="secondary"
            onPress={() => {}}
            style={styles.secondaryButton}
          />
          <Button
            title="Compartir Alerta"
            variant="outline"
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
  badgeContainer: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  badge: {
    backgroundColor: COLORS.errorLight,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  badgeText: {
    fontSize: SIZES.sm,
    fontWeight: '700',
    color: COLORS.error,
  },
  titleContainer: {
    paddingHorizontal: 24,
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: SIZES.xxxl,
    fontWeight: 'bold',
    color: COLORS.gray900,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: SIZES.xl,
    color: COLORS.error,
    fontWeight: '600',
    marginBottom: 8,
  },
  date: {
    fontSize: SIZES.sm,
    color: COLORS.gray500,
  },
  section: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: SIZES.lg,
    fontWeight: '600',
    color: COLORS.gray900,
    marginBottom: 12,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    ...SHADOWS.small,
  },
  description: {
    fontSize: SIZES.base,
    color: COLORS.gray700,
    lineHeight: 24,
  },
  reasonItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  reasonBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.error,
    marginTop: 8,
    marginRight: 12,
  },
  reasonText: {
    flex: 1,
    fontSize: SIZES.base,
    color: COLORS.gray700,
    lineHeight: 22,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray100,
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
  dangerText: {
    color: COLORS.error,
  },
  recommendationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
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
    fontSize: SIZES.sm,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  recommendationText: {
    flex: 1,
    fontSize: SIZES.base,
    color: COLORS.gray700,
    lineHeight: 22,
    marginTop: 4,
  },
  contactTitle: {
    fontSize: SIZES.base,
    fontWeight: '600',
    color: COLORS.gray900,
    marginBottom: 12,
  },
  contactInfo: {
    fontSize: SIZES.base,
    color: COLORS.gray700,
    marginBottom: 8,
    lineHeight: 22,
  },
  actionsContainer: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  secondaryButton: {
    marginTop: 12,
  },
});