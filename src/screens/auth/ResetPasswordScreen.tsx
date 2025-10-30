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
//import Input from '../../components/Input';
import Button from '../../components/Button';
import { COLORS, SIZES, SHADOWS } from '../../constants/theme';

type Props = NativeStackScreenProps<RootStackParamList, 'ResetPassword'>;

export default function ResetPasswordScreen({ navigation }: Props) {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const requirements = [
    { text: 'Al menos 8 caracteres', met: password.length >= 8 },
    { text: 'Una letra mayúscula', met: /[A-Z]/.test(password) },
    { text: 'Un número', met: /[0-9]/.test(password) },
    { text: 'Un carácter especial (@, #, $, etc.)', met: /[!@#$%^&*]/.test(password) },
  ];

  const handleReset = async () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigation.navigate('PasswordSuccess');
    }, 1500);
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
          <Text style={styles.title}>Nueva Contraseña</Text>
          <Text style={styles.subtitle}>
            Crea una contraseña segura para tu cuenta
          </Text>
        </View>

        <View style={styles.formContainer}>
          <Input
            label="Nueva Contraseña"
            placeholder="Mínimo 8 caracteres"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <Input
            label="Confirmar Contraseña"
            placeholder="Repite tu contraseña"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
          />

          <View style={styles.requirementsBox}>
            <Text style={styles.requirementsTitle}>Tu contraseña debe contener:</Text>
            {requirements.map((req, index) => (
              <View key={index} style={styles.requirement}>
                <View
                  style={[
                    styles.requirementIcon,
                    req.met && styles.requirementIconMet,
                  ]}
                />
                <Text
                  style={[
                    styles.requirementText,
                    req.met && styles.requirementTextMet,
                  ]}
                >
                  {req.text}
                </Text>
              </View>
            ))}
          </View>

          <Button
            title="Restablecer Contraseña"
            onPress={handleReset}
            loading={loading}
            disabled={
              !requirements.every((r) => r.met) || password !== confirmPassword
            }
          />
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
  },
  formContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 24,
    ...SHADOWS.large,
  },
  requirementsBox: {
    backgroundColor: COLORS.gray50,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  requirementsTitle: {
    fontSize: SIZES.sm,
    fontWeight: '500',
    color: COLORS.gray700,
    marginBottom: 8,
  },
  requirement: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  requirementIcon: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: COLORS.gray400,
    marginRight: 8,
  },
  requirementIconMet: {
    backgroundColor: COLORS.success,
  },
  requirementText: {
    fontSize: SIZES.sm,
    color: COLORS.gray600,
  },
  requirementTextMet: {
    color: COLORS.success,
  },
});