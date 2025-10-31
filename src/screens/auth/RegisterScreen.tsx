import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { COLORS, SIZES, SHADOWS } from '../../constants/theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Register'>;

export default function RegisterScreen({ navigation }: Props) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    setLoading(true);
    // Simular registro
    setTimeout(() => {
      setLoading(false);
      navigation.replace('MainTabs');
    }, 1500);
  };

  const handleGuestMode = () => {
    navigation.replace('MainTabs');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.logoContainer}>
          <View style={styles.logo}>
            <View style={styles.logoIcon} />
          </View>
          <Text style={styles.logoTitle}>MedTrace</Text>
          <Text style={styles.logoSubtitle}>Crea tu cuenta</Text>
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.formTitle}>Registro</Text>

          <Input
            label="Nombre completo"
            placeholder="Juan Pérez"
            value={name}
            onChangeText={setName}
          />

          <Input
            label="Email"
            placeholder="tu@email.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Input
            label="Teléfono (opcional)"
            placeholder="+54 9 11 1234-5678"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />

          <Input
            label="Contraseña"
            placeholder="••••••••"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <Input
            label="Confirmar contraseña"
            placeholder="••••••••"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
          />

          <TouchableOpacity
            style={styles.termsContainer}
            onPress={() => setAcceptTerms(!acceptTerms)}
          >
            <View style={[styles.checkbox, acceptTerms && styles.checkboxActive]}>
              {acceptTerms && <View style={styles.checkboxInner} />}
            </View>
            <Text style={styles.termsText}>
              Acepto los{' '}
              <Text style={styles.termsLink}>términos y condiciones</Text> y la{' '}
              <Text style={styles.termsLink}>política de privacidad</Text>
            </Text>
          </TouchableOpacity>

          <Button
            title="Crear cuenta"
            onPress={handleRegister}
            loading={loading}
            disabled={!acceptTerms}
          />

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>o</Text>
            <View style={styles.dividerLine} />
          </View>

          <Button
            title="Continuar como invitado"
            onPress={handleGuestMode}
            variant="outline"
          />
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>¿Ya tienes cuenta? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.footerLink}>Inicia sesión aquí</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logo: {
    width: 80,
    height: 80,
    backgroundColor: COLORS.primary,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    ...SHADOWS.medium,
  },
  logoIcon: {
    width: 48,
    height: 48,
    backgroundColor: COLORS.white,
    borderRadius: 8,
  },
  logoTitle: {
    fontSize: SIZES.xxxl,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 8,
  },
  logoSubtitle: {
    fontSize: SIZES.base,
    color: COLORS.gray600,
    textAlign: 'center',
  },
  formContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 24,
    marginBottom: 16,
    ...SHADOWS.large,
  },
  formTitle: {
    fontSize: SIZES.xxl,
    fontWeight: 'bold',
    color: COLORS.gray900,
    marginBottom: 24,
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
    gap: 8,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: COLORS.gray300,
    borderRadius: 4,
    marginTop: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxActive: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary,
  },
  checkboxInner: {
    width: 12,
    height: 12,
    backgroundColor: COLORS.white,
    borderRadius: 2,
  },
  termsText: {
    flex: 1,
    fontSize: SIZES.sm,
    color: COLORS.gray600,
    lineHeight: 20,
  },
  termsLink: {
    fontWeight: '600',
    color: COLORS.primary,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.gray300,
  },
  dividerText: {
    paddingHorizontal: 16,
    fontSize: SIZES.sm,
    color: COLORS.gray500,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    fontSize: SIZES.base,
    color: COLORS.gray600,
  },
  footerLink: {
    fontSize: SIZES.base,
    fontWeight: '600',
    color: COLORS.primary,
  },
});