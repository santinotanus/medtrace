import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
  ViewToken,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types';
import Button from '../../components/Button';
import { COLORS, SIZES, SHADOWS } from '../../constants/theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Onboarding'>;

const { width } = Dimensions.get('window');

interface OnboardingSlide {
  id: string;
  icon: string;
  title: string;
  description: string;
  iconBg: string;
  iconColor: string;
}

const slides: OnboardingSlide[] = [
  {
    id: '1',
    icon: 'qr',
    title: 'Escanea y Verifica',
    description: 'Escanea el código QR de cualquier medicamento para verificar su autenticidad y seguridad en tiempo real',
    iconBg: COLORS.primaryLight,
    iconColor: COLORS.primary,
  },
  {
    id: '2',
    icon: 'alert',
    title: 'Alertas en Tiempo Real',
    description: 'Recibe notificaciones instantáneas sobre medicamentos contaminados o retirados del mercado',
    iconBg: COLORS.errorLight,
    iconColor: COLORS.error,
  },
  {
    id: '3',
    icon: 'shield',
    title: 'Reporta Problemas',
    description: 'Ayuda a proteger a otros reportando efectos adversos o problemas de calidad en medicamentos',
    iconBg: COLORS.successLight,
    iconColor: COLORS.success,
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

  const renderSlide = ({ item }: { item: OnboardingSlide }) => (
    <View style={styles.slide}>
      <View style={styles.content}>
        <View style={[styles.iconContainer, { backgroundColor: item.iconBg }]}>
          {renderIcon(item.icon, item.iconColor)}
        </View>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.description}>{item.description}</Text>
      </View>
    </View>
  );

  const renderIcon = (icon: string, color: string) => {
    // Simplified icon representations
    return <View style={[styles.icon, { backgroundColor: color }]} />;
  };

  return (
    <View style={styles.container}>
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

      <View style={styles.footer}>
        <Button
          title={currentIndex === slides.length - 1 ? 'Comenzar' : 'Siguiente'}
          onPress={handleNext}
        />
        {currentIndex < slides.length - 1 && (
          <Button
            title="Omitir"
            onPress={handleSkip}
            variant="secondary"
            style={styles.skipButton}
          />
        )}
      </View>
    </View>
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
    paddingTop: 60,
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
  icon: {
    width: 64,
    height: 64,
    borderRadius: 8,
  },
  title: {
    fontSize: SIZES.xxxl,
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
  skipButton: {
    marginTop: 12,
    backgroundColor: 'transparent',
    ...SHADOWS.small,
  },
});