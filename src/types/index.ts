export interface Medicine {
  id: string;
  name: string;
  dosage: string;
  laboratory: string;
  batch: string;
  expiration: string;
  anmatRegistry: string;
  status: 'safe' | 'alert' | 'warning';
}

export interface Alert {
  id: string;
  type: 'critical' | 'warning' | 'info';
  title: string;
  message: string;
  medicine?: string;
  batch?: string;
  timestamp: Date;
}

export interface Report {
  id: string;
  medicineId: string;
  type: 'adverse_effect' | 'quality_issue' | 'counterfeit';
  description: string;
  severity: 'mild' | 'moderate' | 'severe';
  isAnonymous: boolean;
  timestamp: Date;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  stats: {
    verified: number;
    alerts: number;
    reports: number;
  };
}

export interface TraceabilityStep {
  id: string;
  title: string;
  description: string;
  location: string;
  timestamp: Date;
  status: 'completed' | 'pending';
}

export type RootStackParamList = {
  Onboarding: undefined;
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  VerifyCode: undefined;
  ResetPassword: undefined;
  PasswordSuccess: undefined;

  MainTabs: { guest?: boolean } | undefined;

  // Modales / resultados
  Scanner: undefined;
  ScanResultSafe: undefined;
  ScanResultAlert: undefined;

  // App
  Report: undefined;
  Alerts: undefined;
  AlertDetail: undefined;

  Settings: undefined;
  NotificationsSettings: undefined;
  Privacy: undefined;
  Help: undefined;
  About: undefined;

  // History: undefined;

  Logout: undefined;
};

export type MainTabParamList = {
  Home: { guest?: boolean } | undefined;
  Scan: undefined;
  Profile: undefined;
};