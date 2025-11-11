# 🚀 Guía de Configuración de Supabase para MedTrace

Esta guía te ayudará a crear tu propio proyecto de Supabase para testear MedTrace de forma independiente.

---

## 📋 Pasos para Configurar tu Proyecto

### 1️⃣ Crear el Proyecto en Supabase

1. Ve a **https://app.supabase.com**
2. Inicia sesión con tu cuenta (o crea una nueva)
3. Haz clic en **"New Project"**
4. Completa los datos:
   - **Name**: `medtrace-test` (o el nombre que prefieras)
   - **Database Password**: Elige una contraseña segura (guárdala, la necesitarás)
   - **Region**: Elige la más cercana a tu ubicación (ej: `South America (São Paulo)`)
   - **Pricing Plan**: Elige `Free` para testing
5. Haz clic en **"Create new project"**
6. Espera 2-3 minutos mientras Supabase crea tu proyecto

---

### 2️⃣ Crear la Base de Datos

1. Una vez creado el proyecto, ve al menú lateral izquierdo
2. Haz clic en **"SQL Editor"** (icono de terminal/código)
3. Haz clic en **"New query"**
4. Abre el archivo `DATABASE_SCHEMA.sql` en VS Code
5. **Copia TODO el contenido** del archivo
6. **Pégalo** en el SQL Editor de Supabase
7. Haz clic en el botón **"Run"** (o presiona `Ctrl+Enter`)
8. Verás un mensaje de éxito: ✅ "Success. No rows returned"

---

### 3️⃣ Aplicar Políticas de Administrador

1. En el SQL Editor, crea una **nueva query**
2. Abre el archivo `ADMIN_RLS_POLICIES.sql` en VS Code
3. **Copia TODO el contenido** del archivo
4. **Pégalo** en el SQL Editor
5. Haz clic en **"Run"**
6. Verás confirmación de que las políticas se crearon correctamente

---

### 4️⃣ Configurar el Storage (para fotos de reportes)

1. Ve al menú lateral y haz clic en **"Storage"**
2. Haz clic en **"Create a new bucket"**
3. Completa los datos:
   - **Name**: `report_photos`
   - **Public bucket**: ✅ **Activa esta opción** (toggle a ON)
4. Haz clic en **"Create bucket"**
5. Haz clic en el bucket recién creado
6. Ve a la pestaña **"Policies"**
7. Haz clic en **"New policy"**
8. Elige **"Custom policy"**
9. Configura la política para subir fotos:
   - **Policy name**: `Usuarios pueden subir fotos`
   - **Allowed operation**: `INSERT`
   - **Target roles**: `authenticated`
   - **USING expression**: 
     ```sql
     bucket_id = 'report_photos' AND auth.uid()::text = (storage.foldername(name))[1]
     ```
10. Haz clic en **"Review"** y luego **"Save policy"**
11. Crea otra política para ver fotos:
    - **Policy name**: `Todos pueden ver fotos`
    - **Allowed operation**: `SELECT`
    - **Target roles**: `authenticated`, `anon`
    - **USING expression**: 
      ```sql
      bucket_id = 'report_photos'
      ```
12. Guarda esta política también

---

### 5️⃣ Crear un Usuario Administrador

1. Abre tu app MedTrace en el emulador/dispositivo
2. Regístrate con un usuario nuevo (por ejemplo: `admin@test.com`)
3. Ve al **SQL Editor** de Supabase
4. Crea una nueva query y ejecuta:
   ```sql
   UPDATE public.profiles 
   SET role = 'ADMIN' 
   WHERE email = 'admin@test.com';
   ```
   (Reemplaza `admin@test.com` con el email que usaste)
5. Verifica que funcionó:
   ```sql
   SELECT id, name, email, role 
   FROM public.profiles 
   WHERE email = 'admin@test.com';
   ```
6. Deberías ver `role: ADMIN` en el resultado

---

### 6️⃣ Obtener las Credenciales del Proyecto

1. Ve al menú lateral y haz clic en **"Settings"** (engranaje)
2. En el submenú, haz clic en **"API"**
3. Verás dos datos importantes:

#### 📌 **Project URL**
```
https://tu-proyecto-id.supabase.co
```
Copia esta URL completa.

