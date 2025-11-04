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

type Props = NativeStackScreenProps<RootStackParamList, 'Privacy'>;

export default function PrivacyScreen({ navigation }: Props) {
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
        <Text style={styles.headerTitle}>Privacidad</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Introduction */}
          <View style={styles.section}>
            <Text style={styles.title}>Política de Privacidad</Text>
            <Text style={styles.date}>Última actualización: 1 de marzo, 2024</Text>
            <Text style={styles.paragraph}>
              En MedTrace, nos comprometemos a proteger tu privacidad y la seguridad
              de tus datos personales. Esta política describe cómo recopilamos,
              usamos y protegemos tu información.
            </Text>
          </View>

          {/* Information We Collect */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Información que Recopilamos</Text>

            <Text style={styles.subsectionTitle}>Información Personal</Text>
            <Text style={styles.paragraph}>
              • Nombre y apellido{'\n'}
              • Correo electrónico{'\n'}
              • Número de teléfono (opcional){'\n'}
              • Foto de perfil (opcional)
            </Text>

            <Text style={styles.subsectionTitle}>Información de Uso</Text>
            <Text style={styles.paragraph}>
              • Medicamentos escaneados{'\n'}
              • Historial de verificaciones{'\n'}
              • Reportes de problemas{'\n'}
              • Preferencias de notificaciones
            </Text>

            <Text style={styles.subsectionTitle}>Información Técnica</Text>
            <Text style={styles.paragraph}>
              • Dirección IP{'\n'}
              • Tipo de dispositivo y sistema operativo{'\n'}
              • Identificador único del dispositivo{'\n'}
              • Datos de ubicación (con tu permiso)
            </Text>
          </View>

          {/* How We Use Your Information */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Cómo Usamos tu Información</Text>
            <Text style={styles.paragraph}>
              Utilizamos la información recopilada para:
            </Text>
            <View style={styles.bulletList}>
              <View style={styles.bullet} />
              <Text style={styles.bulletText}>
                Verificar la autenticidad de medicamentos
              </Text>
            </View>
            <View style={styles.bulletList}>
              <View style={styles.bullet} />
              <Text style={styles.bulletText}>
                Enviarte alertas sanitarias importantes
              </Text>
            </View>
            <View style={styles.bulletList}>
              <View style={styles.bullet} />
              <Text style={styles.bulletText}>
                Mejorar nuestros servicios y funcionalidades
              </Text>
            </View>
            <View style={styles.bulletList}>
              <View style={styles.bullet} />
              <Text style={styles.bulletText}>
                Cumplir con obligaciones legales y regulatorias
              </Text>
            </View>
            <View style={styles.bulletList}>
              <View style={styles.bullet} />
              <Text style={styles.bulletText}>
                Procesar tus reportes y comunicarnos contigo
              </Text>
            </View>
          </View>

          {/* Data Sharing */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Compartir Información</Text>
            <Text style={styles.paragraph}>
              Podemos compartir tu información con:
            </Text>
            <Text style={styles.paragraph}>
              <Text style={styles.bold}>ANMAT:</Text> Compartimos reportes de
              efectos adversos y problemas de calidad de manera anónima para
              garantizar la seguridad pública.
            </Text>
            <Text style={styles.paragraph}>
              <Text style={styles.bold}>Proveedores de Servicios:</Text> Empresas
              que nos ayudan a operar la aplicación (hosting, análisis, soporte).
            </Text>
            <Text style={styles.paragraph}>
              <Text style={styles.bold}>Autoridades:</Text> Cuando sea requerido
              por ley o para proteger derechos y seguridad.
            </Text>
          </View>

          {/* Data Security */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Seguridad de los Datos</Text>
            <Text style={styles.paragraph}>
              Implementamos medidas de seguridad técnicas y organizativas para
              proteger tus datos:
            </Text>
            <View style={styles.securityList}>
              <View style={styles.securityItem}>
                <View style={styles.securityIcon} />
                <Text style={styles.securityText}>Encriptación end-to-end</Text>
              </View>
              <View style={styles.securityItem}>
                <View style={styles.securityIcon} />
                <Text style={styles.securityText}>Servidores seguros certificados</Text>
              </View>
              <View style={styles.securityItem}>
                <View style={styles.securityIcon} />
                <Text style={styles.securityText}>Autenticación de dos factores</Text>
              </View>
              <View style={styles.securityItem}>
                <View style={styles.securityIcon} />
                <Text style={styles.securityText}>Auditorías de seguridad regulares</Text>
              </View>
            </View>
          </View>

          {/* Your Rights */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Tus Derechos</Text>
            <Text style={styles.paragraph}>
              Tienes derecho a:
            </Text>
            <View style={styles.rightsList}>
              <View style={styles.rightsItem}>
                <View style={styles.numberBadge}>
                  <Text style={styles.numberText}>1</Text>
                </View>
                <Text style={styles.rightsText}>
                  Acceder a tus datos personales
                </Text>
              </View>
              <View style={styles.rightsItem}>
                <View style={styles.numberBadge}>
                  <Text style={styles.numberText}>2</Text>
                </View>
                <Text style={styles.rightsText}>
                  Rectificar datos incorrectos
                </Text>
              </View>
              <View style={styles.rightsItem}>
                <View style={styles.numberBadge}>
                  <Text style={styles.numberText}>3</Text>
                </View>
                <Text style={styles.rightsText}>
                  Solicitar la eliminación de tus datos
                </Text>
              </View>
              <View style={styles.rightsItem}>
                <View style={styles.numberBadge}>
                  <Text style={styles.numberText}>4</Text>
                </View>
                <Text style={styles.rightsText}>
                  Exportar tus datos
                </Text>
              </View>
              <View style={styles.rightsItem}>
                <View style={styles.numberBadge}>
                  <Text style={styles.numberText}>5</Text>
                </View>
                <Text style={styles.rightsText}>
                  Retirar consentimientos otorgados
                </Text>
              </View>
            </View>
          </View>

          {/* Contact */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Contacto</Text>
            <Text style={styles.paragraph}>
              Si tienes preguntas sobre nuestra política de privacidad o deseas
              ejercer tus derechos, contáctanos en:
            </Text>
            <View style={styles.contactCard}>
              <Text style={styles.contactItem}>📧 privacidad@medtrace.com</Text>
              <Text style={styles.contactItem}>📞 +54 11 1234-5678</Text>
              <Text style={styles.contactItem}>🏢 Buenos Aires, Argentina</Text>
            </View>
          </View>

          {/* Updates */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Cambios a esta Política</Text>
            <Text style={styles.paragraph}>
              Podemos actualizar esta política ocasionalmente. Te notificaremos
              sobre cambios importantes a través de la aplicación o por correo
              electrónico.
            </Text>
          </View>
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
  content: {
    padding: 24,
  },
  section: {
    marginBottom: 32,
  },
  title: {
    fontSize: SIZES.xxxl,
    fontWeight: 'bold',
    color: COLORS.gray900,
    marginBottom: 8,
  },
  date: {
    fontSize: SIZES.sm,
    color: COLORS.gray500,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: SIZES.xl,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 16,
  },
  subsectionTitle: {
    fontSize: SIZES.base,
    fontWeight: '600',
    color: COLORS.gray900,
    marginTop: 12,
    marginBottom: 8,
  },
  paragraph: {
    fontSize: SIZES.base,
    color: COLORS.gray700,
    lineHeight: 24,
    marginBottom: 12,
  },
  bold: {
    fontWeight: '600',
    color: COLORS.gray900,
  },
  bulletList: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.primary,
    marginTop: 9,
    marginRight: 12,
  },
  bulletText: {
    flex: 1,
    fontSize: SIZES.base,
    color: COLORS.gray700,
    lineHeight: 24,
  },
  securityList: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    marginTop: 12,
    ...SHADOWS.small,
  },
  securityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray100,
  },
  securityIcon: {
    width: 24,
    height: 24,
    backgroundColor: COLORS.successLight,
    borderRadius: 12,
    marginRight: 12,
  },
  securityText: {
    fontSize: SIZES.base,
    color: COLORS.gray700,
  },
  rightsList: {
    marginTop: 12,
  },
  rightsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  numberBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  numberText: {
    fontSize: SIZES.sm,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  rightsText: {
    flex: 1,
    fontSize: SIZES.base,
    color: COLORS.gray700,
  },
  contactCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 20,
    marginTop: 12,
    ...SHADOWS.small,
  },
  contactItem: {
    fontSize: SIZES.base,
    color: COLORS.gray700,
    marginBottom: 12,
    lineHeight: 24,
  },
});