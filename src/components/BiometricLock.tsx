import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  AppState,
  AppStateStatus,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { COLORS, SIZES, SHADOWS } from '../constants/theme';
import { useAuth } from '../hooks/useAuth';
import { useBiometrics } from '../hooks/useBiometrics';

interface BiometricLockProps {
  children: React.ReactNode;
}

export function BiometricLock({ children }: BiometricLockProps) {
  const { userSettings, isGuest } = useAuth();
  const { isAvailable, biometricType, authenticate } = useBiometrics();
  const [isLocked, setIsLocked] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const appState = useRef(AppState.currentState);
  const lockTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const biometricsEnabled = userSettings?.biometricsEnabled ?? false;
  const shouldUseBiometrics = biometricsEnabled && isAvailable && !isGuest;

  useEffect(() => {
    if (!shouldUseBiometrics) {
      setIsLocked(false);
      return;
    }

    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      subscription.remove();
      if (lockTimeoutRef.current) {
        clearTimeout(lockTimeoutRef.current);
      }
    };
  }, [shouldUseBiometrics]);

  const handleAppStateChange = (nextAppState: AppStateStatus) => {
    // Si la app pasa a background
    if (
      appState.current.match(/active/) &&
      nextAppState.match(/inactive|background/)
    ) {
      // Bloquear inmediatamente cuando va a background
      if (lockTimeoutRef.current) {
        clearTimeout(lockTimeoutRef.current);
      }
      lockTimeoutRef.current = setTimeout(() => {
        setIsLocked(true);
      }, 100);
    }

    // Si la app vuelve a primer plano y está bloqueada
    if (
      appState.current.match(/inactive|background/) &&
      nextAppState === 'active' &&
      isLocked
    ) {
      handleAuthentication();
    }

    appState.current = nextAppState;
  };

  const handleAuthentication = async () => {
    if (isAuthenticating) return;

    setIsAuthenticating(true);
    const success = await authenticate('Autentícate para desbloquear MedTrace');
    setIsAuthenticating(false);

    if (success) {
      setIsLocked(false);
    } else {
      // Si falla, dar opción de reintentar
      setTimeout(() => {
        handleAuthentication();
      }, 1000);
    }
  };

  // Si no está bloqueada, mostrar el contenido normal
  if (!isLocked) {
    return <>{children}</>;
  }

  // Pantalla de bloqueo biométrico
  return (
    <View style={styles.lockScreen}>
      <View style={styles.lockContent}>
        <View style={styles.iconContainer}>
          <View style={styles.lockIcon} />
        </View>

        <Text style={styles.lockTitle}>App Bloqueada</Text>
        <Text style={styles.lockSubtitle}>
          Usa tu {biometricType.toLowerCase()} para desbloquear
        </Text>

        {isAuthenticating ? (
          <ActivityIndicator size="large" color={COLORS.primary} style={styles.loader} />
        ) : (
          <TouchableOpacity
            style={styles.unlockButton}
            onPress={handleAuthentication}
          >
            <Text style={styles.unlockButtonText}>Desbloquear</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  lockScreen: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lockContent: {
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
    ...SHADOWS.medium,
  },
  lockIcon: {
    width: 40,
    height: 50,
    borderWidth: 4,
    borderColor: COLORS.primary,
    borderRadius: 8,
    position: 'relative',
  },
  lockTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.gray900,
    marginBottom: 8,
  },
  lockSubtitle: {
    fontSize: SIZES.base,
    color: COLORS.gray600,
    textAlign: 'center',
    marginBottom: 40,
  },
  loader: {
    marginTop: 20,
  },
  unlockButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 48,
    paddingVertical: 16,
    borderRadius: 12,
    ...SHADOWS.medium,
  },
  unlockButtonText: {
    fontSize: SIZES.base,
    fontWeight: '600',
    color: COLORS.white,
  },
});
