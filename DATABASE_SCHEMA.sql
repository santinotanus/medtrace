-- ===============================================
-- SCHEMA COMPLETO DE MEDTRACE
-- ===============================================
-- Script SQL para crear todas las tablas en Supabase
-- Ejecuta este script en tu nuevo proyecto de Supabase
-- en el SQL Editor (https://app.supabase.com)
--
-- ORDEN DE EJECUCIÓN:
-- 1. Ejecuta este archivo completo para crear todas las tablas
-- 2. Ejecuta ADMIN_RLS_POLICIES.sql para las políticas de administrador
-- 3. Configura el Storage bucket para fotos de reportes
-- 4. Actualiza las credenciales en tu frontend (.env)
-- ===============================================

-- ===============================================
-- 1. TABLA: profiles
-- ===============================================
-- Almacena información extendida de usuarios
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  role TEXT NOT NULL DEFAULT 'USER' CHECK (role IN ('USER', 'GUEST', 'ADMIN')),
  "isEmailVerified" BOOLEAN NOT NULL DEFAULT false,
  "lastLoginAt" TIMESTAMP WITH TIME ZONE,
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Índices para profiles
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);

-- RLS para profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Los usuarios pueden ver su propio perfil"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Los usuarios pueden actualizar su propio perfil"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Permitir inserción de perfil en registro"
  ON public.profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- ===============================================
-- 2. TABLA: notification_settings
-- ===============================================
-- Configuración de notificaciones por usuario
CREATE TABLE IF NOT EXISTS public.notification_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "userId" UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  "allNotifications" BOOLEAN NOT NULL DEFAULT true,
  "criticalAlerts" BOOLEAN NOT NULL DEFAULT true,
  warnings BOOLEAN NOT NULL DEFAULT true,
  "infoAlerts" BOOLEAN NOT NULL DEFAULT false,
  "scanResults" BOOLEAN NOT NULL DEFAULT true,
  "reportUpdates" BOOLEAN NOT NULL DEFAULT true,
  "soundEnabled" BOOLEAN NOT NULL DEFAULT true,
  "vibrationEnabled" BOOLEAN NOT NULL DEFAULT true,
  "notificationTone" TEXT,
  "emailNotifications" BOOLEAN NOT NULL DEFAULT false,
  "quietHoursStart" TEXT,
  "quietHoursEnd" TEXT,
  "fcmToken" TEXT,
  "apnsToken" TEXT,
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  UNIQUE("userId")
);

-- Índices para notification_settings
CREATE INDEX IF NOT EXISTS idx_notification_settings_userId ON public.notification_settings("userId");

-- RLS para notification_settings
ALTER TABLE public.notification_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Los usuarios pueden ver su configuración de notificaciones"
  ON public.notification_settings FOR SELECT
  TO authenticated
  USING (auth.uid() = "userId");

CREATE POLICY "Los usuarios pueden actualizar su configuración de notificaciones"
  ON public.notification_settings FOR UPDATE
  TO authenticated
  USING (auth.uid() = "userId")
  WITH CHECK (auth.uid() = "userId");

CREATE POLICY "Los usuarios pueden crear su configuración de notificaciones"
  ON public.notification_settings FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = "userId");

-- ===============================================
-- 3. TABLA: user_settings
-- ===============================================
-- Preferencias generales del usuario
CREATE TABLE IF NOT EXISTS public.user_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "userId" UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  "darkMode" BOOLEAN NOT NULL DEFAULT false,
  language TEXT NOT NULL DEFAULT 'es',
  "biometricsEnabled" BOOLEAN NOT NULL DEFAULT false,
  "autoSync" BOOLEAN NOT NULL DEFAULT true,
  "dataUsageConsent" BOOLEAN NOT NULL DEFAULT false,
  "analyticsEnabled" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  UNIQUE("userId")
);

-- Índices para user_settings
CREATE INDEX IF NOT EXISTS idx_user_settings_userId ON public.user_settings("userId");

