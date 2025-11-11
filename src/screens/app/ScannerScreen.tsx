import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  Linking,
} from 'react-native';
import type { CompositeScreenProps } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CameraView, useCameraPermissions } from 'expo-camera';

import { RootStackParamList, MainTabParamList, BatchRecord } from '../../types';
import { COLORS, SIZES, SHADOWS } from '../../constants/theme';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../hooks/useAuth';

type Props = CompositeScreenProps<
  NativeStackScreenProps<RootStackParamList, 'Scanner'>,
  BottomTabScreenProps<MainTabParamList, 'Scan'>
>;

export default function ScannerScreen({ navigation }: Props) {
  const { isGuest, exitGuestMode, session } = useAuth();
  const [permission, requestPermission] = useCameraPermissions();
  const [hasPermission, setHasPermission] = useState<'unknown' | 'granted' | 'denied'>('unknown');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const scannedOnceRef = useRef(false);
  const requestedRef = useRef(false);

  useEffect(() => {
    if (!permission && !requestedRef.current) {
      requestedRef.current = true;
      requestPermission();
    }
  }, [permission, requestPermission]);

  useEffect(() => {
    if (permission) {
      setHasPermission(permission.granted ? 'granted' : 'denied');
    }
  }, [permission]);

  const handleScan = useCallback(
    async (qrData: string) => {
      if (isProcessing || scannedOnceRef.current) return;
      scannedOnceRef.current = true;
      setIsProcessing(true);
      setErrorMessage(null);

      try {
        // Buscar el lote directamente en la base de datos
        const { data: batchData, error } = await supabase
          .from('batch')
          .select(`
            *,
            medicine:medicineId (*),
            alerts:alert!batchId (*)
          `)
          .eq('qrCode', qrData)
          .maybeSingle();

        if (error || !batchData) {
          setErrorMessage('No encontramos ese lote. Verifica el código o vuelve a intentarlo.');
          setIsProcessing(false);
          scannedOnceRef.current = false;
          return;
        }

        // Determinar el resultado del escaneo basado en el estado del lote
        const batch = batchData as BatchRecord;
        batch.scanResult = batch.status === 'SAFE' ? 'SAFE' : 
                           batch.status === 'ALERT' ? 'ALERT' : 'WARNING';

        // Guardar en historial si el usuario está autenticado
        if (session?.user && !isGuest) {
          await supabase
            .from('scan_history')
            .insert({
              userId: session.user.id,
              batchId: batch.id,
              result: batch.scanResult,
              scannedAt: new Date().toISOString(),
            });
        }

        const targetScreen = batch.scanResult === 'SAFE' ? 'ScanResultSafe' : 'ScanResultAlert';
        navigation.replace(targetScreen, { batch });
        setIsProcessing(false);
        scannedOnceRef.current = false;
      } catch (err) {
        console.error('[Scanner] Error escaneando:', err);
        setErrorMessage('Ocurrió un error al validar el QR.');
        setIsProcessing(false);
        scannedOnceRef.current = false;
      }
    },
    [isProcessing, navigation],
  );

  const renderContent = () => {
    if (isGuest) {
      return (
        <View style={styles.centerContent}>
          <Text style={styles.guestTitle}>Inicia sesión para escanear</Text>
          <Text style={styles.guestSubtitle}>
            Necesitamos identificarte para validar los escaneos contra la blockchain.
          </Text>
          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => exitGuestMode()}
          >
            <Text style={styles.loginButtonText}>Ir al inicio de sesión</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (hasPermission === 'unknown') {
      return (
        <View style={styles.centerContent}>
          <ActivityIndicator color={COLORS.primary} />
          <Text style={styles.permissionText}>Solicitando permiso de cámara...</Text>
        </View>
      );
    }

    if (hasPermission === 'denied') {
      return (
        <View style={styles.centerContent}>
          <Text style={styles.permissionTitle}>Permiso de cámara requerido</Text>
          <Text style={styles.permissionText}>
            Habilita el acceso a la cámara para poder escanear códigos QR.
          </Text>
          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => Linking.openSettings()}
          >
            <Text style={styles.loginButtonText}>Abrir configuración</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View style={styles.cameraWrapper}>
        <CameraView
          barcodeScannerSettings={{
            barcodeTypes: ['qr', 'pdf417', 'datamatrix'],
          }}
          onBarcodeScanned={({ data }) => handleScan(data)}
          style={StyleSheet.absoluteFillObject}
        />
        <View style={styles.overlay}>
          <View style={styles.frame} />
        </View>
        <View style={styles.instructionsContainer}>
          <View style={styles.instructionsCard}>
            {isProcessing ? (
              <>
                <ActivityIndicator color={COLORS.primary} />
                <Text style={styles.instructionsTitle}>Validando código...</Text>
              </>
            ) : (
              <>
                <Text style={styles.instructionsTitle}>Alinea el código QR</Text>
                <Text style={styles.instructionsText}>
                  Coloca el código dentro del marco para escanearlo
                </Text>
              </>
            )}
            {errorMessage && (
              <View style={styles.errorBanner}>
                <Text style={styles.errorTitle}>No pudimos validar el QR</Text>
                <Text style={styles.errorText}>{errorMessage}</Text>
                <TouchableOpacity
                  onPress={() => setErrorMessage(null)}
                  style={styles.errorRetry}
                >
                  <Text style={styles.errorRetryText}>Intentar nuevamente</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => navigation.goBack()}
        >
          <View style={styles.backIcon}>
            <View style={styles.backArrow} />
          </View>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Escanear Medicamento</Text>
        <View style={styles.headerButton} />
      </View>
      {renderContent()}
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  headerButton: {
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  backArrow: {
    width: 12,
    height: 12,
    borderLeftWidth: 3,
    borderBottomWidth: 3,
    borderColor: COLORS.gray700,
    transform: [{ rotate: '45deg' }],
  },
  headerTitle: {
    fontSize: SIZES.lg,
    fontWeight: '600',
    color: COLORS.primary,
  },
  cameraWrapper: {
    flex: 1,
    position: 'relative',
    overflow: 'hidden',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginHorizontal: 16,
    backgroundColor: COLORS.black,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  frame: {
    width: '70%',
    aspectRatio: 1,
    borderWidth: 4,
    borderColor: COLORS.primary,
    borderRadius: 24,
  },
  instructionsContainer: {
    position: 'absolute',
    bottom: 32,
    width: '100%',
    alignItems: 'center',
  },
  instructionsCard: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 16,
    borderRadius: 16,
    width: '80%',
    alignItems: 'center',
  },
  instructionsTitle: {
    color: COLORS.white,
    fontSize: SIZES.base,
    fontWeight: '600',
    marginBottom: 4,
  },
  instructionsText: {
    color: COLORS.gray300,
    textAlign: 'center',
    fontSize: SIZES.sm,
  },
  errorBanner: {
    width: '100%',
    marginTop: 12,
    backgroundColor: 'rgba(239,68,68,0.1)',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.error,
  },
  errorTitle: {
    color: COLORS.error,
    fontWeight: '700',
    marginBottom: 4,
    textAlign: 'center',
  },
  centerContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  guestTitle: {
    fontSize: SIZES.xxl,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: 8,
    textAlign: 'center',
  },
  guestSubtitle: {
    fontSize: SIZES.base,
    color: COLORS.gray600,
    textAlign: 'center',
    marginBottom: 16,
  },
  loginButton: {
    marginTop: 12,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  loginButtonText: {
    color: COLORS.white,
    fontWeight: '600',
  },
  permissionTitle: {
    fontSize: SIZES.lg,
    fontWeight: '600',
    color: COLORS.gray900,
    marginBottom: 8,
    textAlign: 'center',
  },
  permissionText: {
    fontSize: SIZES.base,
    color: COLORS.gray600,
    textAlign: 'center',
    marginTop: 8,
  },
  errorText: {
    color: COLORS.error,
    fontSize: SIZES.sm,
    textAlign: 'center',
  },
  errorRetry: {
    marginTop: 8,
    alignSelf: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  errorRetryText: {
    color: COLORS.white,
    fontSize: SIZES.xs,
    fontWeight: '600',
  },
});