#### 📌 **anon public key**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBh...
```
Copia esta clave (es muy larga, asegúrate de copiarla completa).

---

### 7️⃣ Configurar tu Frontend

1. En VS Code, abre el archivo `.env` en la raíz de tu proyecto
2. Si no existe, créalo
3. Reemplaza o agrega estas líneas con tus credenciales:

```env
EXPO_PUBLIC_SUPABASE_URL=https://tu-proyecto-id.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBh...
```

4. Guarda el archivo
5. **IMPORTANTE**: Reinicia tu servidor de desarrollo:
   ```bash
   # Detén el servidor actual (Ctrl+C)
   # Luego reinícialo
   npm start
   ```

---

### 8️⃣ Verificar que Todo Funciona

#### ✅ **Test 1: Registro e Inicio de Sesión**
1. Abre la app
2. Regístrate con un usuario nuevo
3. Deberías poder iniciar sesión correctamente

#### ✅ **Test 2: Escanear QR**
1. Ve a la pantalla principal
2. Haz clic en "Escanear"
3. Escanea un código QR de prueba
4. Deberías ver el resultado (aunque probablemente no haya lotes en la BD aún)

#### ✅ **Test 3: Perfil de Administrador**
1. Inicia sesión con el usuario que convertiste en ADMIN
2. Ve a la pantalla de Perfil
3. Deberías ver el botón **"Gestionar Reportes"**
4. Haz clic y verifica que se abre la pantalla de administrador

#### ✅ **Test 4: Crear un Reporte**
1. Ve a "Reportar Problema"
2. Intenta crear un reporte (aunque no haya lotes, puedes probar la UI)
3. Sube una foto de prueba
4. Verifica que la foto se sube al Storage de Supabase

---

## 🗂️ Agregar Datos de Prueba (Opcional)

Si quieres probar con medicamentos y lotes de ejemplo:

1. Ve al **SQL Editor**
2. Ejecuta este script:

```sql
-- Insertar medicamento de prueba
INSERT INTO public.medicine (name, dosage, laboratory, "anmatRegistry", description, "activeIngredient")
VALUES 
  ('Ibuprofeno', '400mg', 'Laboratorio XYZ', 'ANMAT-12345', 'Analgésico y antiinflamatorio', 'Ibuprofeno'),
  ('Paracetamol', '500mg', 'Laboratorio ABC', 'ANMAT-67890', 'Analgésico y antipirético', 'Paracetamol');

-- Insertar lote de prueba
INSERT INTO public.batch ("medicineId", "batchNumber", "qrCode", "expirationDate", "manufacturingDate", status)
SELECT 
  id, 
  'LOTE-2024-001', 
  'QR-IBU-2024-001', 
  '2026-12-31', 
  '2024-01-15',
  'SAFE'
FROM public.medicine WHERE "anmatRegistry" = 'ANMAT-12345';

-- Insertar alerta de prueba
INSERT INTO public.alert (type, title, message, reason, "isActive", "medicineId")
SELECT 
  'WARNING',
  'Advertencia: Escasez de Ibuprofeno 400mg',
  'Se ha detectado escasez temporal en el mercado. No hay riesgos de seguridad.',
  'Problemas de producción',
  true,
  id
FROM public.medicine WHERE "anmatRegistry" = 'ANMAT-12345';
```

3. Ahora tendrás datos para probar escaneos y alertas

---

## 🔒 Seguridad y Buenas Prácticas

### ⚠️ **IMPORTANTE**:
- **NUNCA** compartas tu `EXPO_PUBLIC_SUPABASE_ANON_KEY` públicamente
- **NUNCA** subas el archivo `.env` a GitHub (ya está en `.gitignore`)
- La clave `anon` es segura para usar en el frontend gracias a RLS
- Solo los administradores (con `role='ADMIN'`) pueden gestionar reportes y alertas
- Los usuarios normales solo pueden ver sus propios datos

### 🛡️ **RLS (Row Level Security)**:
Todas las tablas tienen RLS habilitado, lo que significa:
- Los usuarios solo ven sus propios reportes
- Los usuarios solo ven su propio historial de escaneos
- Los administradores tienen permisos especiales (definidos en `ADMIN_RLS_POLICIES.sql`)
- No se puede modificar el rol desde la app (solo desde SQL)

---

## 📞 Solución de Problemas

### ❌ Error: "Invalid API key"
- Verifica que copiaste la clave completa (es muy larga)
- Asegúrate de que no haya espacios al inicio o final
- Reinicia el servidor de desarrollo

### ❌ Error: "Failed to fetch"
- Verifica que la URL del proyecto sea correcta
- Asegúrate de que el proyecto esté activo en Supabase
- Verifica tu conexión a internet

### ❌ No aparece el botón "Gestionar Reportes"
- Verifica que ejecutaste el UPDATE para cambiar el role a 'ADMIN'
- Cierra sesión y vuelve a iniciar sesión
- Verifica en SQL Editor: `SELECT role FROM profiles WHERE email = 'tu-email';`

### ❌ Error al subir fotos
- Verifica que creaste el bucket `report_photos`
- Verifica que el bucket sea público
- Verifica que las políticas de Storage estén configuradas correctamente

---

## 🎉 ¡Listo!

Tu proyecto de Supabase está configurado y listo para testear MedTrace.

Ahora puedes:
- ✅ Registrar usuarios
- ✅ Escanear códigos QR
- ✅ Crear reportes con fotos
- ✅ Ver alertas sanitarias
- ✅ Gestionar reportes como administrador
- ✅ Probar todas las funcionalidades de forma independiente

---

## 📚 Recursos Adicionales

- **Documentación de Supabase**: https://supabase.com/docs
- **Políticas RLS**: https://supabase.com/docs/guides/auth/row-level-security
- **Storage**: https://supabase.com/docs/guides/storage
- **SQL Editor**: https://supabase.com/docs/guides/database/overview

---

**Nota**: Esta configuración es para desarrollo/testing. Para producción, deberás usar el proyecto original de tu equipo.