-- RLS para user_settings
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Los usuarios pueden ver su configuración"
  ON public.user_settings FOR SELECT
  TO authenticated
  USING (auth.uid() = "userId");

CREATE POLICY "Los usuarios pueden actualizar su configuración"
  ON public.user_settings FOR UPDATE
  TO authenticated
  USING (auth.uid() = "userId")
  WITH CHECK (auth.uid() = "userId");

CREATE POLICY "Los usuarios pueden crear su configuración"
  ON public.user_settings FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = "userId");

-- ===============================================
-- 4. TABLA: medicine
-- ===============================================
-- Catálogo de medicamentos
CREATE TABLE IF NOT EXISTS public.medicine (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  dosage TEXT NOT NULL,
  laboratory TEXT NOT NULL,
  "anmatRegistry" TEXT NOT NULL UNIQUE,
  description TEXT,
  "activeIngredient" TEXT,
  status TEXT NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'WITHDRAWN', 'DISCONTINUED')),
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Índices para medicine
CREATE INDEX IF NOT EXISTS idx_medicine_name ON public.medicine(name);
CREATE INDEX IF NOT EXISTS idx_medicine_laboratory ON public.medicine(laboratory);
CREATE INDEX IF NOT EXISTS idx_medicine_status ON public.medicine(status);
CREATE INDEX IF NOT EXISTS idx_medicine_anmatRegistry ON public.medicine("anmatRegistry");

-- RLS para medicine (lectura pública, escritura solo admins)
ALTER TABLE public.medicine ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Todos pueden ver medicamentos activos"
  ON public.medicine FOR SELECT
  TO authenticated, anon
  USING (true);

-- ===============================================
-- 5. TABLA: batch
-- ===============================================
-- Lotes de medicamentos con código QR
CREATE TABLE IF NOT EXISTS public.batch (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "medicineId" UUID NOT NULL REFERENCES public.medicine(id) ON DELETE CASCADE,
  "batchNumber" TEXT NOT NULL,
  "qrCode" TEXT NOT NULL UNIQUE,
  "expirationDate" DATE NOT NULL,
  "manufacturingDate" DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'SAFE' CHECK (status IN ('SAFE', 'ALERT', 'WARNING', 'WITHDRAWN')),
  "blockchainHash" TEXT,
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  UNIQUE("medicineId", "batchNumber")
);

-- Índices para batch
CREATE INDEX IF NOT EXISTS idx_batch_medicineId ON public.batch("medicineId");
CREATE INDEX IF NOT EXISTS idx_batch_qrCode ON public.batch("qrCode");
CREATE INDEX IF NOT EXISTS idx_batch_status ON public.batch(status);
CREATE INDEX IF NOT EXISTS idx_batch_batchNumber ON public.batch("batchNumber");

-- RLS para batch (lectura pública)
ALTER TABLE public.batch ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Todos pueden ver lotes"
  ON public.batch FOR SELECT
  TO authenticated, anon
  USING (true);

-- ===============================================
-- 6. TABLA: traceability_step
-- ===============================================
-- Pasos de trazabilidad de un lote (blockchain)
CREATE TABLE IF NOT EXISTS public.traceability_step (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "batchId" UUID NOT NULL REFERENCES public.batch(id) ON DELETE CASCADE,
  step INTEGER NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  location TEXT NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('COMPLETED', 'PENDING')),
  "verifiedBy" TEXT,
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  UNIQUE("batchId", step)
);

-- Índices para traceability_step
CREATE INDEX IF NOT EXISTS idx_traceability_step_batchId ON public.traceability_step("batchId");
CREATE INDEX IF NOT EXISTS idx_traceability_step_status ON public.traceability_step(status);

-- RLS para traceability_step (lectura pública)
ALTER TABLE public.traceability_step ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Todos pueden ver pasos de trazabilidad"
  ON public.traceability_step FOR SELECT
  TO authenticated, anon
  USING (true);

