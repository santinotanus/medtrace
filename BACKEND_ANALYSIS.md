# ===============================================
# DOCUMENTACIÓN TÉCNICA: MEDTRACE BACKEND (SUPABASE)
# ===============================================
#
# Este documento detalla la configuración completa, el esquema de la base de datos,
# las políticas de seguridad (RLS), las funciones serverless (Edge Functions)
# y la configuración de almacenamiento para el backend de MedTrace.
#
# -----------------------------------------------
# ÍNDICE
# -----------------------------------------------
# 1. Configuración del Proyecto
# 2. Schema SQL Completo (Tipos y Tablas)
# 3. Triggers de Autenticación
# 4. Políticas de Seguridad (Row Level Security - RLS)
# 5. Configuración de Storage (Almacenamiento)
# 6. Código de Edge Functions (Serverless)
# 7. Guía de Integración (Frontend)
#
# ===============================================
# 1. CONFIGURACIÓN DEL PROYECTO
# ===============================================
#
# URL del Proyecto (desde Dashboard > Project Settings > API):
# https://lyssfnzlhmvhlnuwdqxj.supabase.co
#
# Clave Pública Anónima (anon key):
# <TU_CLAVE_ANON_PUBLIC>
# (Usar esta en el cliente de React Native)
#
# Clave de Service Role (service_role key):
# <TU_CLAVE_SERVICE_ROLE>
# (Usada como secreto 'SUPABASE_SERVICE_ROLE_KEY' en las Edge Functions)
#
#
# ===============================================
# 2. SCHEMA SQL COMPLETO (TIPOS Y TABLAS)
# ===============================================
#
# Script SQL completo ejecutado en el "SQL Editor" de Supabase
# para crear toda la estructura de la base de datos.
#

-- Habilitar la extensión para UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Crear todos los ENUMs (tipos)
CREATE TYPE "Role" AS ENUM ('USER', 'GUEST', 'ADMIN');
CREATE TYPE "MedicineStatus" AS ENUM ('ACTIVE', 'WITHDRAWN', 'DISCONTINUED');
CREATE TYPE "BatchStatus" AS ENUM ('SAFE', 'ALERT', 'WARNING', 'WITHDRAWN');
CREATE TYPE "StepStatus" AS ENUM ('COMPLETED', 'PENDING');
CREATE TYPE "AlertType" AS ENUM ('CRITICAL', 'WARNING', 'INFO');
CREATE TYPE "ReportType" AS ENUM ('ADVERSE_EFFECT', 'QUALITY_ISSUE', 'COUNTERFEIT');
CREATE TYPE "Severity" AS ENUM ('MILD', 'MODERATE', 'SEVERE');
CREATE TYPE "ReportStatus" AS ENUM ('PENDING', 'REVIEWING', 'RESOLVED', 'REJECTED');
CREATE TYPE "ScanResult" AS ENUM ('SAFE', 'ALERT', 'WARNING');

-- 2. Tabla de Perfiles (tu entidad "User")
-- Se vincula a la tabla auth.users de Supabase
CREATE TABLE IF NOT EXISTS "profiles" (
  "id" uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  "name" text NOT NULL,
  "email" text UNIQUE NOT NULL,
  "phone" text,
  "role" "Role" NOT NULL DEFAULT 'USER',
  "isEmailVerified" boolean NOT NULL DEFAULT false,
  "lastLoginAt" timestamptz,
  "createdAt" timestamptz NOT NULL DEFAULT now(),
  "updatedAt" timestamptz NOT NULL DEFAULT now()
);

