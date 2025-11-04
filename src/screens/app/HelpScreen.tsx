import React, { useState } from 'react';
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

type Props = NativeStackScreenProps<RootStackParamList, 'Help'>;

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    id: '1',
    question: '¿Cómo escaneo un medicamento?',
    answer:
      'Toca el botón de escanear en el menú inferior. Apunta la cámara al código QR del medicamento y espera a que se detecte automáticamente. El resultado aparecerá en segundos.',
  },
  {
    id: '2',
    question: '¿Qué hago si recibo una alerta crítica?',
    answer:
      'Si un medicamento tiene una alerta crítica, NO lo consumas. Devuélvelo a la farmacia inmediatamente y consulta con tu médico si ya lo has usado. Puedes reportar cualquier efecto adverso desde la app.',
  },
  {
    id: '3',
    question: '¿Cómo reporto un problema?',
    answer:
      'Ve a la pantalla del medicamento que quieres reportar y toca "Reportar". Selecciona el tipo de problema, describe lo sucedido y envía. Tu reporte será revisado por ANMAT.',
  },
  {
    id: '4',
    question: '¿Mis reportes son anónimos?',
    answer:
      'Puedes elegir si tu reporte es anónimo o no. Los reportes anónimos no incluyen tu información personal, pero aún puedes hacer seguimiento del estado.',
  },
  {
    id: '5',
    question: '¿Cómo funciona la verificación en blockchain?',
    answer:
      'Cada medicamento tiene un código único registrado en blockchain. Al escanear, verificamos que el código existe, es válido y no ha sido reportado como falsificado.',
  },
  {
    id: '6',
    question: '¿Qué medicamentos puedo verificar?',
    answer:
      'Actualmente puedes verificar medicamentos registrados en Argentina que tengan código QR. Estamos trabajando para expandir a más países y formatos.',
  },
  {
    id: '7',
    question: '¿Cómo desactivo las notificaciones?',
    answer:
      'Ve a Perfil > Configuración > Notificaciones. Puedes personalizar qué alertas recibir y cómo. Las alertas críticas siempre se mostrarán por seguridad.',
  },
  {
    id: '8',
    question: '¿Mis datos están seguros?',
    answer:
      'Sí, utilizamos encriptación end-to-end y seguimos las mejores prácticas de seguridad. Lee nuestra Política de Privacidad para más detalles.',
  },
];

