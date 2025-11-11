import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList, AlertType, BatchRecord } from '../../types';
import { COLORS, SIZES, SHADOWS } from '../../constants/theme';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../hooks/useAuth';

type Props = NativeStackScreenProps<RootStackParamList, 'CreateAlert'>;

const ALERT_TYPES: { value: AlertType; label: string; color: string }[] = [
  { value: 'CRITICAL', label: 'Crítica', color: COLORS.error },
  { value: 'WARNING', label: 'Advertencia', color: COLORS.warning },
  { value: 'INFO', label: 'Informativa', color: COLORS.primary },
];

export default function CreateAlertScreen({ navigation, route }: Props) {
  const { reportId, batchId } = route.params || {};
  const { profile } = useAuth();

  const [type, setType] = useState<AlertType>('WARNING');
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [reason, setReason] = useState('');
  const [recommendations, setRecommendations] = useState('');
  const [officialDocumentUrl, setOfficialDocumentUrl] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactWebsite, setContactWebsite] = useState('');

  const [batch, setBatch] = useState<BatchRecord | null>(null);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    if (batchId) {
      fetchBatchInfo();
    }
  }, [batchId]);

  const fetchBatchInfo = async () => {
    if (!batchId) return;
    setLoading(true);
    const { data, error } = await supabase
      .from('batch')
      .select(
        `
        *,
        medicine:medicineId (*)
      `,
      )
      .eq('id', batchId)
      .single();

    if (!error && data) {
      setBatch(data as BatchRecord);
    }
    setLoading(false);
  };

  const handleCreateAlert = async () => {
    if (!title.trim() || !message.trim()) {
      Alert.alert('Error', 'Completa al menos el título y mensaje de la alerta.');
      return;
    }

    if (profile?.role !== 'ADMIN') {
      Alert.alert('Error', 'No tienes permisos para crear alertas.');
      return;
    }

    setCreating(true);

    const recommendationsArray = recommendations
      .split('\n')
      .map((r) => r.trim())
      .filter((r) => r.length > 0);

    const contactInfo =
      contactPhone || contactEmail || contactWebsite
        ? {
            phone: contactPhone || undefined,
            email: contactEmail || undefined,
            website: contactWebsite || undefined,
          }
        : null;

    const payload: any = {
      type,
      title: title.trim(),
      message: message.trim(),
      reason: reason.trim() || null,
      recommendations: recommendationsArray.length > 0 ? recommendationsArray : null,
      officialDocumentUrl: officialDocumentUrl.trim() || null,
      contactInfo,
      isActive: true,
      publishedAt: new Date().toISOString(),
    };

    if (batchId) {
      payload.batchId = batchId;
      payload.medicineId = batch?.medicineId || null;
    }

    const { error } = await supabase.from('alert').insert(payload);

    if (error) {
      console.error('[CreateAlert] Error al crear alerta:', error.message);
      Alert.alert('Error', 'No se pudo crear la alerta. Intenta nuevamente.');
      setCreating(false);
      return;
    }

    Alert.alert('Éxito', 'Alerta sanitaria creada y publicada correctamente.', [
      {
        text: 'OK',
        onPress: () => {
          if (reportId) {
            navigation.navigate('AdminReports');
          } else {
            navigation.goBack();
          }
        },
      },
    ]);
    setCreating(false);
  };

  if (profile?.role !== 'ADMIN') {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <View style={styles.backIcon} />
          </TouchableOpacity>
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>No tienes permisos para acceder a esta sección.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <View style={styles.backIcon} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Crear Alerta Sanitaria</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {loading && (
          <View style={styles.loadingRow}>
            <ActivityIndicator color={COLORS.primary} />
            <Text style={styles.loadingText}>Cargando información...</Text>
          </View>
        )}

        {batch && (
          <View style={styles.batchCard}>
            <Text style={styles.batchLabel}>Vinculado al lote:</Text>
            <Text style={styles.batchInfo}>
              {batch.medicine?.name} - {batch.medicine?.dosage}
            </Text>
            <Text style={styles.batchNumber}>Lote: {batch.batchNumber}</Text>
          </View>
        )}

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Tipo de Alerta *</Text>
          <View style={styles.typeOptions}>
            {ALERT_TYPES.map((alertType) => (
              <TouchableOpacity
                key={alertType.value}
                style={[
                  styles.typeOption,
                  type === alertType.value && {
                    backgroundColor: `${alertType.color}20`,
                    borderColor: alertType.color,
                  },
                ]}
                onPress={() => setType(alertType.value)}
              >
                <Text
                  style={[
                    styles.typeOptionText,
                    type === alertType.value && { color: alertType.color, fontWeight: '700' },
                  ]}
                >
                  {alertType.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Título *</Text>
          <TextInput
            style={styles.input}
            placeholder="Ej: Retiro de lote por contaminación"
            placeholderTextColor={COLORS.gray400}
            value={title}
            onChangeText={setTitle}
          />
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Mensaje *</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Descripción detallada de la alerta..."
            placeholderTextColor={COLORS.gray400}
            value={message}
            onChangeText={setMessage}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Motivo</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Razón específica del problema..."
            placeholderTextColor={COLORS.gray400}
            value={reason}
            onChangeText={setReason}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Recomendaciones (una por línea)</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder={'No consumir el medicamento\nDevolver a la farmacia\nConsultar con médico'}
            placeholderTextColor={COLORS.gray400}
            value={recommendations}
            onChangeText={setRecommendations}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Información de Contacto</Text>

          <Text style={styles.label}>Teléfono</Text>
          <TextInput
            style={styles.input}
            placeholder="0800-XXX-XXXX"
            placeholderTextColor={COLORS.gray400}
            value={contactPhone}
            onChangeText={setContactPhone}
            keyboardType="phone-pad"
          />

          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="contacto@ejemplo.com"
            placeholderTextColor={COLORS.gray400}
            value={contactEmail}
            onChangeText={setContactEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Text style={styles.label}>Sitio Web</Text>
          <TextInput
            style={styles.input}
            placeholder="https://ejemplo.com"
            placeholderTextColor={COLORS.gray400}
            value={contactWebsite}
            onChangeText={setContactWebsite}
            keyboardType="url"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Documento Oficial (URL)</Text>
          <TextInput
            style={styles.input}
            placeholder="https://anmat.gob.ar/documento.pdf"
            placeholderTextColor={COLORS.gray400}
            value={officialDocumentUrl}
            onChangeText={setOfficialDocumentUrl}
            keyboardType="url"
            autoCapitalize="none"
          />
        </View>

        <TouchableOpacity
          style={[styles.createButton, creating && styles.createButtonDisabled]}
          onPress={handleCreateAlert}
          disabled={creating}
        >
          {creating ? (
            <ActivityIndicator color={COLORS.white} />
          ) : (
            <Text style={styles.createButtonText}>Publicar Alerta</Text>
          )}
        </TouchableOpacity>
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
    paddingHorizontal: 24,
    paddingVertical: 16,
    gap: 16,
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
    width: 12,
    height: 12,
    borderLeftWidth: 3,
    borderBottomWidth: 3,
    borderColor: COLORS.gray700,
    transform: [{ rotate: '45deg' }],
  },
  headerTitle: {
    fontSize: SIZES.lg,
    fontWeight: '700',
    color: COLORS.gray900,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  loadingText: {
    color: COLORS.gray600,
    fontSize: SIZES.sm,
  },
  batchCard: {
    backgroundColor: COLORS.primaryLight,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  batchLabel: {
    fontSize: SIZES.sm,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: 4,
  },
  batchInfo: {
    fontSize: SIZES.base,
    fontWeight: '600',
    color: COLORS.gray900,
    marginBottom: 2,
  },
  batchNumber: {
    fontSize: SIZES.sm,
    color: COLORS.gray700,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    ...SHADOWS.medium,
  },
  sectionTitle: {
    fontSize: SIZES.lg,
    fontWeight: '700',
    color: COLORS.gray900,
    marginBottom: 12,
  },
  typeOptions: {
    flexDirection: 'row',
    gap: 12,
  },
  typeOption: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: COLORS.gray100,
    borderWidth: 2,
    borderColor: COLORS.gray100,
    alignItems: 'center',
  },
  typeOptionText: {
    fontSize: SIZES.sm,
    fontWeight: '600',
    color: COLORS.gray700,
  },
  label: {
    fontSize: SIZES.base,
    fontWeight: '600',
    color: COLORS.gray700,
    marginBottom: 8,
    marginTop: 12,
  },
  input: {
    backgroundColor: COLORS.gray50,
    borderRadius: 16,
    padding: 16,
    fontSize: SIZES.base,
    color: COLORS.gray900,
  },
  textArea: {
    minHeight: 100,
  },
  createButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
    marginVertical: 24,
    ...SHADOWS.medium,
  },
  createButtonDisabled: {
    opacity: 0.6,
  },
  createButtonText: {
    fontSize: SIZES.base,
    fontWeight: '700',
    color: COLORS.white,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  errorText: {
    fontSize: SIZES.base,
    color: COLORS.error,
    textAlign: 'center',
  },
});
