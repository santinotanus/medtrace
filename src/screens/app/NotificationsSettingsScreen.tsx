import React, { useState } from 'react';
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
import { RootStackParamList } from '../../types';
import { COLORS, SIZES, SHADOWS } from '../../constants/theme';

type Props = NativeStackScreenProps<RootStackParamList, 'MainTabs'>;

export default function NotificationsSettingsScreen({ navigation }: Props) {
  const [allNotifications, setAllNotifications] = useState(true);
  const [criticalAlerts, setCriticalAlerts] = useState(true);
  const [warnings, setWarnings] = useState(true);
  const [infoAlerts, setInfoAlerts] = useState(false);
  const [scanResults, setScanResults] = useState(true);
  const [reports, setReports] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [vibrationEnabled, setVibrationEnabled] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
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
        {/* Master Toggle */}
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
              value={allNotifications}
              onValueChange={setAllNotifications}
              trackColor={{ false: COLORS.gray300, true: COLORS.primary }}
              thumbColor={COLORS.white}
            />
          </View>
        </View>

        {/* Alert Types */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>TIPOS DE ALERTAS</Text>

          <View style={styles.notificationItem}>
            <View style={styles.notificationLeft}>
              <View style={[styles.notificationIcon, { backgroundColor: COLORS.errorLight }]}>
                <View style={styles.notificationIconInner} />
              </View>
              <View style={styles.notificationContent}>
                <Text style={styles.notificationTitle}>Alertas Críticas</Text>
                <Text style={styles.notificationSubtitle}>
                  Medicamentos retirados o contaminados
                </Text>
              </View>
            </View>
            <Switch
              value={criticalAlerts}
              onValueChange={setCriticalAlerts}
              disabled={!allNotifications}
              trackColor={{ false: COLORS.gray300, true: COLORS.error }}
              thumbColor={COLORS.white}
            />
          </View>

          <View style={styles.notificationItem}>
            <View style={styles.notificationLeft}>
              <View style={[styles.notificationIcon, { backgroundColor: COLORS.warningLight }]}>
                <View style={styles.notificationIconInner} />
              </View>
              <View style={styles.notificationContent}>
                <Text style={styles.notificationTitle}>Advertencias</Text>
                <Text style={styles.notificationSubtitle}>
                  Escasez o problemas no críticos
                </Text>
              </View>
            </View>
            <Switch
              value={warnings}
              onValueChange={setWarnings}
              disabled={!allNotifications}
              trackColor={{ false: COLORS.gray300, true: COLORS.warning }}
              thumbColor={COLORS.white}
            />
          </View>

          <View style={styles.notificationItem}>
            <View style={styles.notificationLeft}>
              <View style={[styles.notificationIcon, { backgroundColor: COLORS.infoLight }]}>
                <View style={styles.notificationIconInner} />
              </View>
              <View style={styles.notificationContent}>
                <Text style={styles.notificationTitle}>Información General</Text>
                <Text style={styles.notificationSubtitle}>
                  Actualizaciones y novedades
                </Text>
              </View>
            </View>
            <Switch
              value={infoAlerts}
              onValueChange={setInfoAlerts}
              disabled={!allNotifications}
              trackColor={{ false: COLORS.gray300, true: COLORS.info }}
              thumbColor={COLORS.white}
            />
          </View>
        </View>

        {/* Activity Notifications */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ACTIVIDAD</Text>

          <View style={styles.notificationItem}>
            <View style={styles.notificationLeft}>
              <View style={[styles.notificationIcon, { backgroundColor: COLORS.successLight }]}>
                <View style={styles.notificationIconInner} />
              </View>
              <View style={styles.notificationContent}>
                <Text style={styles.notificationTitle}>Resultados de Escaneo</Text>
                <Text style={styles.notificationSubtitle}>
                  Confirmación de verificaciones
                </Text>
              </View>
            </View>
            <Switch
              value={scanResults}
              onValueChange={setScanResults}
              disabled={!allNotifications}
              trackColor={{ false: COLORS.gray300, true: COLORS.success }}
              thumbColor={COLORS.white}
            />
          </View>

          <View style={styles.notificationItem}>
            <View style={styles.notificationLeft}>
              <View style={[styles.notificationIcon, { backgroundColor: COLORS.primaryLight }]}>
                <View style={styles.notificationIconInner} />
              </View>
              <View style={styles.notificationContent}>
                <Text style={styles.notificationTitle}>Estado de Reportes</Text>
                <Text style={styles.notificationSubtitle}>
                  Actualizaciones de tus reportes
                </Text>
              </View>
            </View>
            <Switch
              value={reports}
              onValueChange={setReports}
              disabled={!allNotifications}
              trackColor={{ false: COLORS.gray300, true: COLORS.primary }}
              thumbColor={COLORS.white}
            />
          </View>
        </View>

        {/* Notification Style */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ESTILO DE NOTIFICACIONES</Text>

          <View style={styles.notificationItem}>
            <View style={styles.notificationLeft}>
              <View style={[styles.notificationIcon, { backgroundColor: COLORS.gray100 }]}>
                <View style={styles.notificationIconInner} />
              </View>
              <View style={styles.notificationContent}>
                <Text style={styles.notificationTitle}>Sonido</Text>
                <Text style={styles.notificationSubtitle}>
                  Reproducir sonido al recibir notificaciones
                </Text>
              </View>
            </View>
            <Switch
              value={soundEnabled}
              onValueChange={setSoundEnabled}
              disabled={!allNotifications}
              trackColor={{ false: COLORS.gray300, true: COLORS.primary }}
              thumbColor={COLORS.white}
            />
          </View>

          <View style={styles.notificationItem}>
            <View style={styles.notificationLeft}>
              <View style={[styles.notificationIcon, { backgroundColor: COLORS.gray100 }]}>
                <View style={styles.notificationIconInner} />
              </View>
              <View style={styles.notificationContent}>
                <Text style={styles.notificationTitle}>Vibración</Text>
                <Text style={styles.notificationSubtitle}>
                  Vibrar al recibir notificaciones
                </Text>
              </View>
            </View>
            <Switch
              value={vibrationEnabled}
              onValueChange={setVibrationEnabled}
              disabled={!allNotifications}
              trackColor={{ false: COLORS.gray300, true: COLORS.primary }}
              thumbColor={COLORS.white}
            />
          </View>

          <TouchableOpacity style={styles.notificationItem} disabled={!allNotifications}>
            <View style={styles.notificationLeft}>
              <View style={[styles.notificationIcon, { backgroundColor: COLORS.gray100 }]}>
                <View style={styles.notificationIconInner} />
              </View>
              <View style={styles.notificationContent}>
                <Text style={styles.notificationTitle}>Tono de Notificación</Text>
                <Text style={styles.notificationSubtitle}>
                  Por defecto
                </Text>
              </View>
            </View>
            <View style={styles.chevron} />
          </TouchableOpacity>
        </View>

        {/* Email Notifications */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>OTRAS OPCIONES</Text>

          <View style={styles.notificationItem}>
            <View style={styles.notificationLeft}>
              <View style={[styles.notificationIcon, { backgroundColor: COLORS.infoLight }]}>
                <View style={styles.notificationIconInner} />
              </View>
              <View style={styles.notificationContent}>
                <Text style={styles.notificationTitle}>Notificaciones por Email</Text>
                <Text style={styles.notificationSubtitle}>
                  Recibir resumen semanal
                </Text>
              </View>
            </View>
            <Switch
              value={emailNotifications}
              onValueChange={setEmailNotifications}
              trackColor={{ false: COLORS.gray300, true: COLORS.primary }}
              thumbColor={COLORS.white}
            />
          </View>

          <TouchableOpacity style={styles.notificationItem}>
            <View style={styles.notificationLeft}>
              <View style={[styles.notificationIcon, { backgroundColor: COLORS.gray100 }]}>
                <View style={styles.notificationIconInner} />
              </View>
              <View style={styles.notificationContent}>
                <Text style={styles.notificationTitle}>Horario de Silencio</Text>
                <Text style={styles.notificationSubtitle}>
                  No configurado
                </Text>
              </View>
            </View>
            <View style={styles.chevron} />
          </TouchableOpacity>
        </View>

        {/* Info Box */}
        <View style={styles.infoBox}>
          <View style={styles.infoIcon} />
          <Text style={styles.infoText}>
            Las alertas críticas siempre se mostrarán, incluso si las notificaciones
            están desactivadas, para garantizar tu seguridad.
          </Text>
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
    alignItems: 'center',
    justifyContent: 'space-between',
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
    width: 20,
    height: 20,
    backgroundColor: COLORS.gray700,
    borderRadius: 4,
  },
  headerTitle: {
    fontSize: SIZES.xl,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  placeholder: {
    width: 40,
  },
  masterSection: {
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  masterCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 20,
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
    width: 24,
    height: 24,
    backgroundColor: COLORS.primary,
    borderRadius: 12,
  },
  masterContent: {
    flex: 1,
  },
  masterTitle: {
    fontSize: SIZES.base,
    fontWeight: '600',
    color: COLORS.gray900,
    marginBottom: 4,
  },
  masterSubtitle: {
    fontSize: SIZES.sm,
    color: COLORS.gray500,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: SIZES.xs,
    fontWeight: '700',
    color: COLORS.gray500,
    paddingHorizontal: 24,
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.white,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray100,
  },
  notificationLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  notificationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  notificationIconInner: {
    width: 20,
    height: 20,
    backgroundColor: COLORS.gray600,
    borderRadius: 4,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: SIZES.base,
    fontWeight: '500',
    color: COLORS.gray900,
    marginBottom: 2,
  },
  notificationSubtitle: {
    fontSize: SIZES.sm,
    color: COLORS.gray500,
  },
  chevron: {
    width: 20,
    height: 20,
    backgroundColor: COLORS.gray300,
    borderRadius: 4,
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: COLORS.infoLight,
    borderWidth: 1,
    borderColor: '#BFDBFE',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 24,
    marginBottom: 24,
  },
  infoIcon: {
    width: 20,
    height: 20,
    backgroundColor: COLORS.info,
    borderRadius: 10,
    marginRight: 12,
    marginTop: 2,
  },
  infoText: {
    flex: 1,
    fontSize: SIZES.sm,
    color: '#1E40AF',
    lineHeight: 20,
  },
});