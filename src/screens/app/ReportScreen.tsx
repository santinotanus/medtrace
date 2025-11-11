import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Image,
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system/legacy';
import { Buffer } from 'buffer';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList, BatchRecord } from '../../types';
import Button from '../../components/Button';
import { COLORS, SIZES, SHADOWS } from '../../constants/theme';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../hooks/useAuth';
import { formatDate } from '../../utils/format';

type Props = NativeStackScreenProps<RootStackParamList, 'Report'>;

type ProblemType = 'ADVERSE_EFFECT' | 'QUALITY_ISSUE' | 'COUNTERFEIT';
type Severity = 'MILD' | 'MODERATE' | 'SEVERE';

const problemTypes: { type: ProblemType; title: string; subtitle: string }[] = [
  {
    type: 'ADVERSE_EFFECT',
    title: 'Efecto adverso',
    subtitle: 'Reacción no esperada al medicamento',
  },
  {
    type: 'QUALITY_ISSUE',
    title: 'Problema de calidad',
    subtitle: 'Defecto en el producto o envase',
  },
  {
    type: 'COUNTERFEIT',
    title: 'Sospecha de falsificación',
    subtitle: 'El producto parece no ser auténtico',
  },
];

export default function ReportScreen({ navigation, route }: Props) {
  const { profile, isGuest } = useAuth();
  const [selectedType, setSelectedType] = useState<ProblemType>('ADVERSE_EFFECT');
  const [description, setDescription] = useState('');
  const [severity, setSeverity] = useState<Severity>('MODERATE');
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [loading, setLoading] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState<BatchRecord | null>(null);
  const [batchQuery, setBatchQuery] = useState(route.params?.presetBatchNumber ?? '');
  const [photos, setPhotos] = useState<ImagePicker.ImagePickerAsset[]>([]);
  const [batchOptions, setBatchOptions] = useState<BatchRecord[]>([]);
  const [loadingBatches, setLoadingBatches] = useState(false);

  useEffect(() => {
    if (route.params?.batchId) {
      supabase
        .from('batch')
        .select('*, medicine:medicineId (*)')
        .eq('id', route.params.batchId)
        .maybeSingle()
        .then(({ data }) => {
          if (data) setSelectedBatch(data as BatchRecord);
        });
    }
  }, [route.params?.batchId]);

  const handleSelectBatch = async (batch: BatchRecord) => {
    setBatchQuery(batch.batchNumber ?? batch.qrCode ?? '');
    const { data } = await supabase
      .from('batch')
      .select('*, medicine:medicineId (*)')
      .eq('id', batch.id)
      .maybeSingle<BatchRecord>();
    if (data) {
      setSelectedBatch(data);
    }
  };

  useEffect(() => {
    const fetchBatches = async () => {
      setLoadingBatches(true);
      const { data, error } = await supabase
        .from('batch')
        .select(
          'id,"batchNumber","qrCode","expirationDate","manufacturingDate","status","blockchainHash","createdAt", medicine:medicineId (id,name,dosage,laboratory)',
        )
        .order('createdAt', { ascending: false })
        .limit(200);

      if (error) {
        console.error('[Report] Error cargando lotes:', error.message);
      } else if (data) {
        setBatchOptions(data as BatchRecord[]);
      }
      setLoadingBatches(false);
    };

    fetchBatches();
  }, []);

  const filteredBatches = useMemo(() => {
    const query = batchQuery.trim().toLowerCase();
    if (!query) return batchOptions;

    return batchOptions.filter((batch) => {
      const qr = batch.qrCode?.toLowerCase() ?? '';
      const number = batch.batchNumber?.toLowerCase() ?? '';
      const med = batch.medicine?.name?.toLowerCase() ?? '';
      return qr.includes(query) || number.includes(query) || med.includes(query);
    });
  }, [batchOptions, batchQuery]);

  const MAX_PHOTOS = 3;

  const pickImage = async () => {
    try {
      if (photos.length >= MAX_PHOTOS) {
        Alert.alert('Límite alcanzado', 'Solo puedes adjuntar hasta 3 fotos.');
        return;
      }

      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (permission.status !== 'granted') {
        Alert.alert(
          'Permiso requerido',
          'Necesitamos acceso a tu galería para adjuntar fotos del problema.',
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        quality: 0.7,
      });

      if (!result.canceled && result.assets?.length) {
        setPhotos((prev) => [...prev, ...result.assets].slice(0, MAX_PHOTOS));
      }
    } catch (error) {
      console.error('[Report] Error abriendo galería:', error);
      Alert.alert('Error', 'No pudimos abrir tu galería. Intenta nuevamente.');
    }
  };

  const removePhoto = (uri: string) => {
    setPhotos((prev) => prev.filter((photo) => photo.uri !== uri));
  };

  const uploadPhotos = async () => {
    const urls: string[] = [];

    for (const asset of photos) {
      try {
        const base64File = await FileSystem.readAsStringAsync(asset.uri, {
          encoding: 'base64',
        });
        const buffer = Buffer.from(base64File, 'base64');

        const ext =
          asset.fileName?.split('.')?.pop() ??
          asset.mimeType?.split('/')?.pop() ??
          'jpg';
        const fileName = `${Date.now()}_${Math.random()
          .toString(36)
          .slice(2)}.${ext}`;
        const storagePath = `${profile?.id ?? 'anon'}/${fileName}`;

        const { error } = await supabase.storage
          .from('report_photos')
          .upload(storagePath, buffer, {
            upsert: false,
            contentType: asset.mimeType ?? 'image/jpeg',
          });

        if (error) throw error;

        const { data: publicUrlData } = supabase.storage
          .from('report_photos')
          .getPublicUrl(storagePath);
        urls.push(publicUrlData.publicUrl);
      } catch (error) {
        console.error('[Report] Error subiendo foto:', error);
        throw new Error('No pudimos subir una de las fotos. Intenta nuevamente.');
      }
    }

    return urls;
  };

  const handleSubmit = async () => {
    if (isGuest) {
      Alert.alert('Inicia sesión', 'Necesitas una cuenta para enviar reportes.');
      return;
    }

    if (!selectedBatch) {
      Alert.alert('Selecciona un lote', 'Busca el código del medicamento que deseas reportar.');
      return;
    }

    if (!description.trim()) {
      Alert.alert('Completa la descripción', 'Describe el problema para que podamos ayudarte.');
      return;
    }

    try {
      setLoading(true);
      const photoUrls = photos.length ? await uploadPhotos() : null;

      const payload = {
        batchId: selectedBatch.id,
        userId: isAnonymous ? null : profile?.id,
        type: selectedType,
        description: description.trim(),
        severity,
        isAnonymous,
        photos: photoUrls,
      };

      const { error } = await supabase.from('report').insert(payload);
      if (error) throw error;

      Alert.alert('Gracias', 'Tu reporte fue enviado correctamente.');
      navigation.goBack();
    } catch (error: any) {
      Alert.alert('Error', error.message ?? 'No pudimos enviar el reporte.');
    } finally {
      setLoading(false);
    }
  };

  const selectedInfo = useMemo(() => {
    if (!selectedBatch) return null;
    return {
      name: `${selectedBatch.medicine?.name ?? ''} ${selectedBatch.medicine?.dosage ?? ''}`,
      batchNumber: selectedBatch.batchNumber,
      expiration: formatDate(selectedBatch.expirationDate),
      lab: selectedBatch.medicine?.laboratory ?? '—',
    };
  }, [selectedBatch]);

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <View style={styles.backIcon} />
          </TouchableOpacity>
          <View style={styles.headerText}>
            <Text style={styles.headerTitle}>Reportar Problema</Text>
            <Text style={styles.headerSubtitle}>Ayuda a proteger a otros</Text>
          </View>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Medicamento</Text>
            <View style={styles.medicineCard}>
              {selectedInfo ? (
                <>
                  <View style={styles.medicineInfo}>
                    <Text style={styles.medicineName}>{selectedInfo.name}</Text>
                    <Text style={styles.medicineBatch}>Lote {selectedInfo.batchNumber}</Text>
                    <Text style={styles.medicineMeta}>Laboratorio: {selectedInfo.lab}</Text>
                    <Text style={styles.medicineMeta}>Vence: {selectedInfo.expiration}</Text>
                  </View>
                  <TouchableOpacity onPress={() => setSelectedBatch(null)}>
                    <Text style={styles.changeButton}>Cambiar</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <View style={{ flex: 1 }}>
                  <Text style={styles.medicineMeta}>
                    Buscá el lote por número o QR para vincular tu reporte.
                  </Text>
                </View>
              )}
            </View>
            <View style={styles.lookupWrapper}>
              <TextInput
                style={styles.lookupInput}
                placeholder="Buscar por QR, lote o nombre"
                value={batchQuery}
                onChangeText={setBatchQuery}
                autoCapitalize="characters"
              />
              {loadingBatches && <Text style={styles.lookupHint}>Cargando lotes...</Text>}
              {!loadingBatches && (
                <View style={styles.suggestionsList}>
                  {filteredBatches.slice(0, 12).map((item) => (
                    <TouchableOpacity
                      key={item.id}
                      style={styles.suggestionItem}
                      onPress={() => handleSelectBatch(item)}
                    >
                      <Text style={styles.suggestionTitle}>
                        {item.batchNumber ?? 'Sin número'}
                      </Text>
                      <Text style={styles.suggestionSubtitle}>
                        {item.medicine?.name ?? 'Medicamento'} · {item.qrCode ?? 'QR sin definir'}
                      </Text>
                    </TouchableOpacity>
                  ))}
                  {filteredBatches.length === 0 && batchQuery.trim() ? (
                    <Text style={styles.noResults}>No hay coincidencias para tu búsqueda.</Text>
                  ) : null}
                </View>
              )}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Tipo de problema</Text>
            {problemTypes.map((problem) => (
              <TouchableOpacity
                key={problem.type}
                style={[
                  styles.problemTypeCard,
                  selectedType === problem.type && styles.problemTypeCardActive,
                ]}
                onPress={() => setSelectedType(problem.type)}
              >
                <View
                  style={[
                    styles.radio,
                    selectedType === problem.type && styles.radioActive,
                  ]}
                >
                  {selectedType === problem.type && <View style={styles.radioDot} />}
                </View>
                <View style={styles.problemTypeText}>
                  <Text style={styles.problemTypeTitle}>{problem.title}</Text>
                  <Text style={styles.problemTypeSubtitle}>{problem.subtitle}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Descripción detallada</Text>
            <TextInput
              style={styles.textArea}
              placeholder="Describe lo que sucedió con el mayor detalle posible..."
              placeholderTextColor={COLORS.gray400}
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={6}
              textAlignVertical="top"
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Gravedad</Text>
            <View style={styles.severityGrid}>
              {(['MILD', 'MODERATE', 'SEVERE'] as Severity[]).map((sev) => (
                <TouchableOpacity
                  key={sev}
                  style={[
                    styles.severityButton,
                    severity === sev && styles.severityButtonActive,
                  ]}
                  onPress={() => setSeverity(sev)}
                >
                  <Text
                    style={[
                      styles.severityText,
                      severity === sev && styles.severityTextActive,
                    ]}
                  >
                    {sev === 'MILD' ? 'Leve' : sev === 'MODERATE' ? 'Moderada' : 'Grave'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Fotos (opcional)</Text>
            <View style={styles.photosRow}>
              {photos.map((photo) => (
                <View key={photo.uri} style={styles.photoPreview}>
                  <Image source={{ uri: photo.uri }} style={styles.photoImage} />
                  <TouchableOpacity
                    style={styles.removePhoto}
                    onPress={() => removePhoto(photo.uri)}
                  >
                    <Text style={styles.removePhotoText}>×</Text>
                  </TouchableOpacity>
                </View>
              ))}
              {photos.length < 3 && (
                <TouchableOpacity style={styles.photoUpload} onPress={pickImage}>
                  <View style={styles.photoIcon} />
                  <Text style={styles.photoText}>Agregar foto</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          <View style={styles.section}>
            <TouchableOpacity
              style={styles.anonymousCard}
              onPress={() => setIsAnonymous(!isAnonymous)}
            >
              <View style={styles.anonymousText}>
                <Text style={styles.anonymousTitle}>Reporte anónimo</Text>
                <Text style={styles.anonymousSubtitle}>
                  No se compartirá tu identidad
                </Text>
              </View>
              <View style={[styles.toggle, isAnonymous && styles.toggleActive]}>
                <View
                  style={[
                    styles.toggleThumb,
                    isAnonymous && styles.toggleThumbActive,
                  ]}
                />
              </View>
            </TouchableOpacity>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <Button
            title="Enviar Reporte"
            onPress={handleSubmit}
            loading={loading}
            disabled={isGuest || !selectedBatch || !description.trim()}
          />
          <Text style={styles.footerNote}>
            Tu reporte será revisado por ANMAT y podrá ayudar a prevenir problemas
            en otros pacientes
          </Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  keyboardView: {
    flex: 1,
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
    width: 20,
    height: 20,
    backgroundColor: COLORS.gray700,
    borderRadius: 4,
  },
  headerText: {
    flex: 1,
  },
  headerTitle: {
    fontSize: SIZES.xl,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 2,
  },
  headerSubtitle: {
    fontSize: SIZES.sm,
    color: COLORS.gray600,
  },
  content: {
    flex: 1,
  },
  section: {
    paddingHorizontal: 24,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: SIZES.base,
    fontWeight: '600',
    color: COLORS.gray700,
    marginBottom: 12,
  },
  medicineCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    ...SHADOWS.small,
  },
  medicineInfo: {
    flex: 1,
  },
  medicineName: {
    fontSize: SIZES.base,
    fontWeight: '600',
    color: COLORS.gray900,
  },
  medicineBatch: {
    fontSize: SIZES.sm,
    color: COLORS.gray600,
  },
  medicineMeta: {
    fontSize: SIZES.xs,
    color: COLORS.gray500,
  },
  changeButton: {
    fontSize: SIZES.sm,
    fontWeight: '600',
    color: COLORS.primary,
  },
  lookupWrapper: {
    marginTop: 12,
  },
  lookupInput: {
    borderWidth: 1,
    borderColor: COLORS.gray200,
    borderRadius: 12,
    paddingHorizontal: 16,
    backgroundColor: COLORS.white,
  },
  lookupHint: {
    marginTop: 8,
    fontSize: SIZES.xs,
    color: COLORS.gray500,
  },
  suggestionsList: {
    maxHeight: 240,
    marginTop: 8,
  },
  suggestionItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray100,
  },
  suggestionTitle: {
    fontSize: SIZES.base,
    fontWeight: '600',
    color: COLORS.gray900,
  },
  suggestionSubtitle: {
    fontSize: SIZES.xs,
    color: COLORS.gray500,
  },
  noResults: {
    marginTop: 12,
    fontSize: SIZES.xs,
    color: COLORS.gray500,
  },
  problemTypeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    backgroundColor: COLORS.white,
    marginBottom: 12,
    ...SHADOWS.small,
  },
  problemTypeCardActive: {
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: COLORS.gray300,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  radioActive: {
    borderColor: COLORS.primary,
  },
  radioDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.primary,
  },
  problemTypeText: {
    flex: 1,
  },
  problemTypeTitle: {
    fontSize: SIZES.base,
    fontWeight: '600',
    color: COLORS.gray900,
  },
  problemTypeSubtitle: {
    fontSize: SIZES.sm,
    color: COLORS.gray500,
  },
  textArea: {
    minHeight: 160,
    borderWidth: 1,
    borderColor: COLORS.gray200,
    borderRadius: 16,
    padding: 16,
    backgroundColor: COLORS.white,
  },
  severityGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  severityButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: COLORS.gray200,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: COLORS.white,
  },
  severityButtonActive: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primaryLight,
  },
  severityText: {
    color: COLORS.gray600,
    fontWeight: '600',
  },
  severityTextActive: {
    color: COLORS.primary,
  },
  photosRow: {
    flexDirection: 'row',
    gap: 12,
    flexWrap: 'wrap',
  },
  photoUpload: {
    width: 96,
    height: 96,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: COLORS.gray200,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.white,
  },
  photoIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.gray300,
    marginBottom: 8,
  },
  photoText: {
    fontSize: SIZES.xs,
    color: COLORS.gray500,
    textAlign: 'center',
  },
  photoPreview: {
    width: 96,
    height: 96,
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
  },
  photoImage: {
    width: '100%',
    height: '100%',
  },
  removePhoto: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: COLORS.error,
    alignItems: 'center',
    justifyContent: 'center',
  },
  removePhotoText: {
    color: COLORS.white,
    fontWeight: '700',
  },
  anonymousCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    ...SHADOWS.small,
  },
  anonymousText: {
    flex: 1,
  },
  anonymousTitle: {
    fontSize: SIZES.base,
    fontWeight: '600',
    color: COLORS.gray900,
  },
  anonymousSubtitle: {
    fontSize: SIZES.sm,
    color: COLORS.gray500,
  },
  toggle: {
    width: 48,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.gray300,
    justifyContent: 'center',
    padding: 4,
  },
  toggleActive: {
    backgroundColor: COLORS.primary,
  },
  toggleThumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: COLORS.white,
    alignSelf: 'flex-start',
  },
  toggleThumbActive: {
    alignSelf: 'flex-end',
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  footerNote: {
    fontSize: SIZES.sm,
    color: COLORS.gray500,
    textAlign: 'center',
    marginTop: 8,
  },
});
