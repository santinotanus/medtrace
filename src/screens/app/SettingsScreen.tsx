import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Switch,
  Alert,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList, UserSettings } from '../../types';
import { COLORS, SIZES, SHADOWS } from '../../constants/theme';
import { useAuth } from '../../hooks/useAuth';
import { useBiometrics } from '../../hooks/useBiometrics';

type Props = NativeStackScreenProps<RootStackParamList, 'Settings'>;

export default function SettingsScreen({ navigation }: Props) {
  const { userSettings, updateUserSettings, isGuest } = useAuth();
  const { isAvailable, biometricType, authenticate, promptEnableBiometrics } = useBiometrics();
  const [localSettings, setLocalSettings] = useState<UserSettings | null>(userSettings);

  useEffect(() => {
    setLocalSettings(userSettings);
  }, [userSettings]);

  const handleToggle = async (key: keyof UserSettings, value: boolean) => {
    const settings = localSettings || userSettings;
    if (!settings) return;
    
    const updatedSettings = { ...settings, [key]: value };
    setLocalSettings(updatedSettings);
    await updateUserSettings({ [key]: value });
  };

  const handleBiometricToggle = async (value: boolean) => {
    console.log('[Biometric] Toggle iniciado, value:', value);
    console.log('[Biometric] isAvailable:', isAvailable);
    console.log('[Biometric] localSettings:', localSettings);
    console.log('[Biometric] userSettings:', userSettings);
    
    // Si no hay settings, crear uno por defecto
    let settings = localSettings || userSettings;
    
    if (!settings && !isGuest) {
      console.log('[Biometric] Creando settings por defecto...');
      // Crear settings con valores por defecto
      const defaultSettings: Partial<UserSettings> = {
        biometricsEnabled: false,
        darkMode: false,
        language: 'es',
        autoSync: true,
        dataUsageConsent: true,
        analyticsEnabled: false,
      };
      
      try {
        await updateUserSettings(defaultSettings);
        // Esperar un momento para que se actualice el contexto
        await new Promise(resolve => setTimeout(resolve, 500));
        settings = defaultSettings as UserSettings;
        setLocalSettings(settings);
      } catch (error) {
        console.error('[Biometric] Error creando settings:', error);
        Alert.alert('Error', 'No se pudo inicializar la configuración. Intenta nuevamente.');
        return;
      }
    }
    
    if (!settings) {
      console.log('[Biometric] No hay settings disponibles');
      Alert.alert('Error', 'No se pudo cargar la configuración. Intenta nuevamente.');
      return;
    }

    // Si intenta habilitar pero no hay biometría disponible
    if (value && !isAvailable) {
      console.log('[Biometric] No disponible, mostrando prompt');
      promptEnableBiometrics();
      return;
    }

    // Si intenta habilitar, pedir autenticación primero
    if (value) {
      console.log('[Biometric] Solicitando autenticación...');
      const success = await authenticate('Confirma tu identidad para habilitar la biometría');
      console.log('[Biometric] Resultado autenticación:', success);
      
      if (!success) {
        Alert.alert(
          'Autenticación fallida',
          'No se pudo verificar tu identidad. Intenta nuevamente.'
        );
        return;
      }
    }

    // Actualizar configuración
    console.log('[Biometric] Actualizando configuración...');
    const updatedSettings = { ...settings, biometricsEnabled: value };
    setLocalSettings(updatedSettings);
    
    try {
      await updateUserSettings({ biometricsEnabled: value });
      console.log('[Biometric] Configuración actualizada exitosamente');
      
      Alert.alert(
        value ? 'Biometría habilitada' : 'Biometría deshabilitada',
        value
          ? 'Ahora puedes usar tu biometría para acceder a la app.'
          : 'La autenticación biométrica ha sido deshabilitada.'
      );
    } catch (error) {
      console.error('[Biometric] Error al actualizar configuración:', error);
      // Revertir el cambio local si falla
      setLocalSettings(settings);
      Alert.alert('Error', 'No se pudo actualizar la configuración. Intenta nuevamente.');
    }
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

          <TouchableOpacity
            style={[styles.menuItem, isGuest && styles.disabled]}
            onPress={() => navigation.navigate('EditProfile')}
            disabled={isGuest}
          >
            <View style={styles.menuItemLeft}>
              <View style={[styles.menuIcon, { backgroundColor: COLORS.primaryLight }]} />
              <Text style={styles.menuItemText}>Editar Perfil</Text>
            </View>
            <View style={styles.chevron} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.menuItem, isGuest && styles.disabled]}
            onPress={() => navigation.navigate('ChangePassword')}
            disabled={isGuest}
          >
            <View style={styles.menuItemLeft}>
              <View style={[styles.menuIcon, { backgroundColor: COLORS.primaryLight }]} />
              <Text style={styles.menuItemText}>Cambiar Contraseña</Text>
            </View>
            <View style={styles.chevron} />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>PREFERENCIAS</Text>

          <View style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <View style={[styles.menuIcon, { backgroundColor: COLORS.gray100 }]} />
              <View style={{ flex: 1 }}>
                <Text style={styles.menuItemText}>Modo Oscuro</Text>
                <Text style={styles.menuItemSubtext}>Próximamente</Text>
              </View>
            </View>
            <Switch
              value={false}
              onValueChange={() => {}}
              disabled={true}
              trackColor={{ false: COLORS.gray300, true: COLORS.primary }}
              thumbColor={COLORS.gray400}
            />
          </View>

          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <View style={[styles.menuIcon, { backgroundColor: COLORS.gray100 }]} />
              <Text style={styles.menuItemText}>Idioma</Text>
            </View>
            <View style={styles.languageContainer}>
              <Text style={styles.languageText}>
                {((localSettings || userSettings)?.language ?? 'es').toUpperCase()}
              </Text>
              <View style={styles.chevron} />
            </View>
          </TouchableOpacity>

          <View style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <View style={[styles.menuIcon, { backgroundColor: COLORS.gray100 }]} />
              <View style={{ flex: 1 }}>
                <Text style={styles.menuItemText}>Biometría</Text>
                <Text style={styles.menuItemSubtext}>
                  {isAvailable 
                    ? `Usar ${biometricType}`
                    : 'No disponible en este dispositivo'}
                </Text>
              </View>
            </View>
            <Switch
              value={(localSettings || userSettings)?.biometricsEnabled ?? false}
              onValueChange={handleBiometricToggle}
              disabled={isGuest || !isAvailable}
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
              <View style={[styles.menuIcon, { backgroundColor: COLORS.successLight }]} />
              <Text style={styles.menuItemText}>Configurar Notificaciones</Text>
            </View>
            <View style={styles.chevron} />
          </TouchableOpacity>

          <View style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <View style={[styles.menuIcon, { backgroundColor: COLORS.successLight }]} />
              <View style={{ flex: 1 }}>
                <Text style={styles.menuItemText}>Sincronización Automática</Text>
                <Text style={styles.menuItemSubtext}>Actualizar alertas en segundo plano</Text>
              </View>
            </View>
            <Switch
              value={(localSettings || userSettings)?.autoSync ?? true}
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
              <View style={[styles.menuIcon, { backgroundColor: COLORS.gray100 }]} />
              <Text style={styles.menuItemText}>Política de Privacidad</Text>
            </View>
            <View style={styles.chevron} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <View style={[styles.menuIcon, { backgroundColor: COLORS.gray100 }]} />
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
    flex: 1,
    marginRight: 12,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
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