-- ===============================================
-- 7. TABLA: alert
-- ===============================================
-- Alertas sanitarias emitidas por ANMAT/admins
CREATE TABLE IF NOT EXISTS public.alert (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL CHECK (type IN ('CRITICAL', 'WARNING', 'INFO')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  reason TEXT,
  recommendations TEXT[], -- Array de strings
  "medicineId" UUID REFERENCES public.medicine(id) ON DELETE SET NULL,
  "batchId" UUID REFERENCES public.batch(id) ON DELETE SET NULL,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "publishedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  "expiresAt" TIMESTAMP WITH TIME ZONE,
  "officialDocumentUrl" TEXT,
  "contactInfo" JSONB, -- { phone, email, website }
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Índices para alert
CREATE INDEX IF NOT EXISTS idx_alert_medicineId ON public.alert("medicineId");
CREATE INDEX IF NOT EXISTS idx_alert_batchId ON public.alert("batchId");
CREATE INDEX IF NOT EXISTS idx_alert_isActive ON public.alert("isActive");
CREATE INDEX IF NOT EXISTS idx_alert_type ON public.alert(type);
CREATE INDEX IF NOT EXISTS idx_alert_publishedAt ON public.alert("publishedAt");

-- RLS para alert (lectura pública, escritura solo admins)
ALTER TABLE public.alert ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Todos pueden ver alertas activas"
  ON public.alert FOR SELECT
  TO authenticated, anon
  USING (true);

-- ===============================================
-- 8. TABLA: report
-- ===============================================
-- Reportes de problemas/efectos adversos de usuarios
CREATE TABLE IF NOT EXISTS public.report (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "userId" UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  "batchId" UUID NOT NULL REFERENCES public.batch(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('ADVERSE_EFFECT', 'QUALITY_ISSUE', 'COUNTERFEIT')),
  description TEXT NOT NULL,
  severity TEXT NOT NULL CHECK (severity IN ('MILD', 'MODERATE', 'SEVERE')),
  "isAnonymous" BOOLEAN NOT NULL DEFAULT false,
  status TEXT NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'REVIEWING', 'RESOLVED', 'REJECTED')),
  photos TEXT[], -- Array de URLs públicas de Supabase Storage
  "reviewedBy" UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  "reviewNotes" TEXT,
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Índices para report
CREATE INDEX IF NOT EXISTS idx_report_userId ON public.report("userId");
CREATE INDEX IF NOT EXISTS idx_report_batchId ON public.report("batchId");
CREATE INDEX IF NOT EXISTS idx_report_status ON public.report(status);
CREATE INDEX IF NOT EXISTS idx_report_type ON public.report(type);
CREATE INDEX IF NOT EXISTS idx_report_createdAt ON public.report("createdAt");

-- RLS para report
ALTER TABLE public.report ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Los usuarios pueden ver sus propios reportes"
  ON public.report FOR SELECT
  TO authenticated
  USING (auth.uid() = "userId");

CREATE POLICY "Los usuarios pueden crear reportes"
  ON public.report FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = "userId" OR "isAnonymous" = true);

-- ===============================================
-- 9. TABLA: scan_history
-- ===============================================
-- Historial de escaneos de QR por usuario
CREATE TABLE IF NOT EXISTS public.scan_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "userId" UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  "batchId" UUID NOT NULL REFERENCES public.batch(id) ON DELETE CASCADE,
  result TEXT NOT NULL CHECK (result IN ('SAFE', 'ALERT', 'WARNING')),
  "deviceInfo" JSONB,
  "scannedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Índices para scan_history
CREATE INDEX IF NOT EXISTS idx_scan_history_userId ON public.scan_history("userId");
CREATE INDEX IF NOT EXISTS idx_scan_history_batchId ON public.scan_history("batchId");
CREATE INDEX IF NOT EXISTS idx_scan_history_scannedAt ON public.scan_history("scannedAt");

-- RLS para scan_history
ALTER TABLE public.scan_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Los usuarios pueden ver su propio historial de escaneos"
  ON public.scan_history FOR SELECT
  TO authenticated
  USING (auth.uid() = "userId");

CREATE POLICY "Los usuarios pueden crear entradas de escaneo"
  ON public.scan_history FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = "userId");

