import React, { useState } from 'react';
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

type Props = NativeStackScreenProps<RootStackParamList, 'Alerts'>;

interface AlertItem {
  id: string;
  type: 'critical' | 'warning' | 'info';
  title: string;
  message: string;
  time: string;
}

const alerts: AlertItem[] = [
  {
    id: '1',
    type: 'critical',
    title: 'Ibuprofeno 600mg - Lote X2847',
    message: 'Retirado del mercado por contaminación. NO consumir.',
    time: 'Hace 2 horas',
  },
  {
    id: '2',
    type: 'warning',
    title: 'Amoxicilina 500mg - Varios lotes',
    message: 'Posible escasez en el mercado. Consulte alternativas con su médico.',
    time: 'Hace 1 día',
  },
  {
    id: '3',
    type: 'info',
    title: 'Actualización de sistema',
    message: 'Nueva versión disponible con mejoras en el escáner QR.',
    time: 'Hace 3 días',
  },
];

export default function AlertsScreen({ navigation }: Props) {
  const [activeTab, setActiveTab] = useState<'active' | 'history'>('active');

  const getAlertStyle = (type: AlertItem['type']) => {
    switch (type) {
      case 'critical':
        return {
          borderColor: COLORS.error,
          iconBg: COLORS.errorLight,
          iconColor: COLORS.error,
          badgeBg: '#FEE2E2',
          badgeColor: '#991B1B',
        };
      case 'warning':
        return {
          borderColor: COLORS.warning,
          iconBg: COLORS.warningLight,
          iconColor: COLORS.warning,
          badgeBg: '#FEF3C7',
          badgeColor: '#78350F',
        };
      case 'info':
        return {
          borderColor: COLORS.primary,
          iconBg: COLORS.primaryLight,
          iconColor: COLORS.primary,
          badgeBg: COLORS.primaryLight,
          badgeColor: COLORS.primary,
        };
    }
  };

  const getBadgeText = (type: AlertItem['type']) => {
    switch (type) {
      case 'critical':
        return 'CRÍTICA';
      case 'warning':
        return 'ADVERTENCIA';
      case 'info':
        return 'INFORMACIÓN';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header con botón volver */}
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <View style={styles.backIcon} />
          </TouchableOpacity>
          <View>
            <Text style={styles.title}>Alertas Sanitarias</Text>
            <Text style={styles.subtitle}>
              Mantente informado sobre medicamentos
            </Text>
          </View>
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <View style={styles.tabs}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'active' && styles.tabActive]}
            onPress={() => setActiveTab('active')}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === 'active' && styles.tabTextActive,
              ]}
            >
              Activas (3)
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'history' && styles.tabActive]}
            onPress={() => setActiveTab('history')}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === 'history' && styles.tabTextActive,
              ]}
            >
              Historial
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Lista de alertas */}
      <ScrollView style={styles.alertsList} showsVerticalScrollIndicator={false}>
        {alerts.map((alert) => {
          const style = getAlertStyle(alert.type);
          return (
            <TouchableOpacity
              key={alert.id}
              style={[styles.alertCard, { borderLeftColor: style.borderColor }]}
              onPress={() => navigation.navigate('AlertDetail' as any)}
            >
              <View style={styles.alertHeader}>
                <View
                  style={[
                    styles.alertIconContainer,
                    { backgroundColor: style.iconBg },
                  ]}
                >
                  <View
                    style={[
                      styles.alertIcon,
                      { backgroundColor: style.iconColor },
                    ]}
                  />
                </View>
                <View style={styles.alertContent}>
                  <View style={styles.alertMeta}>
                    <View
                      style={[styles.badge, { backgroundColor: style.badgeBg }]}
                    >
                      <Text
                        style={[styles.badgeText, { color: style.badgeColor }]}
                      >
                        {getBadgeText(alert.type)}
                      </Text>
                    </View>
                    <Text style={styles.alertTime}>{alert.time}</Text>
                  </View>
                  <Text style={styles.alertTitle}>{alert.title}</Text>
                  <Text style={styles.alertMessage}>{alert.message}</Text>
                  <View style={styles.linkContainer}>
                    <Text style={styles.alertLink}>Ver detalles</Text>
                    <View style={styles.arrow} />
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
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
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 8,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  backButton: {
    padding: 8,
  },
  backIcon: {
    width: 14,
    height: 14,
    borderLeftWidth: 2,
    borderBottomWidth: 2,
    borderColor: COLORS.gray900,
    transform: [{ rotate: '45deg' }],
  },
  title: {
    fontSize: SIZES.xl,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 2,
  },
  subtitle: {
    fontSize: SIZES.sm,
    color: COLORS.gray600,
  },
  tabsContainer: {
    paddingHorizontal: 24,
    marginVertical: 24,
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 4,
    ...SHADOWS.small,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  tabActive: {
    backgroundColor: COLORS.primary,
  },
  tabText: {
    fontSize: SIZES.sm,
    fontWeight: '600',
    color: COLORS.gray500,
  },
  tabTextActive: {
    color: COLORS.white,
  },
  alertsList: {
    flex: 1,
    paddingHorizontal: 24,
  },
  alertCard: {
    backgroundColor: COLORS.white,
    borderLeftWidth: 4,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    ...SHADOWS.small,
  },
  alertHeader: {
    flexDirection: 'row',
  },
  alertIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  alertIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  alertContent: {
    flex: 1,
  },
  alertMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  badgeText: {
    fontSize: SIZES.xs,
    fontWeight: '600',
  },
  alertTime: {
    fontSize: SIZES.xs,
    color: COLORS.gray500,
  },
  alertTitle: {
    fontSize: SIZES.base,
    fontWeight: 'bold',
    color: COLORS.gray900,
    marginBottom: 8,
  },
  alertMessage: {
    fontSize: SIZES.sm,
    color: COLORS.gray600,
    lineHeight: 20,
    marginBottom: 12,
  },
  linkContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  alertLink: {
    fontSize: SIZES.sm,
    fontWeight: '600',
    color: COLORS.primary,
  },
  arrow: {
    width: 12,
    height: 12,
    borderTopWidth: 2,
    borderRightWidth: 2,
    borderColor: COLORS.primary,
    transform: [{ rotate: '45deg' }],
  },
});
