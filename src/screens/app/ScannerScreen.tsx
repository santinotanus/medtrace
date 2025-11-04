import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Animated,
} from 'react-native';

import type { CompositeScreenProps } from '@react-navigation/native';
import type { NativeStackScreenProps, NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';

import { RootStackParamList, MainTabParamList } from '../../types';
import { COLORS, SIZES, SHADOWS } from '../../constants/theme';

type Props = CompositeScreenProps<
  NativeStackScreenProps<RootStackParamList, 'Scanner'>,
  BottomTabScreenProps<MainTabParamList, 'Scan'>
>;

export default function ScannerScreen({ navigation }: Props) {
  const scanLineAnim = React.useRef(new Animated.Value(0)).current;

  const rootNav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  useEffect(() => {
    // Animación de línea de escaneo
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(scanLineAnim, { toValue: 1, duration: 2000, useNativeDriver: true }),
        Animated.timing(scanLineAnim, { toValue: 0, duration: 2000, useNativeDriver: true }),
      ])
    );
    loop.start();

    // Simular escaneo exitoso después de 3 segundos
    const timer = setTimeout(() => {
      const isSafe = Math.random() > 0.3;
      if (isSafe) {
        rootNav.replace('ScanResultSafe');   // << usar rootNav (Stack), no navigation del Tab
      } else {
        rootNav.replace('ScanResultAlert');  // << idem
      }
    }, 3000);

    return () => {
      loop.stop();
      clearTimeout(timer);
    };
  }, [rootNav, scanLineAnim]);

  const translateY = scanLineAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 300],
  });

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
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
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => rootNav.navigate('Help')}
        >
          <View style={styles.infoIcon}>
            <Text style={styles.infoText}>i</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Camera View */}
      <View style={styles.cameraContainer}>
        <View style={styles.cameraPlaceholder}>
          <View style={styles.cameraIconContainer}>
            <View style={styles.cameraIcon} />
            <Text style={styles.cameraText}>Vista de cámara</Text>
            <Text style={styles.scanningText}>Escaneando...</Text>
          </View>
        </View>

        {/* Scan Frame */}
        <View style={styles.scanFrame}>
          <View style={styles.frameContainer}>
            {/* Corners */}
            <View style={[styles.corner, styles.cornerTopLeft]} />
            <View style={[styles.corner, styles.cornerTopRight]} />
            <View style={[styles.corner, styles.cornerBottomLeft]} />
            <View style={[styles.corner, styles.cornerBottomRight]} />

            {/* Scanning line */}
            <Animated.View style={[styles.scanLine, { transform: [{ translateY }] }]} />
          </View>
        </View>

        {/* Instructions */}
        <View style={styles.instructionsContainer}>
          <View style={styles.instructionsCard}>
            <Text style={styles.instructionsTitle}>Alinea el código QR</Text>
            <Text style={styles.instructionsText}>
              Coloca el código dentro del marco para escanearlo
            </Text>
          </View>
        </View>
      </View>
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
  infoIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: COLORS.gray700,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: 'bold',
  },
  headerTitle: {
    fontSize: SIZES.lg,
    fontWeight: '600',
    color: COLORS.primary,
  },
  cameraContainer: {
    flex: 1,
    backgroundColor: COLORS.gray800,
    position: 'relative',
  },
  cameraPlaceholder: {
    flex: 1,
    backgroundColor: COLORS.gray700,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraIconContainer: {
    alignItems: 'center',
  },
  cameraIcon: {
    width: 64,
    height: 64,
    backgroundColor: COLORS.gray400,
    borderRadius: 12,
    marginBottom: 16,
  },
  cameraText: {
    fontSize: SIZES.base,
    color: COLORS.gray400,
    marginBottom: 8,
  },
  scanningText: {
    fontSize: SIZES.sm,
    color: COLORS.primary,
    fontWeight: '600',
  },
  scanFrame: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 48,
  },
  frameContainer: {
    width: '100%',
    aspectRatio: 1,
    maxWidth: 300,
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 48,
    height: 48,
    borderColor: COLORS.primary,
    borderWidth: 4,
  },
  cornerTopLeft: {
    top: 0,
    left: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    borderTopLeftRadius: 16,
  },
  cornerTopRight: {
    top: 0,
    right: 0,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
    borderTopRightRadius: 16,
  },
  cornerBottomLeft: {
    bottom: 0,
    left: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
    borderBottomLeftRadius: 16,
  },
  cornerBottomRight: {
    bottom: 0,
    right: 0,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderBottomRightRadius: 16,
  },
  scanLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: COLORS.primary,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 5,
  },
  instructionsContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 24,
  },
  instructionsCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    ...SHADOWS.large,
  },
  instructionsTitle: {
    fontSize: SIZES.base,
    fontWeight: '600',
    color: COLORS.gray900,
    marginBottom: 4,
  },
  instructionsText: {
    fontSize: SIZES.sm,
    color: COLORS.gray600,
    textAlign: 'center',
  },
});