-- ===============================================
-- TRIGGERS PARA ACTUALIZAR updatedAt
-- ===============================================
-- Función genérica para actualizar updatedAt
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW."updatedAt" = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Aplicar trigger a todas las tablas con updatedAt
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_notification_settings_updated_at BEFORE UPDATE ON public.notification_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_settings_updated_at BEFORE UPDATE ON public.user_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_medicine_updated_at BEFORE UPDATE ON public.medicine
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_batch_updated_at BEFORE UPDATE ON public.batch
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_alert_updated_at BEFORE UPDATE ON public.alert
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_report_updated_at BEFORE UPDATE ON public.report
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ===============================================
-- DATOS DE EJEMPLO (OPCIONAL - PARA DESARROLLO)
-- ===============================================
-- Puedes descomentar estas líneas para insertar datos de prueba

-- Medicamento de ejemplo
-- INSERT INTO public.medicine (name, dosage, laboratory, "anmatRegistry", description, "activeIngredient")
-- VALUES 
--   ('Ibuprofeno', '400mg', 'Laboratorio XYZ', 'ANMAT-12345', 'Analgésico y antiinflamatorio', 'Ibuprofeno'),
--   ('Paracetamol', '500mg', 'Laboratorio ABC', 'ANMAT-67890', 'Analgésico y antipirético', 'Paracetamol');

-- Lote de ejemplo
-- INSERT INTO public.batch ("medicineId", "batchNumber", "qrCode", "expirationDate", "manufacturingDate", status)
-- SELECT 
--   id, 
--   'LOTE-2024-001', 
--   'QR-IBU-2024-001', 
--   '2026-12-31', 
--   '2024-01-15',
--   'SAFE'
-- FROM public.medicine WHERE "anmatRegistry" = 'ANMAT-12345';

-- ===============================================
-- CONFIGURACIÓN DE STORAGE
-- ===============================================
-- Para que funcione la carga de fotos en reportes, debes crear un bucket en Storage:
-- 
-- 1. Ve a Storage en Supabase Dashboard
-- 2. Crea un nuevo bucket llamado: report_photos
-- 3. Configúralo como público (public: true)
-- 4. Configura las políticas de acceso:
--    - Permitir INSERT a usuarios autenticados
--    - Permitir SELECT a todos (público)
--
-- O ejecuta este código en SQL Editor:

-- Crear bucket (si no existe)
-- INSERT INTO storage.buckets (id, name, public)
-- VALUES ('report_photos', 'report_photos', true)
-- ON CONFLICT (id) DO NOTHING;

-- Política para subir fotos
-- CREATE POLICY "Los usuarios pueden subir fotos a sus reportes"
--   ON storage.objects FOR INSERT
--   TO authenticated
--   WITH CHECK (bucket_id = 'report_photos' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Política para ver fotos (público)
-- CREATE POLICY "Todos pueden ver fotos de reportes"
--   ON storage.objects FOR SELECT
--   TO authenticated, anon
--   USING (bucket_id = 'report_photos');

-- ===============================================
-- NOTAS FINALES
-- ===============================================
-- 
-- 1. Después de ejecutar este script, ejecuta ADMIN_RLS_POLICIES.sql
--    para agregar las políticas de administrador.
--
-- 2. Crea un usuario administrador:
--    UPDATE public.profiles SET role = 'ADMIN' WHERE email = 'tu-email@ejemplo.com';
--
-- 3. Configura las variables de entorno en tu frontend:
--    - EXPO_PUBLIC_SUPABASE_URL: URL de tu proyecto Supabase
--    - EXPO_PUBLIC_SUPABASE_ANON_KEY: Clave anon/public de tu proyecto
--
-- 4. El esquema usa camelCase en los nombres de columnas (ej: "userId")
--    para coincidir con tu código TypeScript.
--
-- 5. RLS está habilitado en todas las tablas para seguridad.
--
-- 6. Los triggers mantienen updatedAt actualizado automáticamente.
--
-- ===============================================
