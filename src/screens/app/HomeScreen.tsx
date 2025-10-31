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
          <TouchableOpacity
            style={styles.notificationButton}
            onPress={() => navigation.navigate('Alerts' as any)}
          >
            <View style={styles.bellIcon}>
              <View style={styles.bellTop} />
              <View style={styles.bellBody} />
            </View>
            <View style={styles.notificationBadge} />
          </TouchableOpacity>
        </View>

        {/* Alert Banner - Clickeable */}
        <TouchableOpacity
          style={styles.alertBanner}
          onPress={() => navigation.navigate('AlertDetail' as any)}
        >
          <View style={styles.alertIconContainer}>
            <View style={styles.alertTriangle} />
          </View>
          <View style={styles.alertContent}>
            <Text style={styles.alertTitle}>Alerta Activa</Text>
            <Text style={styles.alertMessage}>
              Ibuprofeno 600mg - Lote X2847 retirado del mercado
            </Text>
          </View>
        </TouchableOpacity>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Acciones Rápidas</Text>
          <View style={styles.quickActionsGrid}>
            {/* Scan QR Button */}
            <TouchableOpacity
              style={styles.quickActionPrimary}
              onPress={() => navigation.navigate('Scanner', {})}
            >
              <View style={styles.qrIconContainer}>
                <View style={styles.qrSquare1} />
                <View style={styles.qrSquare2} />
                <View style={styles.qrSquare3} />
                <View style={styles.qrSquare4} />
              </View>
              <Text style={styles.quickActionTextPrimary}>Escanear QR</Text>
            </TouchableOpacity>

            {/* Report Button */}
            <TouchableOpacity
              style={styles.quickActionSecondary}
              onPress={() => navigation.navigate('Report', {})}
            >
              <View style={styles.reportIconContainer}>
                <View style={styles.reportTriangle} />
              </View>
              <Text style={styles.quickActionTextSecondary}>Reportar</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Stats - Clickeables */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Estadísticas</Text>
          <View style={styles.statsGrid}>
            <TouchableOpacity
              style={styles.statCard}
              onPress={() => navigation.navigate('History' as any)}
            >
              <Text style={[styles.statNumber, { color: COLORS.success }]}>
                24
              </Text>
              <Text style={styles.statLabel}>Verificados</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.statCard}
              onPress={() => navigation.navigate('Alerts' as any)}
            >
              <Text style={[styles.statNumber, { color: COLORS.primary }]}>
                3
              </Text>
              <Text style={styles.statLabel}>Alertas</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.statCard}
              onPress={() => navigation.navigate('History' as any)}
            >
              <Text style={[styles.statNumber, { color: COLORS.gray700 }]}>
                1
              </Text>
              <Text style={styles.statLabel}>Reportes</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recent Activity */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Actividad Reciente</Text>
          <View style={styles.activityList}>
            {/* Activity Item 1 - Clickeable */}
            <TouchableOpacity
              style={styles.activityItem}
              onPress={() => navigation.navigate('ScanResultSafe', {})}
            >
              <View style={styles.activityIconContainer}>
                <View style={styles.checkIcon} />
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>Paracetamol 500mg</Text>
                <Text style={styles.activitySubtitle}>
                  Verificado - Lote A1234
                </Text>
                <Text style={styles.activityTime}>Hace 2 horas</Text>
              </View>
            </TouchableOpacity>

            {/* Activity Item 2 - Clickeable */}
            <TouchableOpacity
              style={styles.activityItem}
              onPress={() => navigation.navigate('ScanResultSafe', {})}
            >
              <View style={styles.activityIconContainer}>
                <View style={styles.checkIcon} />
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>Amoxicilina 875mg</Text>
                <Text style={styles.activitySubtitle}>
                  Verificado - Lote B5678
                </Text>
                <Text style={styles.activityTime}>Hace 1 día</Text>
              </View>
            </TouchableOpacity>
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
    fontSize: 24,
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
  bellIcon: {
    width: 20,
    height: 20,
    alignItems: 'center',
  },
  bellTop: {
    width: 4,
    height: 4,
    backgroundColor: COLORS.gray700,
    borderRadius: 2,
    marginBottom: 2,
  },
  bellBody: {
    width: 16,
    height: 14,
    backgroundColor: COLORS.gray700,
    borderRadius: 8,
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
  alertIconContainer: {
    width: 20,
    height: 20,
    marginRight: 12,
    marginTop: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  alertTriangle: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderBottomWidth: 18,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: COLORS.error,
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
  qrIconContainer: {
    width: 32,
    height: 32,
    marginBottom: 12,
    position: 'relative',
  },
  qrSquare1: {
    position: 'absolute',
    width: 10,
    height: 10,
    backgroundColor: COLORS.white,
    borderRadius: 2,
    top: 0,
    left: 0,
  },
  qrSquare2: {
    position: 'absolute',
    width: 10,
    height: 10,
    backgroundColor: COLORS.white,
    borderRadius: 2,
    top: 0,
    right: 0,
  },
  qrSquare3: {
    position: 'absolute',
    width: 10,
    height: 10,
    backgroundColor: COLORS.white,
    borderRadius: 2,
    bottom: 0,
    left: 0,
  },
  qrSquare4: {
    position: 'absolute',
    width: 10,
    height: 10,
    backgroundColor: COLORS.white,
    borderRadius: 2,
    bottom: 0,
    right: 0,
  },
  reportIconContainer: {
    width: 32,
    height: 32,
    marginBottom: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reportTriangle: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 14,
    borderRightWidth: 14,
    borderBottomWidth: 24,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: COLORS.gray500,
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
    fontSize: 32,
    fontWeight: 'bold',
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
  checkIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: COLORS.success,
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