export type Role = 'USER' | 'GUEST' | 'ADMIN';
export type MedicineStatus = 'ACTIVE' | 'WITHDRAWN' | 'DISCONTINUED';
export type BatchStatus = 'SAFE' | 'ALERT' | 'WARNING' | 'WITHDRAWN';
export type StepStatus = 'COMPLETED' | 'PENDING';
export type AlertType = 'CRITICAL' | 'WARNING' | 'INFO';
export type ReportType = 'ADVERSE_EFFECT' | 'QUALITY_ISSUE' | 'COUNTERFEIT';
export type Severity = 'MILD' | 'MODERATE' | 'SEVERE';
export type ReportStatus = 'PENDING' | 'REVIEWING' | 'RESOLVED' | 'REJECTED';
export type ScanResult = 'SAFE' | 'ALERT' | 'WARNING';

export interface Profile {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  role: Role;
  isEmailVerified: boolean;
  lastLoginAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationSettings {
  id: string;
  userId: string;
  allNotifications: boolean;
  criticalAlerts: boolean;
  warnings: boolean;
  infoAlerts: boolean;
  scanResults: boolean;
  reportUpdates: boolean;
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  notificationTone?: string | null;
  emailNotifications: boolean;
  quietHoursStart?: string | null;
  quietHoursEnd?: string | null;
  fcmToken?: string | null;
  apnsToken?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface UserSettings {
  id: string;
  userId: string;
  darkMode: boolean;
  language: string;
  biometricsEnabled: boolean;
  autoSync: boolean;
  dataUsageConsent: boolean;
  analyticsEnabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TraceabilityStep {
  id: string;
  batchId: string;
  step: number;
  title: string;
  description: string;
  location: string;
  timestamp: string;
  status: StepStatus;
  verifiedBy?: string | null;
  createdAt: string;
}

export interface MedicineRecord {
  id: string;
  name: string;
  dosage: string;
  laboratory: string;
  anmatRegistry: string;
  description?: string | null;
  activeIngredient?: string | null;
  status: MedicineStatus;
  createdAt: string;
  updatedAt: string;
}

export interface AlertRecord {
  id: string;
  type: AlertType;
  title: string;
  message: string;
  reason?: string | null;
  recommendations?: string[] | null;
  medicineId?: string | null;
  batchId?: string | null;
  isActive: boolean;
  publishedAt: string;
  expiresAt?: string | null;
  officialDocumentUrl?: string | null;
  contactInfo?: {
    phone?: string;
    email?: string;
    website?: string;
  } | null;
  createdAt: string;
  updatedAt: string;
  medicine?: MedicineRecord | null;
  batch?: BatchRecord | null;
}

export interface BatchRecord {
  id: string;
  medicineId: string;
  batchNumber: string;
  qrCode: string;
  expirationDate: string;
  manufacturingDate: string;
  status: BatchStatus;
  blockchainHash?: string | null;
  createdAt: string;
  updatedAt: string;
  medicine?: MedicineRecord | null;
  trace_steps?: TraceabilityStep[] | null;
  alerts?: AlertRecord[] | null;
  scanResult?: ScanResult;
}

export interface ScanHistoryEntry {
  id: string;
  userId: string;
  batchId: string;
  result: ScanResult;
  deviceInfo?: Record<string, any> | null;
  scannedAt: string;
  batch?: BatchRecord | null;
}

export interface ReportRecord {
  id: string;
  userId?: string | null;
  batchId: string;
  type: ReportType;
  description: string;
  severity: Severity;
  isAnonymous: boolean;
  status: ReportStatus;
  photos?: string[] | null;
  reviewedBy?: string | null;
  reviewNotes?: string | null;
  createdAt: string;
  updatedAt: string;
  batch?: BatchRecord | null;
  reviewer?: {
    id: string;
    name: string;
  } | null;
  reporter?: {
    id: string;
    name: string;
    email: string;
  } | null;
}

export interface UserStats {
  verified: number;
  alerts: number;
  reports: number;
}

export type RootStackParamList = {
  // Auth stack
  Onboarding: undefined;
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  VerifyCode: { email: string } | undefined;
  ResetPassword: { accessToken?: string } | undefined;
  PasswordSuccess: { email: string } | undefined;

  // App stack
  MainTabs: undefined;
  Scanner: undefined;
  ScanResultSafe: { batch: BatchRecord };
  ScanResultAlert: { batch: BatchRecord };
  Report: { batchId?: string; presetMedicine?: string; presetBatchNumber?: string } | undefined;
  MyReports: undefined;
  ReportDetail: { reportId: string };
  AdminReports: undefined;
  CreateAlert: { reportId?: string; batchId?: string } | undefined;
  Alerts: undefined;
  AlertDetail: { alertId: string };
  Settings: undefined;
  EditProfile: undefined;
  ChangePassword: undefined;
  NotificationsSettings: undefined;
  Privacy: undefined;
  Help: undefined;
  About: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Scan: undefined;
  Profile: undefined;
};