-- 3. Tabla Medicine (Medicamento)
CREATE TABLE IF NOT EXISTS "medicine" (
  "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  "name" text NOT NULL,
  "dosage" text NOT NULL,
  "laboratory" text NOT NULL,
  "anmatRegistry" text NOT NULL,
  "description" text,
  "activeIngredient" text,
  "status" "MedicineStatus" NOT NULL DEFAULT 'ACTIVE',
  "createdAt" timestamptz NOT NULL DEFAULT now(),
  "updatedAt" timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX ON "medicine" ("name");

-- 4. Tabla Batch (Lote)
CREATE TABLE IF NOT EXISTS "batch" (
  "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  "medicineId" uuid NOT NULL REFERENCES "medicine"(id),
  "batchNumber" text NOT NULL UNIQUE,
  "qrCode" text NOT NULL UNIQUE,
  "expirationDate" date NOT NULL,
  "manufacturingDate" date NOT NULL,
  "status" "BatchStatus" NOT NULL DEFAULT 'SAFE',
  "blockchainHash" text,
  "createdAt" timestamptz NOT NULL DEFAULT now(),
  "updatedAt" timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX ON "batch" ("qrCode");
CREATE INDEX ON "batch" ("batchNumber");

-- 5. Tabla TraceabilityStep (Paso de trazabilidad)
CREATE TABLE IF NOT EXISTS "traceability_step" (
  "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  "batchId" uuid NOT NULL REFERENCES "batch"(id) ON DELETE CASCADE,
  "step" smallint NOT NULL,
  "title" text NOT NULL,
  "description" text NOT NULL,
  "location" text NOT NULL,
  "timestamp" timestamZ NOT NULL,
  "status" "StepStatus" NOT NULL DEFAULT 'COMPLETED',
  "verifiedBy" text,
  "createdAt" timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX ON "traceability_step" ("batchId");

-- 6. Tabla Alert (Alerta sanitaria)
CREATE TABLE IF NOT EXISTS "alert" (
  "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  "type" "AlertType" NOT NULL,
  "title" text NOT NULL,
  "message" text NOT NULL,
  "reason" text,
  "recommendations" jsonb, -- Array de strings
  "medicineId" uuid REFERENCES "medicine"(id),
  "batchId" uuid REFERENCES "batch"(id),
  "isActive" boolean NOT NULL DEFAULT true,
  "publishedAt" timestamptz NOT NULL DEFAULT now(),
  "expiresAt" timestamptz,
  "officialDocumentUrl" text,
  "contactInfo" jsonb, -- { phone, email, website }
  "createdAt" timestamptz NOT NULL DEFAULT now(),
  "updatedAt" timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX ON "alert" ("isActive");

-- 7. Tabla Report (Reporte de problema)
CREATE TABLE IF NOT EXISTS "report" (
  "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  "userId" uuid REFERENCES "profiles"(id), -- Puede ser nulo si es anónimo
  "batchId" uuid NOT NULL REFERENCES "batch"(id),
  "type" "ReportType" NOT NULL,
  "description" text NOT NULL,
  "severity" "Severity" NOT NULL,
  "isAnonymous" boolean NOT NULL DEFAULT false,
  "status" "ReportStatus" NOT NULL DEFAULT 'PENDING',
  "photos" jsonb, -- Array de URLs de Supabase Storage
  "reviewedBy" text,
  "reviewNotes" text,
  "createdAt" timestamptz NOT NULL DEFAULT now(),
  "updatedAt" timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX ON "report" ("userId");
CREATE INDEX ON "report" ("status");

-- 8. Tabla ScanHistory (Historial de escaneos)
CREATE TABLE IF NOT EXISTS "scan_history" (
  "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  "userId" uuid NOT NULL REFERENCES "profiles"(id) ON DELETE CASCADE,
  "batchId" uuid NOT NULL REFERENCES "batch"(id),
  "result" "ScanResult" NOT NULL,
  "deviceInfo" jsonb,
  "scannedAt" timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX ON "scan_history" ("userId");
CREATE INDEX ON "scan_history" ("scannedAt" DESC);

-- 9. Tabla NotificationSettings (Configuración de notificaciones)
CREATE TABLE IF NOT EXISTS "notification_settings" (
  "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  "userId" uuid NOT NULL UNIQUE REFERENCES "profiles"(id) ON DELETE CASCADE,
  "allNotifications" boolean NOT NULL DEFAULT true,
  "criticalAlerts" boolean NOT NULL DEFAULT true,
  "warnings" boolean NOT NULL DEFAULT true,
  "infoAlerts" boolean NOT NULL DEFAULT false,
  "scanResults" boolean NOT NULL DEFAULT true,
  "reportUpdates" boolean NOT NULL DEFAULT true,
  "soundEnabled" boolean NOT NULL DEFAULT true,
  "vibrationEnabled" boolean NOT NULL DEFAULT true,
  "notificationTone" text,
  "emailNotifications" boolean NOT NULL DEFAULT false,
  "quietHoursStart" text, -- "22:00"
  "quietHoursEnd" text,   -- "08:00"
  "fcmToken" text,
  "apnsToken" text,
  "createdAt" timestamptz NOT NULL DEFAULT now(),
  "updatedAt" timestamptz NOT NULL DEFAULT now()
);

-- 10. Tabla UserSettings (Configuración general)
CREATE TABLE IF NOT EXISTS "user_settings" (
  "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  "userId" uuid NOT NULL UNIQUE REFERENCES "profiles"(id) ON DELETE CASCADE,
  "darkMode" boolean NOT NULL DEFAULT false,
  "language" text NOT NULL DEFAULT 'es',
  "biometricsEnabled" boolean NOT NULL DEFAULT false,
  "autoSync" boolean NOT NULL DEFAULT true,
  "dataUsageConsent" boolean NOT NULL DEFAULT false,
  "analyticsEnabled" boolean NOT NULL DEFAULT false,
  "createdAt" timestamptz NOT NULL DEFAULT now(),
  "updatedAt" timestamptz NOT NULL DEFAULT now()
);

# ===============================================
# 3. TRIGGERS DE AUTENTICACIÓN
# ===============================================
#
# Script SQL para vincular la tabla `auth.users` de Supabase
# con nuestras tablas públicas `profiles`, `user_settings` y
# `notification_settings`.
#

-- 1. Función que se ejecuta después de un nuevo registro
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Inserta una nueva fila en la tabla 'profiles'
  INSERT INTO public.profiles (id, email, name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', 'Usuario') -- Toma el 'name' si se proveyó en el registro
  );

  -- Inserta configuraciones por defecto para el nuevo usuario
  INSERT INTO public.user_settings ("userId")
  VALUES (NEW.id);

  INSERT INTO public.notification_settings ("userId")
  VALUES (NEW.id);

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Trigger que llama a la función después de cada INSERT en auth.users
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

# ===============================================
# 4. POLÍTICAS DE SEGURIDAD (ROW LEVEL SECURITY - RLS)
# ===============================================
#
# Estas son las reglas SQL que protegen la data.
# RLS está HABILITADO en todas las tablas.
#
# --- Helper Function (Opcional, pero recomendada) ---
# Esta función permite a otras políticas comprobar el rol del usuario de forma segura.
#
# CREATE OR REPLACE FUNCTION get_my_role()
# RETURNS "Role" AS $$
# DECLARE
#   user_role "Role";
# BEGIN
#   SELECT role INTO user_role FROM public.profiles WHERE id = auth.uid() LIMIT 1;
#   RETURN user_role;
# END;
# $$ LANGUAGE plpgsql SECURITY DEFINER;
#

--- 1. profiles ---
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Usuarios pueden ver su propio perfil." ON public.profiles
  FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "Usuarios pueden actualizar su propio perfil." ON public.profiles
  FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

--- 2. medicine ---
ALTER TABLE public.medicine ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Usuarios autenticados pueden leer medicinas." ON public.medicine
  FOR SELECT TO authenticated USING (true);
-- (Las políticas de INSERT/UPDATE/DELETE para 'ADMIN' se pueden añadir aquí)
-- CREATE POLICY "Admins pueden gestionar medicinas." ON public.medicine
--   FOR ALL TO authenticated USING (get_my_role() = 'ADMIN') WITH CHECK (get_my_role() = 'ADMIN');

--- 3. batch ---
ALTER TABLE public.batch ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Usuarios autenticados pueden leer lotes." ON public.batch
  FOR SELECT TO authenticated USING (true);
-- (Políticas de Admin para gestión)

--- 4. traceability_step ---
ALTER TABLE public.traceability_step ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Usuarios autenticados pueden leer trazabilidad." ON public.traceability_step
  FOR SELECT TO authenticated USING (true);

--- 5. alert ---
ALTER TABLE public.alert ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Usuarios autenticados pueden leer alertas." ON public.alert
  FOR SELECT TO authenticated USING (true);

--- 6. report ---
ALTER TABLE public.report ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Usuarios pueden crear reportes." ON public.report
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = "userId" OR "isAnonymous" = true);
CREATE POLICY "Usuarios pueden ver sus propios reportes." ON public.report
  FOR SELECT TO authenticated USING (auth.uid() = "userId");

--- 7. scan_history ---
ALTER TABLE public.scan_history ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Usuarios pueden ver su propio historial." ON public.scan_history
  FOR SELECT TO authenticated USING (auth.uid() = "userId");
-- NOTA: El INSERT se realiza a través de la Edge Function (scan-batch)
-- que utiliza la SERVICE_ROLE_KEY, por lo que bypasses RLS.

--- 8. notification_settings ---
ALTER TABLE public.notification_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Usuarios pueden leer su config de notificaciones." ON public.notification_settings
  FOR SELECT TO authenticated USING (auth.uid() = "userId");
CREATE POLICY "Usuarios pueden actualizar su config de notificaciones." ON public.notification_settings
  FOR UPDATE TO authenticated USING (auth.uid() = "userId") WITH CHECK (auth.uid() = "userId");

--- 9. user_settings ---
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Usuarios pueden leer su config de usuario." ON public.user_settings
  FOR SELECT TO authenticated USING (auth.uid() = "userId");
CREATE POLICY "Usuarios pueden actualizar su config de usuario." ON public.user_settings
  FOR UPDATE TO authenticated USING (auth.uid() = "userId") WITH CHECK (auth.uid() = "userId");


# ===============================================
# 5. CONFIGURACIÓN DE STORAGE (ALMACENAMIENTO)
# ===============================================
#
# Bucket Creado:
# - Nombre: report_photos
# - Acceso: Público (Public: true)
#   (Esto permite que las URLs sean vistas sin tokens, pero RLS sigue
#   controlando la subida y la lista de archivos).
#
# --- Políticas RLS para Storage (SQL) ---

CREATE POLICY "Usuarios autenticados pueden ver fotos." ON storage.objects
  FOR SELECT TO authenticated USING (bucket_id = 'report_photos');

CREATE POLICY "Usuarios autenticados pueden subir fotos de reportes." ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (
    bucket_id = 'report_photos' AND
    auth.role() = 'authenticated'
  );

CREATE POLICY "Usuarios pueden actualizar sus propias fotos." ON storage.objects
  FOR UPDATE TO authenticated USING (
    bucket_id = 'report_photos' AND
    auth.uid() = owner
  );
  
CREATE POLICY "Usuarios pueden borrar sus propias fotos." ON storage.objects
  FOR DELETE TO authenticated USING (
    bucket_id = 'report_photos' AND
    auth.uid() = owner
  );


# ===============================================
# 6. CÓDIGO DE EDGE FUNCTIONS (SERVERLESS)
# ===============================================
#
# Código fuente completo de las funciones desplegadas.
#
# --- Archivo 1: supabase/functions/_shared/cors.ts ---

/**
 * Encabezados CORS para permitir solicitudes desde cualquier origen.
 * Ajusta 'Access-Control-Allow-Origin' a tu dominio de frontend en producción
 * por seguridad.
 */
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}


# --- Archivo 2: supabase/functions/scan-batch/index.ts ---

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

console.log('Función "scan-batch" iniciada')

Deno.serve(async (req) => {
  // Manejo de la solicitud 'preflight' de CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // 1. Obtener el qrCode del body y el token del header
    const { qrCode } = await req.json()
    const authHeader = req.headers.get('Authorization')!

    if (!qrCode) {
      throw new Error('El "qrCode" es requerido en el body')
    }
    if (!authHeader) {
      throw new Error('El header "Authorization" es requerido')
    }

    // 2. Crear el cliente Admin (con SERVICE_ROLE)
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    )

    // 3. Crear el cliente de Usuario (para obtener su ID)
    const supabaseUser = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } },
    )

    // 4. Obtener el ID del usuario autenticado
    const { data: { user }, error: userError } = await supabaseUser.auth.getUser()
    if (userError || !user) {
      throw new Error('Usuario no autenticado. Token inválido.')
    }

    console.log(`Usuario ${user.id} escaneando QR: ${qrCode}`)

    // 5. Buscar el Lote, Medicina, Trazabilidad y Alertas Activas
    const { data: batch, error: batchError } = await supabaseAdmin
      .from('batch')
      .select(
        `
        *,
        medicine:medicineId (*),
        trace_steps:traceability_step (
          *,
          order:step
        ),
        alerts:alert!batchId (
          *,
          medicine:medicineId (*),
          batch:batchId (*)
        )
      `,
      )
      .eq('qrCode', qrCode)
      .eq('alerts.isActive', true) // Solo trae alertas activas
      .single()

    if (batchError) {
      console.error('Error al buscar el lote:', batchError.message)
      // Si el error es "PGRST116" (no se encontró fila), es un 404
      if (batchError.code === 'PGRST116') {
        return new Response(JSON.stringify({ error: 'Lote no encontrado' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 404,
        })
      }
      throw new Error('Error en la base de datos al buscar el lote.')
    }
    
    if (!batch) {
      return new Response(JSON.stringify({ error: 'Lote no encontrado' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 404,
      })
    }

    // 6. Determinar el resultado del escaneo
    let scanResult: 'SAFE' | 'ALERT' | 'WARNING' = 'SAFE'
    
    if (batch.status === 'WITHDRAWN' || batch.status === 'ALERT') {
      scanResult = 'ALERT'
    } 
    else if (batch.alerts && batch.alerts.length > 0) {
      scanResult = 'ALERT'
    }
    else if (batch.status === 'WARNING') {
      scanResult = 'WARNING'
    }

    console.log(`Lote ${batch.id} determinado como: ${scanResult}`)

    // 7. Registrar en el historial (No bloqueamos la respuesta)
    supabaseAdmin
      .from('scan_history')
      .insert({
        userId: user.id,
        batchId: batch.id,
        result: scanResult,
      })
      .then(({ error: scanError }) => {
        if (scanError) {
          console.error('Error al guardar historial de escaneo:', scanError.message)
        } else {
          console.log(`Historial guardado para usuario ${user.id}`)
        }
      })

    // 8. Devolver la respuesta completa al frontend
    return new Response(
      JSON.stringify({
        ...batch,
        scanResult, // Añadimos el resultado calculado
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    console.error('Error inesperado:', error.message)
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})


# --- Archivo 3: supabase/functions/get-user-stats/index.ts ---

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

console.log('Función "get-user-stats" iniciada')

Deno.serve(async (req) => {
  // Manejo de la solicitud 'preflight' de CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // 1. Obtener el token del header
    const authHeader = req.headers.get('Authorization')!
    if (!authHeader) {
      throw new Error('El header "Authorization" es requerido')
    }

    // 2. Crear el cliente de Usuario (para obtener su ID)
    const supabaseUser = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } },
    )

    // 3. Obtener el ID del usuario autenticado
    const { data: { user }, error: userError } = await supabaseUser.auth.getUser()
    if (userError || !user) {
      throw new Error('Usuario no autenticado. Token inválido.')
    }

    // 4. Crear el cliente Admin (para contar eficientemente)
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    )

    console.log(`Calculando stats para usuario ${user.id}`)

    // 5. Ejecutar todas las consultas de conteo en paralelo
    const [verifiedRes, reportsRes, alertsRes] = await Promise.all([
      // a) Contar escaneos verificados del usuario
      supabaseAdmin
        .from('scan_history')
        .select('id', { count: 'exact', head: true })
        .eq('userId', user.id),
      
      // b) Contar reportes hechos por el usuario
      supabaseAdmin
        .from('report')
        .select('id', { count: 'exact', head: true })
        .eq('userId', user.id),
      
      // c) Contar TODAS las alertas activas en el sistema
      supabaseAdmin
        .from('alert')
        .select('id', { count: 'exact', head: true })
        .eq('isActive', true),
    ])

    // 6. Manejar errores de las consultas
    if (verifiedRes.error) throw new Error(`Error contando escaneos: ${verifiedRes.error.message}`)
    if (reportsRes.error) throw new Error(`Error contando reportes: ${reportsRes.error.message}`)
    if (alertsRes.error) throw new Error(`Error contando alertas: ${alertsRes.error.message}`)

    // 7. Construir la respuesta
    const stats = {
      verified: verifiedRes.count ?? 0,
      reports: reportsRes.count ?? 0,
      alerts: alertsRes.count ?? 0,
    }

    console.log(`Stats calculadas:`, stats)

    // 8. Devolver la respuesta
    return new Response(JSON.stringify(stats), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
    
  } catch (error) {
    console.error('Error inesperado:', error.message)
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})


# ===============================================
# 7. GUÍA DE INTEGRACIÓN (FRONTEND)
# ===============================================
#
# Snippets de código clave para usar en React Native.
#
# --- Inicialización (src/lib/supabase.ts) ---
#
# import 'react-native-url-polyfill/auto'
# import AsyncStorage from '@react-native-async-storage/async-storage'
# import { createClient } from '@supabase/supabase-js'
#
# const SUPABASE_URL = 'https://lyssfnzlhmvhlnuwdqxj.supabase.co'
# const SUPABASE_ANON_KEY = '<TU_CLAVE_ANON_PUBLIC>' 
#
# export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
#   auth: {
#     storage: AsyncStorage,
#     autoRefreshToken: true,
#     persistSession: true,
#     detectSessionInUrl: false,
#   },
# })
#
#
# --- Autenticación (Registro) ---
#
# const { data, error } = await supabase.auth.signUp({
#   email: 'test@email.com',
#   password: 'tu-password',
#   options: {
#     data: {
#       name: 'Nombre de Usuario' // Se pasa al trigger handle_new_user
#     }
#   }
# });
#
#
# --- Autenticación (Login) ---
#
# const { data, error } = await supabase.auth.signInWithPassword({
#   email: 'test@email.com',
#   password: 'tu-password',
# });
#
#
# --- Leer Datos (Ej: Alertas Activas) ---
#
# const { data, error } = await supabase
#   .from('alert')
#   .select('*')
#   .eq('isActive', true)
#   .order('publishedAt', { ascending: false });
#
# // 'data' es un array de alertas
#
#
# --- Leer Datos con JOIN (Ej: Perfil + Settings) ---
#
# const { data: { user } } = await supabase.auth.getUser();
# const { data, error } = await supabase
#   .from('profiles')
#   .select(`
#     *,
#     user_settings (*),
#     notification_settings (*)
#   `)
#   .eq('id', user.id)
#   .single();
#
# // 'data' es un objeto con el perfil y sus settings anidados
#
#
# --- Invocar Edge Function (Escanear QR) ---
#
# const { data, error } = await supabase.functions.invoke('scan-batch', {
#   body: { qrCode: 'QR-ESCANEADO-AQUI' },
# });
#
# // 'data' es el objeto completo: { batch, medicine, trace_steps, alerts, scanResult }
# // 'error' capturará el 404 si el lote no existe
#
#
# --- Invocar Edge Function (Stats) ---
#
# const { data, error } = await supabase.functions.invoke('get-user-stats');
#
# // 'data' es el objeto: { verified: 0, reports: 0, alerts: 0 }
#
#
# --- Subir Archivo (Storage) ---
#
# // 'file' es el objeto de imagen desde el image picker
# const { data, error } = await supabase
#   .storage
#   .from('report_photos')
#   .upload(`public/${Date.now()}_${fileName}`, file, {
#     cacheControl: '3600',
#     upsert: false,
#     contentType: file.type
#   });
#
# // 'data.path' te da la ruta para guardar en la tabla 'report'
# const { data: urlData } = supabase
#   .storage
#   .from('report_photos')
#   .getPublicUrl(data.path);
# 
# const publicUrl = urlData.publicUrl;
#
#
# --- Insertar Reporte con Foto ---
#
# const { data, error } = await supabase
#   .from('report')
#   .insert({
#     userId: user.id,
#     batchId: '...',
#     type: 'QUALITY_ISSUE',
#     description: '...',
#     severity: 'MODERATE',
#     photos: [publicUrl] // URL de la foto subida
#   });
#
# ===============================================
# FIN DEL DOCUMENTO
# ===============================================
