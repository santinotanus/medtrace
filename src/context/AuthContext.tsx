import React, {
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import type {
  NotificationSettings,
  Profile,
  UserSettings,
} from '../types';

interface AuthContextValue {
  session: Session | null;
  profile: Profile | null;
  userSettings: UserSettings | null;
  notificationSettings: NotificationSettings | null;
  initializing: boolean;
  loadingProfile: boolean;
  isGuest: boolean;
  passwordRecoveryMode: boolean;
  enterGuestMode: () => Promise<void>;
  exitGuestMode: () => void;
  beginPasswordRecovery: () => void;
  finishPasswordRecovery: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  signOut: () => Promise<void>;
  updateNotificationSettings: (
    payload: Partial<NotificationSettings>,
  ) => Promise<void>;
  updateUserSettings: (payload: Partial<UserSettings>) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [userSettings, setUserSettingsState] = useState<UserSettings | null>(null);
  const [notificationSettings, setNotificationSettingsState] =
    useState<NotificationSettings | null>(null);
  const [initializing, setInitializing] = useState(true);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [isGuest, setIsGuest] = useState(false);
  const [passwordRecoveryMode, setPasswordRecoveryMode] = useState(false);

  const resetUserState = useCallback(() => {
    setProfile(null);
    setUserSettingsState(null);
    setNotificationSettingsState(null);
  }, []);

  const hydrateProfile = useCallback(async () => {
    if (!session?.user) {
      resetUserState();
      setLoadingProfile(false);
      setInitializing(false);
      return;
    }

    setLoadingProfile(true);
    const { data, error } = await supabase
      .from('profiles')
      .select(
        `
        id,
        name,
        email,
        phone,
        role,
        "isEmailVerified",
        "lastLoginAt",
        "createdAt",
        "updatedAt",
        user_settings (*),
        notification_settings (*)
      `,
      )
      .eq('id', session.user.id)
      .single();

    if (error) {
      console.error('[Auth] Error al cargar el perfil:', error.message);
    } else if (data) {
      const {
        user_settings: incomingUserSettings,
        notification_settings: incomingNotificationSettings,
        ...rest
      } = data as any;

      setProfile(rest);
      // Supabase devuelve arrays para las relaciones, tomar el primer elemento
      setUserSettingsState(
        Array.isArray(incomingUserSettings) && incomingUserSettings.length > 0
          ? incomingUserSettings[0]
          : null
      );
      setNotificationSettingsState(
        Array.isArray(incomingNotificationSettings) && incomingNotificationSettings.length > 0
          ? incomingNotificationSettings[0]
          : null
      );
    }

    setLoadingProfile(false);
    setInitializing(false);
  }, [session?.user, resetUserState]);

  useEffect(() => {
    let isMounted = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!isMounted) return;
      setSession(data.session);
      if (!data.session) {
        setInitializing(false);
        return;
      }
      setIsGuest(false);
    });

    const {
      data: authListener,
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      if (newSession) {
        setIsGuest(false);
      } else {
        resetUserState();
      }
    });

    return () => {
      isMounted = false;
      authListener.subscription.unsubscribe();
    };
  }, [resetUserState]);

  useEffect(() => {
    if (session) {
      hydrateProfile();
    }
  }, [session, hydrateProfile]);

  const performSignOut = useCallback(async () => {
    await supabase.auth.signOut();
    setSession(null);
    resetUserState();
  }, [resetUserState]);

  const enterGuestMode = useCallback(async () => {
    await performSignOut();
    setPasswordRecoveryMode(false);
    setIsGuest(true);
    setInitializing(false);
  }, [performSignOut]);

  const exitGuestMode = useCallback(() => {
    setIsGuest(false);
  }, []);

  const beginPasswordRecovery = useCallback(() => {
    setPasswordRecoveryMode(true);
  }, []);

  const finishPasswordRecovery = useCallback(async () => {
    setPasswordRecoveryMode(false);
    await performSignOut();
    setIsGuest(false);
  }, [performSignOut]);

  const refreshProfile = useCallback(async () => {
    await hydrateProfile();
  }, [hydrateProfile]);

  const signOut = useCallback(async () => {
    setPasswordRecoveryMode(false);
    setIsGuest(false);
    await performSignOut();
    setInitializing(false);
  }, [performSignOut]);

  const updateNotificationSettings = useCallback(
    async (payload: Partial<NotificationSettings>) => {
      if (!profile) return;
      
      // Usar upsert para crear el registro si no existe
      const { data, error } = await supabase
        .from('notification_settings')
        .upsert(
          { 
            userId: profile.id, 
            ...payload, 
            updatedAt: new Date().toISOString() 
          },
          { onConflict: 'userId' }
        )
        .select()
        .single();

      if (error) {
        console.error('[Auth] Error al actualizar notificaciones:', error.message);
        throw error;
      }

      setNotificationSettingsState(data as NotificationSettings);
    },
    [profile],
  );

  const updateUserSettings = useCallback(
    async (payload: Partial<UserSettings>) => {
      if (!profile) return;
      
      // Usar upsert para crear el registro si no existe
      const { data, error } = await supabase
        .from('user_settings')
        .upsert(
          { 
            userId: profile.id, 
            ...payload, 
            updatedAt: new Date().toISOString() 
          },
          { onConflict: 'userId' }
        )
        .select()
        .single();

      if (error) {
        console.error('[Auth] Error al actualizar settings:', error.message);
        throw error;
      }

      setUserSettingsState(data as UserSettings);
    },
    [profile],
  );

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      profile,
      userSettings,
      notificationSettings,
      initializing,
      loadingProfile,
      isGuest,
      passwordRecoveryMode,
      enterGuestMode,
      exitGuestMode,
      beginPasswordRecovery,
      finishPasswordRecovery,
      refreshProfile,
      signOut,
      updateNotificationSettings,
      updateUserSettings,
    }),
    [
      session,
      profile,
      userSettings,
      notificationSettings,
      initializing,
      loadingProfile,
      isGuest,
      passwordRecoveryMode,
      enterGuestMode,
      exitGuestMode,
      beginPasswordRecovery,
      finishPasswordRecovery,
      refreshProfile,
      signOut,
      updateNotificationSettings,
      updateUserSettings,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext debe usarse dentro de AuthProvider');
  }
  return context;
}
