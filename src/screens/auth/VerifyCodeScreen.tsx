import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types';
import Button from '../../components/Button';
import { COLORS, SIZES, SHADOWS } from '../../constants/theme';

type Props = NativeStackScreenProps<RootStackParamList, 'VerifyCode'>;

export default function VerifyCodeScreen({ navigation, route }: Props) {
  const { email } = route.params;
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef<(TextInput | null)[]>([]);

  const handleCodeChange = (text: string, index: number) => {
    if (text.length > 1) return;

    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);

    // Auto focus next input
    if (text && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    setLoading(true);
    const fullCode = code.join('');
    // Simular verificación
    setTimeout(() => {
      setLoading(false);
      navigation.navigate('ResetPassword', { code: fullCode });
    }, 1500);
  };

  const handleResend = () => {
    // Lógica para reenviar código
    setCode(['', '', '', '', '', '']);
    inputRefs.current[0]?.focus();
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
          <Text style={styles.title}>Verificar Código</Text>
          <Text style={styles.subtitle}>
            Ingresa el código de 6 dígitos que enviamos a
          </Text>
          <Text style={styles.email}>{email}</Text>
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.label}>Código de Verificación</Text>
          <View style={styles.codeContainer}>
            {code.map((digit, index) => (
              <TextInput
                key={index}
                ref={(ref) => (inputRefs.current[index] = ref)}
                style={styles.codeInput}
                value={digit}
                onChangeText={(text) => handleCodeChange(text, index)}
                onKeyPress={(e) => handleKeyPress(e, index)}
                keyboardType="number-pad"
                maxLength={1}
                selectTextOnFocus
              />
            ))}
          </View>

          <Text style={styles.timer}>
            El código expira en <Text style={styles.timerBold}>04:59</Text>
          </Text>

          <Button
            title="Verificar Código"
            onPress={handleVerify}
            loading={loading}
            disabled={code.some((digit) => !digit)}
            style={styles.verifyButton}
          />

          <View style={styles.resendContainer}>
            <Text style={styles.resendText}>¿No recibiste el código? </Text>
            <TouchableOpacity onPress={handleResend}>
              <Text style={styles.resendLink}>Reenviar</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.warningBox}>
          <View style={styles.warningIcon} />
          <Text style={styles.warningText}>
            Revisa también tu carpeta de spam si no encuentras el correo.
          </Text>
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
  email: {
    fontSize: SIZES.base,
    fontWeight: '500',
    color: COLORS.gray900,
    marginTop: 4,
  },
  formContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
    ...SHADOWS.large,
  },
  label: {
    fontSize: SIZES.sm,
    fontWeight: '500',
    color: COLORS.gray700,
    textAlign: 'center',
    marginBottom: 12,
  },
  codeContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 16,
  },
  codeInput: {
    width: 48,
    height: 56,
    borderWidth: 2,
    borderColor: COLORS.gray300,
    borderRadius: 12,
    fontSize: SIZES.xxl,
    fontWeight: 'bold',
    textAlign: 'center',
    color: COLORS.gray900,
  },
  timer: {
    fontSize: SIZES.sm,
    color: COLORS.gray600,
    textAlign: 'center',
    marginBottom: 24,
  },
  timerBold: {
    fontWeight: 'bold',
    color: COLORS.gray900,
  },
  verifyButton: {
    marginBottom: 16,
  },
  resendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  resendText: {
    fontSize: SIZES.sm,
    color: COLORS.gray600,
  },
  resendLink: {
    fontSize: SIZES.sm,
    fontWeight: '500',
    color: COLORS.primary,
  },
  warningBox: {
    flexDirection: 'row',
    backgroundColor: COLORS.warningLight,
    borderWidth: 1,
    borderColor: '#FDE68A',
    borderRadius: 12,
    padding: 16,
    alignItems: 'flex-start',
  },
  warningIcon: {
    width: 20,
    height: 20,
    backgroundColor: COLORS.warning,
    borderRadius: 10,
    marginRight: 12,
    marginTop: 2,
  },
  warningText: {
    flex: 1,
    fontSize: SIZES.sm,
    color: '#92400E',
    lineHeight: 20,
  },
});