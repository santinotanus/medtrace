import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
  ViewToken,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types';
import { COLORS, SIZES } from '../../constants/theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Onboarding'>;

const { width } = Dimensions.get('window');

interface OnboardingSlide {
  id: string;
  title: string;
  description: string;
  iconBg: string;
  iconType: 'qr' | 'alert' | 'shield';
}

const slides: OnboardingSlide[] = [
  {
    id: '1',
    title: 'Escanea y Verifica',
    description:
      'Escanea el código QR de cualquier medicamento para verificar su autenticidad y seguridad en tiempo real',
    iconBg: 'rgba(139, 92, 246, 0.1)',
    iconType: 'qr',
  },
  {
    id: '2',
    title: 'Alertas en Tiempo Real',
    description:
      'Recibe notificaciones instantáneas sobre medicamentos contaminados o retirados del mercado',
    iconBg: '#FEE2E2',
    iconType: 'alert',
  },
  {
    id: '3',
    title: 'Reporta Problemas',
    description:
      'Ayuda a proteger a otros reportando efectos adversos o problemas de calidad en medicamentos',
    iconBg: '#D1FAE5',
    iconType: 'shield',
  },
];

export default function OnboardingScreen({ navigation }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0) {
        setCurrentIndex(viewableItems[0].index || 0);
      }
    }
  ).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
    } else {
      navigation.replace('Login');
    }
  };

  const handleSkip = () => {
    navigation.replace('Login');
  };

  const renderIcon = (type: 'qr' | 'alert' | 'shield', bg: string) => {
    if (type === 'qr') {
      return (
        <View style={[styles.iconContainer, { backgroundColor: bg }]}>
          <View style={styles.qrIcon}>
            <View style={styles.qrSquare1} />
            <View style={styles.qrSquare2} />
            <View style={styles.qrSquare3} />
            <View style={styles.qrSquare4} />
            <View style={styles.qrCenter} />
          </View>
        </View>
      );
    }

    if (type === 'alert') {
      return (
        <View style={[styles.iconContainer, { backgroundColor: bg }]}>
          <View style={styles.alertIconWrapper}>
            <View style={styles.alertTriangle} />
            <View style={styles.alertExclamation} />
            <View style={styles.alertDot} />
          </View>
        </View>
      );
    }

    return (
      <View style={[styles.iconContainer, { backgroundColor: bg }]}>
        <View style={styles.shieldIcon}>
          <View style={styles.shieldBody} />
          <View style={styles.shieldCheck} />
        </View>
      </View>
    );
  };

  const renderSlide = ({ item }: { item: OnboardingSlide }) => (
    <View style={styles.slide}>
      <View style={styles.content}>
        {renderIcon(item.iconType, item.iconBg)}
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.description}>{item.description}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Progress Bars */}
      <View style={styles.progressContainer}>
        {slides.map((_, index) => (
          <View
            key={index}
            style={[
              styles.progressBar,
              index === currentIndex && styles.progressBarActive,
            ]}
          />
        ))}
      </View>

      {/* Slides */}
      <FlatList
        ref={flatListRef}
        data={slides}
        renderItem={renderSlide}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        keyExtractor={(item) => item.id}
      />

      {/* Buttons */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <Text style={styles.nextButtonText}>
            {currentIndex === slides.length - 1 ? 'Comenzar' : 'Siguiente'}
          </Text>
        </TouchableOpacity>

        {currentIndex < slides.length - 1 && (
          <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
            <Text style={styles.skipButtonText}>Omitir</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  progressContainer: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 24,
    paddingTop: 48,
    marginBottom: 48,
  },
  progressBar: {
    flex: 1,
    height: 4,
    backgroundColor: COLORS.gray300,
    borderRadius: 2,
  },
  progressBarActive: {
    backgroundColor: COLORS.primary,
  },
  slide: {
    width,
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  iconContainer: {
    width: 128,
    height: 128,
    borderRadius: 64,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
  },
  // QR Icon
  qrIcon: {
    width: 64,
    height: 64,
    position: 'relative',
  },
  qrSquare1: {
    position: 'absolute',
    width: 20,
    height: 20,
    backgroundColor: COLORS.primary,
    borderRadius: 3,
    top: 0,
    left: 0,
  },
  qrSquare2: {
    position: 'absolute',
    width: 20,
    height: 20,
    backgroundColor: COLORS.primary,
    borderRadius: 3,
    top: 0,
    right: 0,
  },
  qrSquare3: {
    position: 'absolute',
    width: 20,
    height: 20,
    backgroundColor: COLORS.primary,
    borderRadius: 3,
    bottom: 0,
    left: 0,
  },
  qrSquare4: {
    position: 'absolute',
    width: 12,
    height: 12,
    backgroundColor: COLORS.primary,
    borderRadius: 2,
    bottom: 0,
    right: 0,
  },
  qrCenter: {
    position: 'absolute',
    width: 16,
    height: 16,
    backgroundColor: COLORS.primary,
    borderRadius: 2,
    top: 24,
    left: 24,
  },
  // Alert Icon
  alertIconWrapper: {
    width: 64,
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  alertTriangle: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 28,
    borderRightWidth: 28,
    borderBottomWidth: 50,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: COLORS.error,
  },
  alertExclamation: {
    position: 'absolute',
    width: 4,
    height: 20,
    backgroundColor: COLORS.white,
    borderRadius: 2,
    top: 15,
  },
  alertDot: {
    position: 'absolute',
    width: 5,
    height: 5,
    backgroundColor: COLORS.white,
    borderRadius: 2.5,
    bottom: 8,
  },
  // Shield Icon
  shieldIcon: {
    width: 64,
    height: 64,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shieldBody: {
    width: 50,
    height: 56,
    backgroundColor: COLORS.success,
    borderRadius: 25,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  shieldCheck: {
    position: 'absolute',
    width: 28,
    height: 16,
    borderLeftWidth: 4,
    borderBottomWidth: 4,
    borderColor: COLORS.white,
    transform: [{ rotate: '-45deg' }],
    left: 18,
    top: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 16,
    textAlign: 'center',
  },
  description: {
    fontSize: SIZES.lg,
    color: COLORS.gray600,
    textAlign: 'center',
    lineHeight: 28,
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  nextButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  nextButtonText: {
    color: COLORS.white,
    fontSize: SIZES.lg,
    fontWeight: '600',
  },
  skipButton: {
    backgroundColor: 'transparent',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 12,
  },
  skipButtonText: {
    color: COLORS.gray500,
    fontSize: SIZES.lg,
    fontWeight: '600',
  },
});