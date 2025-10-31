import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types';
import Button from '../../components/Button';
import { COLORS, SIZES, SHADOWS } from '../../constants/theme';

type Props = NativeStackScreenProps<RootStackParamList, 'PasswordSuccess'>;

export default function PasswordSuccessScreen({ navigation }: Props) {
  const handleLogin = () => {
    navigation.navigate('Login');
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.content}>
        <View style={styles.successIconContainer}>
          <View style={styles.successIcon} />
        </View>

        <Text style={styles.title}>¡Contraseña Restablecida!</Text>
        <Text style={styles.subtitle}>
          Tu contraseña ha sido actualizada exitosamente
        </Text>

        <View style={styles.card}>
          <View style={styles.cardIconContainer}>
            <View style={styles.cardIcon} />
          </View>
          <Text style={styles.cardTitle}>Tu cuenta está segura</Text>
          <Text style={styles.cardSubtitle}>
            Ahora puedes iniciar sesión con tu nueva contraseña
          </Text>

          <View style={styles.tipsBox}>
            <Text style={styles.tipsTitle}>💡 Consejos de seguridad:</Text>
            <Text style={styles.tipText}>• No compartas tu contraseña con nadie</Text>
            <Text style={styles.tipText}>
              • Usa contraseñas diferentes para cada cuenta
            </Text>
            <Text style={styles.tipText}>
              • Cambia tu contraseña periódicamente
            </Text>
          </View>

          <Button title="Iniciar Sesión" onPress={handleLogin} />
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>¿Necesitas ayuda? </Text>
          <Text style={styles.footerLink}>Contacta soporte</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: COLORS.background,
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  successIconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: COLORS.successLight,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 24,
  },
  successIcon: {
    width: 48,
    height: 48,
    backgroundColor: COLORS.success,
    borderRadius: 24,
  },
  title: {
    fontSize: SIZES.xxxl,
    fontWeight: 'bold',
    color: COLORS.primary,
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: SIZES.lg,
    color: COLORS.gray600,
    textAlign: 'center',
    marginBottom: 32,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
    ...SHADOWS.large,
  },
  cardIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 16,
  },
  cardIcon: {
    width: 32,
    height: 32,
    backgroundColor: COLORS.primary,
    borderRadius: 16,
  },
  cardTitle: {
    fontSize: SIZES.lg,
    fontWeight: '600',
    color: COLORS.gray900,
    textAlign: 'center',
    marginBottom: 8,
  },
  cardSubtitle: {
    fontSize: SIZES.sm,
    color: COLORS.gray600,
    textAlign: 'center',
    marginBottom: 24,
  },
  tipsBox: {
    backgroundColor: COLORS.infoLight,
    borderWidth: 1,
    borderColor: '#BFDBFE',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  tipsTitle: {
    fontSize: SIZES.sm,
    fontWeight: '500',
    color: '#1E3A8A',
    marginBottom: 8,
  },
  tipText: {
    fontSize: SIZES.sm,
    color: '#1E3A8A',
    lineHeight: 20,
    marginTop: 4,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    fontSize: SIZES.sm,
    color: COLORS.gray600,
  },
  footerLink: {
    fontSize: SIZES.sm,
    fontWeight: '500',
    color: COLORS.primary,
  },
});