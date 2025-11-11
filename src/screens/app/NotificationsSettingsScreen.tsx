import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Switch,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList, NotificationSettings } from '../../types';
import { COLORS, SIZES, SHADOWS } from '../../constants/theme';
import { useAuth } from '../../hooks/useAuth';

type Props = NativeStackScreenProps<RootStackParamList, 'NotificationsSettings'>;

export default function NotificationsSettingsScreen({ navigation }: Props) {
  const { notificationSettings, updateNotificationSettings, isGuest } = useAuth();
  const [localSettings, setLocalSettings] = useState<NotificationSettings | null>(notificationSettings);

  useEffect(() => {
    setLocalSettings(notificationSettings);
  }, [notificationSettings]);

  const handleToggle = async (key: keyof NotificationSettings, value: boolean) => {
    if (!localSettings) return;
    setLocalSettings({ ...localSettings, [key]: value });
    await updateNotificationSettings({ [key]: value });
  };

  const masterEnabled = localSettings?.allNotifications ?? true;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <View style={styles.backIcon} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notificaciones</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.masterSection}>
          <View style={styles.masterCard}>
            <View style={styles.masterIcon}>
              <View style={styles.masterIconInner} />
            </View>
            <View style={styles.masterContent}>
              <Text style={styles.masterTitle}>Todas las Notificaciones</Text>
              <Text style={styles.masterSubtitle}>
                Activa o desactiva todas las notificaciones
              </Text>
            </View>
            <Switch
              value={localSettings?.allNotifications ?? true}
              onValueChange={(value) => handleToggle('allNotifications', value)}
              disabled={isGuest}
              trackColor={{ false: COLORS.gray300, true: COLORS.primary }}
              thumbColor={COLORS.white}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>TIPOS DE ALERTAS</Text>

          <NotificationToggle
            title="Alertas Críticas"
            subtitle="Medicamentos retirados o contaminados"
            color={COLORS.error}
            bg={COLORS.errorLight}
            value={localSettings?.criticalAlerts ?? true}
            onChange={(value) => handleToggle('criticalAlerts', value)}
            disabled={!masterEnabled || isGuest}
          />

          <NotificationToggle
            title="Advertencias"
            subtitle="Escasez o problemas no críticos"
            color={COLORS.warning}
            bg={COLORS.warningLight}
            value={localSettings?.warnings ?? true}
            onChange={(value) => handleToggle('warnings', value)}
            disabled={!masterEnabled || isGuest}
          />

          <NotificationToggle
            title="Información General"
            subtitle="Actualizaciones y novedades"
            color={COLORS.info}
            bg={COLORS.infoLight}
            value={localSettings?.infoAlerts ?? false}
            onChange={(value) => handleToggle('infoAlerts', value)}
            disabled={!masterEnabled || isGuest}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ACTIVIDAD</Text>

          <NotificationToggle
            title="Resultados de Escaneo"
            subtitle="Confirmación de verificaciones"
            color={COLORS.success}
            bg={COLORS.successLight}
            value={localSettings?.scanResults ?? true}
            onChange={(value) => handleToggle('scanResults', value)}
            disabled={!masterEnabled || isGuest}
          />

          <NotificationToggle
            title="Estado de Reportes"
            subtitle="Actualizaciones de tus reportes"
            color={COLORS.primary}
            bg={COLORS.primaryLight}
            value={localSettings?.reportUpdates ?? true}
            onChange={(value) => handleToggle('reportUpdates', value)}
            disabled={!masterEnabled || isGuest}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ESTILO DE NOTIFICACIONES</Text>

          <NotificationToggle
            title="Sonido"
            subtitle="Reproducir sonido al recibir notificaciones"
            color={COLORS.gray400}
            bg={COLORS.gray100}
            value={localSettings?.soundEnabled ?? true}
            onChange={(value) => handleToggle('soundEnabled', value)}
            disabled={!masterEnabled || isGuest}
          />

          <NotificationToggle
            title="Vibración"
            subtitle="Vibrar al recibir alertas"
            color={COLORS.gray400}
            bg={COLORS.gray100}
            value={localSettings?.vibrationEnabled ?? true}
            onChange={(value) => handleToggle('vibrationEnabled', value)}
            disabled={!masterEnabled || isGuest}
          />

          <NotificationToggle
            title="Correo electrónico"
            subtitle="Recibir alertas en tu email"
            color={COLORS.gray400}
            bg={COLORS.gray100}
            value={localSettings?.emailNotifications ?? false}
            onChange={(value) => handleToggle('emailNotifications', value)}
            disabled={!masterEnabled || isGuest}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

interface ToggleProps {
  title: string;
  subtitle: string;
  color: string;
  bg: string;
  value: boolean;
  onChange: (value: boolean) => void;
  disabled?: boolean;
}

const NotificationToggle = ({ title, subtitle, color, bg, value, onChange, disabled }: ToggleProps) => (
  <View style={[styles.notificationItem, disabled && styles.disabled]}>
    <View style={styles.notificationLeft}>
      <View style={[styles.notificationIcon, { backgroundColor: bg }]}>
        <View style={[styles.notificationIconInner, { backgroundColor: color }]} />
      </View>
      <View style={styles.notificationContent}>
        <Text style={styles.notificationTitle}>{title}</Text>
        <Text style={styles.notificationSubtitle}>{subtitle}</Text>
      </View>
    </View>
    <Switch
      value={value}
      onValueChange={onChange}
      disabled={disabled}
      trackColor={{ false: COLORS.gray300, true: color }}
      thumbColor={COLORS.white}
    />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
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
    width: 12,
    height: 12,
    borderLeftWidth: 3,
    borderBottomWidth: 3,
    borderColor: COLORS.gray700,
    transform: [{ rotate: '45deg' }],
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: SIZES.lg,
    fontWeight: '600',
    color: COLORS.primary,
  },
  placeholder: {
    width: 40,
  },
  masterSection: {
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  masterCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 16,
    ...SHADOWS.medium,
  },
  masterIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  masterIconInner: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: COLORS.primary,
  },
  masterContent: {
    flex: 1,
  },
  masterTitle: {
    fontSize: SIZES.base,
    fontWeight: '600',
    color: COLORS.gray900,
  },
  masterSubtitle: {
    fontSize: SIZES.sm,
    color: COLORS.gray500,
  },
  section: {
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: SIZES.sm,
    fontWeight: '600',
    color: COLORS.gray500,
    marginBottom: 8,
  },
  notificationItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    ...SHADOWS.small,
  },
  notificationLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  notificationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationIconInner: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  notificationContent: {
    maxWidth: '70%',
  },
  notificationTitle: {
    fontSize: SIZES.base,
    fontWeight: '600',
    color: COLORS.gray900,
  },
  notificationSubtitle: {
    fontSize: SIZES.sm,
    color: COLORS.gray500,
  },
  disabled: {
    opacity: 0.4,
  },
});
