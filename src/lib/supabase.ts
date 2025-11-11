import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL =
  process.env.EXPO_PUBLIC_SUPABASE_URL ?? 'https://lyssfnzlhmvhlnuwdqxj.supabase.co';
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? '';

if (!process.env.EXPO_PUBLIC_SUPABASE_URL) {
  console.warn('[Supabase] EXPO_PUBLIC_SUPABASE_URL no está definido. Se usará la URL por defecto del doc.');
}

if (!SUPABASE_ANON_KEY) {
  console.warn('[Supabase] Falta EXPO_PUBLIC_SUPABASE_ANON_KEY. Configura tu clave anon en .env para que la app funcione.');
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

export type SupabaseClientType = typeof supabase;
