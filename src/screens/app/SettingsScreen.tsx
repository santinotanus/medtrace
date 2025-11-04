import React from 'react';
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

type Props = NativeStackScreenProps<RootStackParamList, 'Settings'>;

export default function SettingsScreen({ navigation }: Props) {
  const [darkMode, setDarkMode] = React.useState(false);
  const [biometrics, setBiometrics] = React.useState(true);
  const [autoSync, setAutoSync] = React.useState(true);

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
        <Text style={styles.headerTitle}>Configuración</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Account Section */}
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

          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <View style={[styles.menuIcon, { backgroundColor: COLORS.primaryLight }]}>
                <View style={styles.menuIconInner} />
              </View>
              <Text style={styles.menuItemText}>Verificación en 2 pasos</Text>
            </View>
            <View style={styles.chevron} />
          </TouchableOpacity>
        </View>

        {/* Preferences Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>PREFERENCIAS</Text>

          <View style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <View style={[styles.menuIcon, { backgroundColor: COLORS.gray100 }]}>
                <View style={styles.menuIconInner} />
              </View>
              <View>
                <Text style={styles.menuItemText}>Modo Oscuro</Text>
                <Text style={styles.menuItemSubtext}>
                  Reduce el brillo de la pantalla
                </Text>
              </View>
            </View>
            <Switch
              value={darkMode}
              onValueChange={setDarkMode}
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
              <Text style={styles.languageText}>Español</Text>
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
                <Text style={styles.menuItemSubtext}>
                  Usar huella/Face ID
                </Text>
              </View>
            </View>
            <Switch
              value={biometrics}
              onValueChange={setBiometrics}
              trackColor={{ false: COLORS.gray300, true: COLORS.primary }}
              thumbColor={COLORS.white}
            />
          </View>
        </View>

        {/* Notifications Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>NOTIFICACIONES</Text>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation.navigate('NotificationsSettings' as any)}
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
                <Text style={styles.menuItemSubtext}>
                  Actualizar alertas en segundo plano
                </Text>
              </View>
            </View>
            <Switch
              value={autoSync}
              onValueChange={setAutoSync}
              trackColor={{ false: COLORS.gray300, true: COLORS.primary }}
              thumbColor={COLORS.white}
            />
          </View>
        </View>

        {/* Privacy & Security */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>PRIVACIDAD Y SEGURIDAD</Text>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation.navigate('Privacy' as any)}
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

          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <View style={[styles.menuIcon, { backgroundColor: COLORS.gray100 }]}>
                <View style={styles.menuIconInner} />
              </View>
              <Text style={styles.menuItemText}>Permisos de la App</Text>
            </View>
            <View style={styles.chevron} />
          </TouchableOpacity>
        </View>

        {/* Data Management */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>GESTIÓN DE DATOS</Text>

          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <View style={[styles.menuIcon, { backgroundColor: COLORS.infoLight }]}>
                <View style={styles.menuIconInner} />
              </View>
              <Text style={styles.menuItemText}>Descargar mis Datos</Text>
            </View>
            <View style={styles.chevron} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <View style={[styles.menuIcon, { backgroundColor: COLORS.warningLight }]}>
                <View style={styles.menuIconInner} />
              </View>
              <Text style={styles.menuItemText}>Limpiar Caché</Text>
            </View>
            <View style={styles.chevron} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <View style={[styles.menuIcon, { backgroundColor: COLORS.errorLight }]}>
                <View style={styles.menuIconInner} />
              </View>
              <Text style={[styles.menuItemText, { color: COLORS.error }]}>
                Eliminar Cuenta
              </Text>
            </View>
            <View style={styles.chevron} />
          </TouchableOpacity>
        </View>

        {/* App Info */}
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
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: SIZES.xs,
    fontWeight: '700',
    color: COLORS.gray500,
    paddingHorizontal: 24,
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.white,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray100,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  menuIconInner: {
    width: 20,
    height: 20,
    backgroundColor: COLORS.gray600,
    borderRadius: 4,
  },
  menuItemText: {
    fontSize: SIZES.base,
    fontWeight: '500',
    color: COLORS.gray900,
  },
  menuItemSubtext: {
    fontSize: SIZES.sm,
    color: COLORS.gray500,
    marginTop: 2,
  },
  chevron: {
    width: 20,
    height: 20,
    backgroundColor: COLORS.gray300,
    borderRadius: 4,
  },
  languageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  languageText: {
    fontSize: SIZES.base,
    color: COLORS.gray600,
  },
  appInfo: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  appVersion: {
    fontSize: SIZES.sm,
    color: COLORS.gray500,
    marginBottom: 4,
  },
  appCopyright: {
    fontSize: SIZES.sm,
    color: COLORS.gray400,
  },
});