export default function HelpScreen({ navigation }: Props) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

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
        <Text style={styles.headerTitle}>Ayuda y Soporte</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.actionCard}>
            <View style={[styles.actionIcon, { backgroundColor: COLORS.primaryLight }]}>
              <View style={styles.actionIconInner} />
            </View>
            <Text style={styles.actionTitle}>Chat en Vivo</Text>
            <Text style={styles.actionSubtitle}>Respuesta inmediata</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionCard}>
            <View style={[styles.actionIcon, { backgroundColor: COLORS.successLight }]}>
              <View style={styles.actionIconInner} />
            </View>
            <Text style={styles.actionTitle}>Email</Text>
            <Text style={styles.actionSubtitle}>En 24 horas</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionCard}>
            <View style={[styles.actionIcon, { backgroundColor: COLORS.infoLight }]}>
              <View style={styles.actionIconInner} />
            </View>
            <Text style={styles.actionTitle}>Teléfono</Text>
            <Text style={styles.actionSubtitle}>Lun-Vie 9-18hs</Text>
          </TouchableOpacity>
        </View>

        {/* FAQs */}
        <View style={styles.faqSection}>
          <Text style={styles.sectionTitle}>Preguntas Frecuentes</Text>

          {faqs.map((faq) => (
            <View key={faq.id} style={styles.faqItem}>
              <TouchableOpacity
                style={styles.faqHeader}
                onPress={() => toggleExpand(faq.id)}
              >
                <Text style={styles.faqQuestion}>{faq.question}</Text>
                <View
                  style={[
                    styles.chevron,
                    expandedId === faq.id && styles.chevronExpanded,
                  ]}
                />
              </TouchableOpacity>
              {expandedId === faq.id && (
                <View style={styles.faqAnswer}>
                  <Text style={styles.faqAnswerText}>{faq.answer}</Text>
                </View>
              )}
            </View>
          ))}
        </View>

        {/* Helpful Resources */}
        <View style={styles.resourcesSection}>
          <Text style={styles.sectionTitle}>Recursos Útiles</Text>

          <TouchableOpacity style={styles.resourceCard}>
            <View style={styles.resourceIcon}>
              <View style={styles.resourceIconInner} />
            </View>
            <View style={styles.resourceContent}>
              <Text style={styles.resourceTitle}>Guía de Inicio Rápido</Text>
              <Text style={styles.resourceSubtitle}>
                Aprende a usar la app en 5 minutos
              </Text>
            </View>
            <View style={styles.chevron} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.resourceCard}>
            <View style={styles.resourceIcon}>
              <View style={styles.resourceIconInner} />
            </View>
            <View style={styles.resourceContent}>
              <Text style={styles.resourceTitle}>Video Tutoriales</Text>
              <Text style={styles.resourceSubtitle}>
                Paso a paso en video
              </Text>
            </View>
            <View style={styles.chevron} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.resourceCard}>
            <View style={styles.resourceIcon}>
              <View style={styles.resourceIconInner} />
            </View>
            <View style={styles.resourceContent}>
              <Text style={styles.resourceTitle}>Blog de Seguridad</Text>
              <Text style={styles.resourceSubtitle}>
                Consejos y novedades
              </Text>
            </View>
            <View style={styles.chevron} />
          </TouchableOpacity>
        </View>

        {/* Contact Info */}
        <View style={styles.contactSection}>
          <Text style={styles.sectionTitle}>¿Todavía necesitas ayuda?</Text>
          <View style={styles.contactCard}>
            <Text style={styles.contactText}>
              Nuestro equipo está disponible para ayudarte
            </Text>
            <View style={styles.contactDetails}>
              <Text style={styles.contactItem}>📧 soporte@medtrace.com</Text>
              <Text style={styles.contactItem}>📞 0800-333-MEDTRACE</Text>
              <Text style={styles.contactItem}>
                ⏰ Lunes a Viernes: 9:00 - 18:00 hs
              </Text>
            </View>
          </View>
        </View>

        {/* Feedback */}
        <View style={styles.feedbackSection}>
          <TouchableOpacity style={styles.feedbackCard}>
            <Text style={styles.feedbackTitle}>¿Te fue útil esta información?</Text>
            <View style={styles.feedbackButtons}>
              <TouchableOpacity style={styles.feedbackButton}>
                <Text style={styles.feedbackButtonText}>👍 Sí</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.feedbackButton}>
                <Text style={styles.feedbackButtonText}>👎 No</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
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
  quickActions: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingVertical: 16,
    gap: 12,
  },
  actionCard: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    ...SHADOWS.small,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  actionIconInner: {
    width: 24,
    height: 24,
    backgroundColor: COLORS.gray600,
    borderRadius: 12,
  },
  actionTitle: {
    fontSize: SIZES.sm,
    fontWeight: '600',
    color: COLORS.gray900,
    marginBottom: 4,
  },
  actionSubtitle: {
    fontSize: SIZES.xs,
    color: COLORS.gray500,
    textAlign: 'center',
  },
  faqSection: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: SIZES.lg,
    fontWeight: '600',
    color: COLORS.gray900,
    marginBottom: 16,
  },
  faqItem: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    marginBottom: 8,
    overflow: 'hidden',
    ...SHADOWS.small,
  },
  faqHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  faqQuestion: {
    flex: 1,
    fontSize: SIZES.base,
    fontWeight: '600',
    color: COLORS.gray900,
    marginRight: 12,
  },
  chevron: {
    width: 20,
    height: 20,
    backgroundColor: COLORS.gray300,
    borderRadius: 4,
  },
  chevronExpanded: {
    backgroundColor: COLORS.primary,
  },
  faqAnswer: {
    padding: 16,
    paddingTop: 0,
    borderTopWidth: 1,
    borderTopColor: COLORS.gray100,
  },
  faqAnswerText: {
    fontSize: SIZES.base,
    color: COLORS.gray700,
    lineHeight: 22,
  },
  resourcesSection: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  resourceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    ...SHADOWS.small,
  },
  resourceIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  resourceIconInner: {
    width: 24,
    height: 24,
    backgroundColor: COLORS.primary,
    borderRadius: 12,
  },
  resourceContent: {
    flex: 1,
  },
  resourceTitle: {
    fontSize: SIZES.base,
    fontWeight: '600',
    color: COLORS.gray900,
    marginBottom: 4,
  },
  resourceSubtitle: {
    fontSize: SIZES.sm,
    color: COLORS.gray500,
  },
  contactSection: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  contactCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 20,
    ...SHADOWS.small,
  },
  contactText: {
    fontSize: SIZES.base,
    color: COLORS.gray700,
    marginBottom: 16,
    textAlign: 'center',
  },
  contactDetails: {
    backgroundColor: COLORS.gray50,
    borderRadius: 8,
    padding: 16,
  },
  contactItem: {
    fontSize: SIZES.base,
    color: COLORS.gray700,
    marginBottom: 8,
    lineHeight: 22,
  },
  feedbackSection: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  feedbackCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    ...SHADOWS.small,
  },
  feedbackTitle: {
    fontSize: SIZES.base,
    fontWeight: '600',
    color: COLORS.gray900,
    marginBottom: 16,
  },
  feedbackButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  feedbackButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: COLORS.gray100,
    borderRadius: 8,
  },
  feedbackButtonText: {
    fontSize: SIZES.base,
    fontWeight: '500',
    color: COLORS.gray700,
  },
});