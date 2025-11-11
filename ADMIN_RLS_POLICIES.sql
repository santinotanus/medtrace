# ===============================================
# POLÍTICAS RLS PARA ADMINISTRADORES
# ===============================================
#
# Script SQL para ejecutar en Supabase SQL Editor
# Estas políticas permiten que usuarios con role='ADMIN'
# puedan ver y gestionar todos los reportes del sistema.
#

-- 1. Política para que ADMINS vean todos los reportes
CREATE POLICY "Admins pueden ver todos los reportes" 
  ON public.report 
  FOR SELECT 
  TO authenticated 
  USING (
    EXISTS (
      SELECT 1 
      FROM public.profiles 
      WHERE id = auth.uid() AND role = 'ADMIN'
    )
  );

-- 2. Política para que ADMINS actualicen cualquier reporte
CREATE POLICY "Admins pueden actualizar cualquier reporte" 
  ON public.report 
  FOR UPDATE 
  TO authenticated 
  USING (
    EXISTS (
      SELECT 1 
      FROM public.profiles 
      WHERE id = auth.uid() AND role = 'ADMIN'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 
      FROM public.profiles 
      WHERE id = auth.uid() AND role = 'ADMIN'
    )
  );

-- 3. Política para que ADMINS puedan crear alertas
CREATE POLICY "Admins pueden crear alertas" 
  ON public.alert 
  FOR INSERT 
  TO authenticated 
  WITH CHECK (
    EXISTS (
      SELECT 1 
      FROM public.profiles 
      WHERE id = auth.uid() AND role = 'ADMIN'
    )
  );

-- 4. Política para que ADMINS puedan actualizar alertas
CREATE POLICY "Admins pueden actualizar alertas" 
  ON public.alert 
  FOR UPDATE 
  TO authenticated 
  USING (
    EXISTS (
      SELECT 1 
      FROM public.profiles 
      WHERE id = auth.uid() AND role = 'ADMIN'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 
      FROM public.profiles 
      WHERE id = auth.uid() AND role = 'ADMIN'
    )
  );

-- 5. Política para que ADMINS puedan desactivar alertas
CREATE POLICY "Admins pueden desactivar alertas" 
  ON public.alert 
  FOR UPDATE 
  TO authenticated 
  USING (
    EXISTS (
      SELECT 1 
      FROM public.profiles 
      WHERE id = auth.uid() AND role = 'ADMIN'
    )
  );

-- 6. (OPCIONAL) Política para que ADMINS gestionen medicamentos
CREATE POLICY "Admins pueden gestionar medicinas" 
  ON public.medicine 
  FOR ALL 
  TO authenticated 
  USING (
    EXISTS (
      SELECT 1 
      FROM public.profiles 
      WHERE id = auth.uid() AND role = 'ADMIN'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 
      FROM public.profiles 
      WHERE id = auth.uid() AND role = 'ADMIN'
    )
  );

-- 7. (OPCIONAL) Política para que ADMINS gestionen lotes
CREATE POLICY "Admins pueden gestionar lotes" 
  ON public.batch 
  FOR ALL 
  TO authenticated 
  USING (
    EXISTS (
      SELECT 1 
      FROM public.profiles 
      WHERE id = auth.uid() AND role = 'ADMIN'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 
      FROM public.profiles 
      WHERE id = auth.uid() AND role = 'ADMIN'
    )
  );

-- ===============================================
# CÓMO ASIGNAR ROL ADMIN A UN USUARIO
# ===============================================
#
# Ejecuta esta consulta reemplazando el email del usuario
# que quieras convertir en administrador:
#

UPDATE public.profiles 
SET role = 'ADMIN' 
WHERE email = 'tu-email@ejemplo.com';

-- Verificar que el cambio se aplicó correctamente:
SELECT id, name, email, role 
FROM public.profiles 
WHERE email = 'tu-email@ejemplo.com';

-- ===============================================
# NOTAS IMPORTANTES
# ===============================================
#
# 1. Estas políticas se SUMAN a las existentes, no las reemplazan.
#
# 2. Un usuario ADMIN puede:
#    - Ver todos los reportes (no solo los suyos)
#    - Cambiar estado de reportes (PENDING → REVIEWING → RESOLVED/REJECTED)
#    - Agregar notas de revisión (reviewNotes)
#    - Crear alertas sanitarias
#    - Actualizar/desactivar alertas existentes
#    - (Opcional) Gestionar medicamentos y lotes
#
# 3. Las políticas para usuarios normales siguen funcionando:
#    - Los usuarios solo ven sus propios reportes
#    - Los usuarios pueden crear reportes
#    - Los usuarios pueden ver alertas activas
#
# 4. Para probar en desarrollo, crea un usuario admin:
#    a) Registra un usuario nuevo desde la app
#    b) Ve a Supabase SQL Editor
#    c) Ejecuta: UPDATE profiles SET role = 'ADMIN' WHERE email = 'admin@test.com';
#    d) Recarga la app y verás el botón "Gestionar Reportes" en el perfil
#
# 5. SEGURIDAD: El role está en la tabla profiles, NO en auth.users
#    Esto significa que solo se puede cambiar desde SQL (backend)
#    Un usuario malicioso NO puede cambiar su propio rol desde la app.
#
