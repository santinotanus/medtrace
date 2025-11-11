import { useEffect, useState, useCallback } from 'react';
import * as LocalAuthentication from 'expo-local-authentication';
import { Alert } from 'react-native';

export function useBiometrics() {
  const [isAvailable, setIsAvailable] = useState(false);
  const [biometricType, setBiometricType] = useState<string>('');

  useEffect(() => {
    checkAvailability();
  }, []);

  const checkAvailability = async () => {
    try {
      console.log('[useBiometrics] Verificando disponibilidad...');
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();
      const supportedTypes = await LocalAuthentication.supportedAuthenticationTypesAsync();

      console.log('[useBiometrics] hasHardware:', hasHardware);
      console.log('[useBiometrics] isEnrolled:', isEnrolled);
      console.log('[useBiometrics] supportedTypes:', supportedTypes);

      const available = hasHardware && isEnrolled;
      setIsAvailable(available);

      if (available && supportedTypes.length > 0) {
        // Determinar el tipo de biometría disponible
        if (supportedTypes.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) {
          setBiometricType('Face ID');
        } else if (supportedTypes.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)) {
          setBiometricType('Huella Digital');
        } else if (supportedTypes.includes(LocalAuthentication.AuthenticationType.IRIS)) {
          setBiometricType('Reconocimiento de Iris');
        } else {
          setBiometricType('Biometría');
        }
      }
      
      console.log('[useBiometrics] Disponibilidad final:', available);
    } catch (error) {
      console.error('[useBiometrics] Error checking biometric availability:', error);
      setIsAvailable(false);
    }
  };

  const authenticate = useCallback(async (
    reason: string = 'Autentícate para continuar'
  ): Promise<boolean> => {
    try {
      console.log('[useBiometrics] Iniciando autenticación con reason:', reason);
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: reason,
        fallbackLabel: 'Usar contraseña',
        cancelLabel: 'Cancelar',
        disableDeviceFallback: false,
      });

      console.log('[useBiometrics] Resultado autenticación:', result);
      return result.success;
    } catch (error) {
      console.error('[useBiometrics] Biometric authentication error:', error);
      return false;
    }
  }, []);

  const promptEnableBiometrics = useCallback(() => {
    Alert.alert(
      'Habilitar Biometría',
      'Para usar esta función, necesitas configurar la autenticación biométrica en tu dispositivo.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Configurar',
          onPress: () => {
            // En un caso real, podrías abrir la configuración del sistema
            Alert.alert(
              'Configuración',
              'Por favor, ve a la configuración de tu dispositivo para habilitar Face ID, Touch ID o huella digital.'
            );
          },
        },
      ]
    );
  }, []);

  return {
    isAvailable,
    biometricType,
    authenticate,
    promptEnableBiometrics,
    checkAvailability,
  };
}
