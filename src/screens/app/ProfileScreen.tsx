import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainTabParamList, RootStackParamList } from '../../types';
import { COLORS, SIZES, SHADOWS } from '../../constants/theme';

// Tipado
type TabNav = BottomTabNavigationProp<MainTabParamList, 'Profile'>;
type RootNav = NativeStackNavigationProp<RootStackParamList>;
type ProfileRouteProp = RouteProp<MainTabParamList, 'Profile'>;

// Componente individual del menú
interface MenuItemProps {
  icon: string;
  iconBg: string;
  title: string;
  subtitle: string;
  onPress: () => void;
}

const MenuItem: React.FC<MenuItemProps> = ({
  icon,
  iconBg,
  title,
  subtitle,
  onPress,
}) => (
  <TouchableOpacity style={styles.menuItem} onPress={onPress}>
    <View style={styles.menuItemLeft}>
      <View style={[styles.menuIcon, { backgroundColor: iconBg }]}>
        <View style={styles.menuIconInner} />
      </View>
      <View style={styles.menuItemText}>
        <Text style={styles.menuItemTitle}>{title}</Text>
        <Text style={styles.menuItemSubtitle}>{subtitle}</Text>
      </View>
    </View>
    <View style={styles.menuArrow} />
  </TouchableOpacity>
);

export default function ProfileScreen() {
  const tabNav = useNavigation<TabNav>();
  const stackNav = tabNav.getParent<RootNav>();
  const route = useRoute<ProfileRouteProp>();
  const isGuest = route.params?.guest;

  const handleLogout = () => {
    Alert.alert(
      'Cerrar Sesión',
      '¿Estás seguro que deseas cerrar sesión?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Cerrar Sesión',
          style: 'destructive',
          onPress: () => {
            stackNav?.reset({
              index: 0,
              routes: [{ name: 'Login' }],
            });
          },
        },
      ]
    );
  };

  const handleLogin = () => {
    stackNav?.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  if (isGuest) {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Guest Header */}
          <View style={styles.header}>
            <View style={styles.avatarContainer}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>?</Text>
              </View>
            </View>
            <Text style={styles.userName}>Invitado</Text>
            <Text style={styles.userEmail}>
              Inicia sesión para una experiencia completa
            </Text>
          </View>

          {/* Guest Menu */}
          <View style={styles.menuContainer}>
            <MenuItem
              icon="help"
              iconBg={COLORS.gray100}
              title="Ayuda y soporte"
              subtitle="Preguntas frecuentes"
              onPress={() => stackNav?.navigate('Help')}
            />
            <MenuItem
              icon="info"
              iconBg={COLORS.gray100}
              title="Acerca de MedTrace"
              subtitle="Versión 1.0.0"
              onPress={() => stackNav?.navigate('About')}
            />
            <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
              <Text style={styles.loginButtonText}>Iniciar Sesión / Registrarse</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header del perfil */}
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>MG</Text>
            </View>
          </View>
          <Text style={styles.userName}>María González</Text>
          <Text style={styles.userEmail}>maria.gonzalez@email.com</Text>
        </View>

        {/* Estadísticas */}
        <View style={styles.statsContainer}>
          <View style={styles.statsGrid}>
            <TouchableOpacity
              style={styles.statCard}
              onPress={() => {}}
            >
              <Text style={[styles.statNumber, { color: COLORS.success }]}>24</Text>
              <Text style={styles.statLabel}>Verificados</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.statCard}
              onPress={() => stackNav?.navigate('Alerts')}
            >
              <Text style={[styles.statNumber, { color: COLORS.primary }]}>3</Text>
              <Text style={styles.statLabel}>Alertas</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.statCard}
              onPress={() => {}}
            >
              <Text style={[styles.statNumber, { color: COLORS.gray700 }]}>1</Text>
              <Text style={styles.statLabel}>Reportes</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Menú */}
        <View style={styles.menuContainer}>
          <MenuItem
            icon="user"
            iconBg={COLORS.primaryLight}
            title="Datos personales"
            subtitle="Editar información"
            onPress={() => stackNav?.navigate('Settings')}
          />

          <MenuItem
            icon="bell"
            iconBg={COLORS.successLight}
            title="Notificaciones"
            subtitle="Configurar alertas"
            onPress={() => stackNav?.navigate('NotificationsSettings')}
          />

          <MenuItem
            icon="lock"
            iconBg={COLORS.gray100}
            title="Privacidad y seguridad"
            subtitle="Gestionar permisos"
            onPress={() => stackNav?.navigate('Privacy')}
          />

          <MenuItem
            icon="help"
            iconBg={COLORS.gray100}
            title="Ayuda y soporte"
            subtitle="Preguntas frecuentes"
            onPress={() => stackNav?.navigate('Help')}
          />

          <MenuItem
            icon="info"
            iconBg={COLORS.gray100}
            title="Acerca de MedTrace"
            subtitle="Versión 1.0.0"
            onPress={() => stackNav?.navigate('About')}
          />

          {/* Botón de cerrar sesión */}
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutText}>Cerrar Sesión</Text>
          </TouchableOpacity>
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
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 24,
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.large,
  },
  avatarText: {
    fontSize: SIZES.xxxl,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  userName: {
    fontSize: SIZES.xxl,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: SIZES.base,
    color: COLORS.gray600,
  },
  statsContainer: {
    paddingHorizontal: 24,
    marginBottom: 24,
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
    marginBottom: 4,
  },
  statLabel: {
    fontSize: SIZES.xs,
    color: COLORS.gray500,
  },
  menuContainer: {
    paddingHorizontal: 24,
    gap: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    ...SHADOWS.small,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
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
    flex: 1,
  },
  menuItemTitle: {
    fontSize: SIZES.base,
    fontWeight: '600',
    color: COLORS.gray900,
    marginBottom: 2,
  },
  menuItemSubtitle: {
    fontSize: SIZES.sm,
    color: COLORS.gray500,
  },
  menuArrow: {
    width: 20,
    height: 20,
    backgroundColor: COLORS.gray400,
    borderRadius: 4,
  },
  logoutButton: {
    backgroundColor: COLORS.errorLight,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 24,
    ...SHADOWS.small,
  },
  logoutText: {
    fontSize: SIZES.base,
    fontWeight: '600',
    color: COLORS.error,
  },
  loginButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 24,
    ...SHADOWS.medium,
  },
  loginButtonText: {
    fontSize: SIZES.base,
    fontWeight: '600',
    color: COLORS.white,
  },
});