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
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../hooks/useAuth';

type Props = NativeStackScreenProps<RootStackParamList, 'ForgotPassword'>;

export default function ForgotPasswordScreen({ navigation }: Props) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { beginPasswordRecovery } = useAuth();

  const handleSendCode = async () => {
    if (!email.trim()) {
      setErrorMessage('Ingresá el correo asociado a tu cuenta.');
      return;
    }

    try {
      setLoading(true);
      setErrorMessage(null);
      const { error } = await supabase.auth.signInWithOtp({
        email: email.trim().toLowerCase(),
        options: { shouldCreateUser: false },
      });

      if (error) {
        setErrorMessage(error.message);
        return;
      }

      beginPasswordRecovery();
      navigation.navigate('VerifyCode', { email: email.trim().toLowerCase() });
    } finally {
      setLoading(false);
    }
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
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>← Volver</Text>
        </TouchableOpacity>

        <View style={styles.iconContainer}>
          <View style={styles.icon}>
            <View style={styles.iconInner} />
          </View>
          <Text style={styles.title}>¿Olvidaste tu contraseña?</Text>
          <Text style={styles.subtitle}>
            No te preocupes, te enviaremos instrucciones para restablecerla
          </Text>
        </View>

        <View style={styles.formContainer}>
          <Input
            label="Correo Electrónico"
            placeholder="tu@email.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}

          <Button
            title="Enviar Instrucciones"
            onPress={handleSendCode}
            loading={loading}
            disabled={!email.trim() || loading}
          />
        </View>

        <View style={styles.infoBox}>
          <View style={styles.infoIcon} />
          <View style={styles.infoContent}>
            <Text style={styles.infoTitle}>Revisa tu bandeja de entrada</Text>
            <Text style={styles.infoText}>
              Te enviaremos un código de verificación a tu correo electrónico
              registrado.
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.footer}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.footerText}>Volver al inicio de sesión</Text>
        </TouchableOpacity>
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
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  backButton: {
    marginBottom: 32,
  },
  backButtonText: {
    fontSize: SIZES.base,
    color: COLORS.gray600,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  icon: {
    width: 64,
    height: 64,
    backgroundColor: COLORS.primary,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    ...SHADOWS.medium,
  },
  iconInner: {
    width: 32,
    height: 32,
    backgroundColor: COLORS.white,
    borderRadius: 8,
  },
  title: {
    fontSize: SIZES.xxxl,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: SIZES.base,
    color: COLORS.gray600,
    textAlign: 'center',
    paddingHorizontal: 16,
  },
  formContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
    ...SHADOWS.large,
  },
  errorText: {
    color: COLORS.error,
    marginBottom: 12,
    fontSize: SIZES.sm,
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: COLORS.infoLight,
    borderWidth: 1,
    borderColor: '#BFDBFE',
    borderRadius: 12,
    padding: 16,
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
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: SIZES.sm,
    fontWeight: '500',
    color: '#1E40AF',
    marginBottom: 4,
  },
  infoText: {
    fontSize: SIZES.sm,
    color: '#1E40AF',
    lineHeight: 20,
  },
  footer: {
    alignItems: 'center',
  },
  footerText: {
    fontSize: SIZES.sm,
    fontWeight: '500',
    color: COLORS.primary,
  },
});
