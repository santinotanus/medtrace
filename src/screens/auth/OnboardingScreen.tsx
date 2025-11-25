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
import { QRIcon, AlertTriangleIcon, ShieldIcon } from '../../components/Icons';

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
          <QRIcon size={64} color={COLORS.primary} strokeWidth={2} />
        </View>
      );
    }

    if (type === 'alert') {
      return (
        <View style={[styles.iconContainer, { backgroundColor: bg }]}>
          <AlertTriangleIcon size={64} color={COLORS.error} strokeWidth={2} />
        </View>
      );
    }

    return (
      <View style={[styles.iconContainer, { backgroundColor: bg }]}>
        <ShieldIcon size={64} color={COLORS.success} strokeWidth={2} />
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