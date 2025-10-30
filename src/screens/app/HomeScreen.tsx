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
import { COLORS, SIZES, SHADOWS } from '../../constants/theme';

type Props = NativeStackScreenProps<RootStackParamList, 'MainTabs'>;

export default function HomeScreen({ navigation }: Props) {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.welcomeText}>Bienvenido</Text>
            <Text style={styles.userName}>María González</Text>
          </View>
          <TouchableOpacity style={styles.notificationButton}>
            <View style={styles.notificationIcon} />
            <View style={styles.notificationBadge} />
          </TouchableOpacity>
        </View>

        {/* Alert Banner */}
        <View style={styles.alertBanner}>
          <View style={styles.alertIcon} />
          <View style={styles.alertContent}>
            <Text style={styles.alertTitle}>Alerta Activa</Text>
            <Text style={styles.alertMessage}>
              Ibuprofeno 600mg - Lote X2847 retirado del mercado
            </Text>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Acciones Rápidas</Text>
          <View style={styles.quickActionsGrid}>
            <TouchableOpacity style={styles.quickActionPrimary}>
              <View style={styles.quickActionIcon} />
              <Text style={styles.quickActionTextPrimary}>Escanear QR</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickActionSecondary}>
              <View style={styles.quickActionIconSecondary} />
              <Text style={styles.quickActionTextSecondary}>Reportar</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Stats */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Estadísticas</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>24</Text>
              <Text style={styles.statLabel}>Verificados</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={[styles.statNumber, { color: COLORS.primary }]}>3</Text>
              <Text style={styles.statLabel}>Alertas</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={[styles.statNumber, { color: COLORS.gray700 }]}>1</Text>
              <Text style={styles.statLabel}>Reportes</Text>
            </View>
          </View>
        </View>

        {/* Recent Activity */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Actividad Reciente</Text>
          <View style={styles.activityList}>
            <View style={styles.activityItem}>
              <View style={styles.activityIconContainer}>
                <View style={styles.activityIconSuccess} />
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>Paracetamol 500mg</Text>
                <Text style={styles.activitySubtitle}>Verificado - Lote A1234</Text>
                <Text style={styles.activityTime}>Hace 2 horas</Text>
              </View>
            </View>

            <View style={styles.activityItem}>
              <View style={styles.activityIconContainer}>
                <View style={styles.activityIconSuccess} />
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>Amoxicilina 875mg</Text>
                <Text style={styles.activitySubtitle}>Verificado - Lote B5678</Text>
                <Text style={styles.activityTime}>Hace 1 día</Text>
              </View>
            </View>
          </View>
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
    paddingTop: 16,
    paddingBottom: 16,
  },
  welcomeText: {
    fontSize: SIZES.sm,
    color: COLORS.gray500,
  },
  userName: {
    fontSize: SIZES.xxl,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  notificationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    ...SHADOWS.small,
  },
  notificationIcon: {
    width: 20,
    height: 20,
    backgroundColor: COLORS.gray700,
    borderRadius: 4,
  },
  notificationBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.error,
  },
  alertBanner: {
    flexDirection: 'row',
    backgroundColor: COLORS.errorLight,
    borderWidth: 1,
    borderColor: '#FCA5A5',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 24,
    marginBottom: 24,
  },
  alertIcon: {
    width: 20,
    height: 20,
    backgroundColor: COLORS.error,
    borderRadius: 10,
    marginRight: 12,
    marginTop: 2,
  },
  alertContent: {
    flex: 1,
  },
  alertTitle: {
    fontSize: SIZES.sm,
    fontWeight: '600',
    color: '#991B1B',
    marginBottom: 4,
  },
  alertMessage: {
    fontSize: SIZES.sm,
    color: COLORS.gray600,
    lineHeight: 18,
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
  quickActionsGrid: {
    flexDirection: 'row',
    gap: 16,
  },
  quickActionPrimary: {
    flex: 1,
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    padding: 24,
    ...SHADOWS.medium,
  },
  quickActionSecondary: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.gray200,
    borderRadius: 12,
    padding: 24,
    ...SHADOWS.small,
  },
  quickActionIcon: {
    width: 32,
    height: 32,
    backgroundColor: COLORS.white,
    borderRadius: 8,
    marginBottom: 12,
  },
  quickActionIconSecondary: {
    width: 32,
    height: 32,
    backgroundColor: COLORS.gray500,
    borderRadius: 8,
    marginBottom: 12,
  },
  quickActionTextPrimary: {
    fontSize: SIZES.base,
    fontWeight: '600',
    color: COLORS.white,
  },
  quickActionTextSecondary: {
    fontSize: SIZES.base,
    fontWeight: '600',
    color: COLORS.gray900,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    ...SHADOWS.small,
  },
  statNumber: {
    fontSize: SIZES.xxl,
    fontWeight: 'bold',
    color: COLORS.success,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: SIZES.xs,
    color: COLORS.gray500,
  },
  activityList: {
    gap: 12,
  },
  activityItem: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    ...SHADOWS.small,
  },
  activityIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: COLORS.successLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  activityIconSuccess: {
    width: 20,
    height: 20,
    backgroundColor: COLORS.success,
    borderRadius: 10,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: SIZES.base,
    fontWeight: '600',
    color: COLORS.gray900,
    marginBottom: 4,
  },
  activitySubtitle: {
    fontSize: SIZES.sm,
    color: COLORS.gray500,
    marginBottom: 4,
  },
  activityTime: {
    fontSize: SIZES.xs,
    color: COLORS.gray400,
  },
});