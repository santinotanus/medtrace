import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types';
import { COLORS, SIZES, SHADOWS } from '../../constants/theme';

type Props = NativeStackScreenProps<RootStackParamList, 'About'>;

export default function AboutScreen({ navigation }: Props) {
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <View style={styles.backIcon} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Acerca de</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Logo */}
        <View style={styles.logoContainer}>
          <View style={styles.logo}>
            <View style={styles.logoInner} />
          </View>
          <Text style={styles.appName}>Med Trace</Text>
          <Text style={styles.appTagline}>
            Trazabilidad y seguridad de medicamentos
          </Text>
          <Text style={styles.version}>Versión 1.0.0</Text>
        </View>

        {/* Mission */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Nuestra Misión</Text>
          <View style={styles.card}>
            <Text style={styles.cardText}>
              MedTrace nació con la misión de garantizar la seguridad de los
              medicamentos mediante tecnología blockchain y verificación en tiempo
              real. Trabajamos para proteger la salud pública y combatir la
              falsificación de medicamentos.
            </Text>
          </View>
        </View>

        {/* Features */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Características Principales</Text>
          <View style={styles.featuresList}>
            <View style={styles.featureItem}>
              <View style={[styles.featureIcon, { backgroundColor: COLORS.primaryLight }]}>
                <View style={styles.featureIconInner} />
              </View>
              <View style={styles.featureContent}>
                <Text style={styles.featureTitle}>Verificación Blockchain</Text>
                <Text style={styles.featureDescription}>
                  Cada medicamento verificado en cadena de bloques
                </Text>
              </View>
            </View>

            <View style={styles.featureItem}>
              <View style={[styles.featureIcon, { backgroundColor: COLORS.errorLight }]}>
                <View style={styles.featureIconInner} />
              </View>
              <View style={styles.featureContent}>
                <Text style={styles.featureTitle}>Alertas en Tiempo Real</Text>
                <Text style={styles.featureDescription}>
                  Notificaciones instantáneas sobre retiros del mercado
                </Text>
              </View>
            </View>

            <View style={styles.featureItem}>
              <View style={[styles.featureIcon, { backgroundColor: COLORS.successLight }]}>
                <View style={styles.featureIconInner} />
              </View>
              <View style={styles.featureContent}>
                <Text style={styles.featureTitle}>Trazabilidad Completa</Text>
                <Text style={styles.featureDescription}>
                  Desde fabricación hasta punto de venta
                </Text>
              </View>
            </View>

            <View style={styles.featureItem}>
              <View style={[styles.featureIcon, { backgroundColor: COLORS.infoLight }]}>
                <View style={styles.featureIconInner} />
              </View>
              <View style={styles.featureContent}>
                <Text style={styles.featureTitle}>Reportes Ciudadanos</Text>
                <Text style={styles.featureDescription}>
                  Colabora reportando problemas de calidad
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Stats */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Impacto</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>150K+</Text>
              <Text style={styles.statLabel}>Usuarios Activos</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>2.5M</Text>
              <Text style={styles.statLabel}>Verificaciones</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>1,200+</Text>
              <Text style={styles.statLabel}>Reportes</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>45</Text>
              <Text style={styles.statLabel}>Alertas Emitidas</Text>
            </View>
          </View>
        </View>

        {/* Partners */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Socios y Alianzas</Text>
          <View style={styles.partnersCard}>
            <Text style={styles.partnersText}>
              Trabajamos en colaboración con:
            </Text>
            <View style={styles.partnerItem}>
              <View style={styles.partnerIcon} />
              <Text style={styles.partnerName}>ANMAT - Argentina</Text>
            </View>
            <View style={styles.partnerItem}>
              <View style={styles.partnerIcon} />
              <Text style={styles.partnerName}>Ministerio de Salud</Text>
            </View>
            <View style={styles.partnerItem}>
              <View style={styles.partnerIcon} />
              <Text style={styles.partnerName}>Colegios Farmacéuticos</Text>
            </View>
            <View style={styles.partnerItem}>
              <View style={styles.partnerIcon} />
              <Text style={styles.partnerName}>Laboratorios Adheridos</Text>
            </View>
          </View>
        </View>

        {/* Technology */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tecnología</Text>
          <View style={styles.card}>
            <Text style={styles.cardText}>
              <Text style={styles.bold}>Blockchain:</Text> Ethereum para registro
              inmutable de medicamentos{'\n\n'}
              <Text style={styles.bold}>Seguridad:</Text> Encriptación end-to-end
              y certificación ISO 27001{'\n\n'}
              <Text style={styles.bold}>Cloud:</Text> Infraestructura en AWS con
              alta disponibilidad
            </Text>
          </View>
        </View>

        {/* Team */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Equipo</Text>
          <View style={styles.card}>
            <Text style={styles.cardText}>
              Somos un equipo multidisciplinario de desarrolladores, farmacéuticos,
              y expertos en salud pública dedicados a mejorar la seguridad de los
              medicamentos en Argentina y Latinoamérica.
            </Text>
          </View>
        </View>

        {/* Legal */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Legal</Text>
          <TouchableOpacity style={styles.legalItem}>
            <Text style={styles.legalText}>Términos y Condiciones</Text>
            <View style={styles.chevron} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.legalItem}>
            <Text style={styles.legalText}>Política de Privacidad</Text>
            <View style={styles.chevron} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.legalItem}>
            <Text style={styles.legalText}>Licencias de Software</Text>
            <View style={styles.chevron} />
          </TouchableOpacity>
        </View>

        {/* Social */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Síguenos</Text>
          <View style={styles.socialContainer}>
            <TouchableOpacity style={styles.socialButton}>
              <View style={styles.socialIcon} />
              <Text style={styles.socialText}>Facebook</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialButton}>
              <View style={styles.socialIcon} />
              <Text style={styles.socialText}>Twitter</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialButton}>
              <View style={styles.socialIcon} />
              <Text style={styles.socialText}>Instagram</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialButton}>
              <View style={styles.socialIcon} />
              <Text style={styles.socialText}>LinkedIn</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Hecho con ❤️ en Buenos Aires, Argentina
          </Text>
          <Text style={styles.copyright}>© 2024 MedTrace. Todos los derechos reservados.</Text>
        </View>
      </ScrollView>
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  backButton: {
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
    backgroundColor: COLORS.gray700,
    borderRadius: 4,
  },
  headerTitle: {
    fontSize: SIZES.xl,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  placeholder: {
    width: 40,
  },
  logoContainer: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  logo: {
    width: 96,
    height: 96,
    borderRadius: 24,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    ...SHADOWS.large,
  },
  logoInner: {
    width: 48,
    height: 48,
    backgroundColor: COLORS.white,
    borderRadius: 12,
  },
  appName: {
    fontSize: SIZES.xxxl,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 8,
  },
  appTagline: {
    fontSize: SIZES.base,
    color: COLORS.gray600,
    textAlign: 'center',
    marginBottom: 8,
  },
  version: {
    fontSize: SIZES.sm,
    color: COLORS.gray500,
  },
  section: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: SIZES.lg,
    fontWeight: '600',
    color: COLORS.gray900,
    marginBottom: 12,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    ...SHADOWS.small,
  },
  cardText: {
    fontSize: SIZES.base,
    color: COLORS.gray700,
    lineHeight: 24,
  },
  bold: {
    fontWeight: '600',
    color: COLORS.gray900,
  },
  featuresList: {
    gap: 12,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    ...SHADOWS.small,
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  featureIconInner: {
    width: 24,
    height: 24,
    backgroundColor: COLORS.gray600,
    borderRadius: 12,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: SIZES.base,
    fontWeight: '600',
    color: COLORS.gray900,
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: SIZES.sm,
    color: COLORS.gray500,
    lineHeight: 18,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    ...SHADOWS.small,
  },
  statNumber: {
    fontSize: SIZES.xxxl,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: SIZES.sm,
    color: COLORS.gray500,
    textAlign: 'center',
  },
  partnersCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    ...SHADOWS.small,
  },
  partnersText: {
    fontSize: SIZES.base,
    color: COLORS.gray700,
    marginBottom: 12,
  },
  partnerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray100,
  },
  partnerIcon: {
    width: 32,
    height: 32,
    backgroundColor: COLORS.primaryLight,
    borderRadius: 16,
    marginRight: 12,
  },
  partnerName: {
    fontSize: SIZES.base,
    color: COLORS.gray700,
  },
  legalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    ...SHADOWS.small,
  },
  legalText: {
    fontSize: SIZES.base,
    color: COLORS.gray700,
  },
  chevron: {
    width: 20,
    height: 20,
    backgroundColor: COLORS.gray300,
    borderRadius: 4,
  },
  socialContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  socialButton: {
    flex: 1,
    minWidth: '45%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    ...SHADOWS.small,
  },
  socialIcon: {
    width: 24,
    height: 24,
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    marginRight: 8,
  },
  socialText: {
    fontSize: SIZES.base,
    fontWeight: '500',
    color: COLORS.gray700,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  footerText: {
    fontSize: SIZES.base,
    color: COLORS.gray600,
    marginBottom: 8,
  },
  copyright: {
    fontSize: SIZES.sm,
    color: COLORS.gray500,
  },
});