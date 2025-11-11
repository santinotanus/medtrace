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
import { RootStackParamList, UserSettings } from '../../types';
import { COLORS, SIZES, SHADOWS } from '../../constants/theme';
import { useAuth } from '../../hooks/useAuth';

type Props = NativeStackScreenProps<RootStackParamList, 'Settings'>;

export default function SettingsScreen({ navigation }: Props) {
  const { userSettings, updateUserSettings, isGuest } = useAuth();
  const [localSettings, setLocalSettings] = useState<UserSettings | null>(userSettings);

  useEffect(() => {
    setLocalSettings(userSettings);
  }, [userSettings]);

  const handleToggle = async (key: keyof UserSettings, value: boolean) => {
    if (!localSettings) return;
    setLocalSettings({ ...localSettings, [key]: value });
    await updateUserSettings({ [key]: value });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <View style={styles.backIcon} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Configuración</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>CUENTA</Text>

          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <View style={[styles.menuIcon, { backgroundColor: COLORS.primaryLight }]}>
                <View style={styles.menuIconInner} />
              </View>
              <Text style={styles.menuItemText}>Editar Perfil</Text>
            </View>
            <View style={styles.chevron} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <View style={[styles.menuIcon, { backgroundColor: COLORS.primaryLight }]}>
                <View style={styles.menuIconInner} />
              </View>
              <Text style={styles.menuItemText}>Cambiar Contraseña</Text>
            </View>
            <View style={styles.chevron} />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>PREFERENCIAS</Text>

          <View style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <View style={[styles.menuIcon, { backgroundColor: COLORS.gray100 }]}>
                <View style={styles.menuIconInner} />
              </View>
              <View>
                <Text style={styles.menuItemText}>Modo Oscuro</Text>
                <Text style={styles.menuItemSubtext}>Reduce el brillo de la pantalla</Text>
              </View>
            </View>
            <Switch
              value={localSettings?.darkMode ?? false}
              onValueChange={(value) => handleToggle('darkMode', value)}
              disabled={isGuest}
              trackColor={{ false: COLORS.gray300, true: COLORS.primary }}
              thumbColor={COLORS.white}
            />
          </View>

          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <View style={[styles.menuIcon, { backgroundColor: COLORS.gray100 }]}>
                <View style={styles.menuIconInner} />
              </View>
              <Text style={styles.menuItemText}>Idioma</Text>
            </View>
            <View style={styles.languageContainer}>
              <Text style={styles.languageText}>
                {(localSettings?.language ?? 'es').toUpperCase()}
              </Text>
              <View style={styles.chevron} />
            </View>
          </TouchableOpacity>

          <View style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <View style={[styles.menuIcon, { backgroundColor: COLORS.gray100 }]}>
                <View style={styles.menuIconInner} />
              </View>
              <View>
                <Text style={styles.menuItemText}>Biometría</Text>
                <Text style={styles.menuItemSubtext}>Usar huella/Face ID</Text>
              </View>
            </View>
            <Switch
              value={localSettings?.biometricsEnabled ?? false}
              onValueChange={(value) => handleToggle('biometricsEnabled', value)}
              disabled={isGuest}
              trackColor={{ false: COLORS.gray300, true: COLORS.primary }}
              thumbColor={COLORS.white}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>NOTIFICACIONES</Text>

          <TouchableOpacity
            style={[styles.menuItem, isGuest && styles.disabled]}
            onPress={() => navigation.navigate('NotificationsSettings')}
            disabled={isGuest}
          >
            <View style={styles.menuItemLeft}>
              <View style={[styles.menuIcon, { backgroundColor: COLORS.successLight }]}>
                <View style={styles.menuIconInner} />
              </View>
              <Text style={styles.menuItemText}>Configurar Notificaciones</Text>
            </View>
            <View style={styles.chevron} />
          </TouchableOpacity>

          <View style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <View style={[styles.menuIcon, { backgroundColor: COLORS.successLight }]}>
                <View style={styles.menuIconInner} />
              </View>
              <View>
                <Text style={styles.menuItemText}>Sincronización Automática</Text>
                <Text style={styles.menuItemSubtext}>Actualizar alertas en segundo plano</Text>
              </View>
            </View>
            <Switch
              value={localSettings?.autoSync ?? true}
              onValueChange={(value) => handleToggle('autoSync', value)}
              disabled={isGuest}
              trackColor={{ false: COLORS.gray300, true: COLORS.primary }}
              thumbColor={COLORS.white}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>PRIVACIDAD Y SEGURIDAD</Text>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation.navigate('Privacy')}
          >
            <View style={styles.menuItemLeft}>
              <View style={[styles.menuIcon, { backgroundColor: COLORS.gray100 }]}>
                <View style={styles.menuIconInner} />
              </View>
              <Text style={styles.menuItemText}>Política de Privacidad</Text>
            </View>
            <View style={styles.chevron} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <View style={[styles.menuIcon, { backgroundColor: COLORS.gray100 }]}>
                <View style={styles.menuIconInner} />
              </View>
              <Text style={styles.menuItemText}>Términos y Condiciones</Text>
            </View>
            <View style={styles.chevron} />
          </TouchableOpacity>
        </View>

        <View style={styles.appInfo}>
          <Text style={styles.appVersion}>Versión 1.0.0</Text>
          <Text style={styles.appCopyright}>© 2024 MedTrace</Text>
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
  section: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: SIZES.sm,
    fontWeight: '600',
    color: COLORS.gray500,
    marginBottom: 8,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    ...SHADOWS.small,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuIconInner: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: COLORS.gray700,
  },
  menuItemText: {
    fontSize: SIZES.base,
    fontWeight: '600',
    color: COLORS.gray900,
  },
  menuItemSubtext: {
    fontSize: SIZES.sm,
    color: COLORS.gray500,
  },
  chevron: {
    width: 12,
    height: 12,
    borderRightWidth: 2,
    borderTopWidth: 2,
    borderColor: COLORS.gray400,
    transform: [{ rotate: '45deg' }],
  },
  languageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  languageText: {
    fontSize: SIZES.base,
    color: COLORS.gray900,
  },
  appInfo: {
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 32,
  },
  appVersion: {
    fontSize: SIZES.sm,
    color: COLORS.gray500,
  },
  appCopyright: {
    fontSize: SIZES.sm,
    color: COLORS.gray500,
  },
  disabled: {
    opacity: 0.4,
  },
});
