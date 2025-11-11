import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { RootStackParamList, MainTabParamList } from '../types';
import { COLORS } from '../constants/theme';
import { useAuth } from '../hooks/useAuth';

// Auth Screens
import OnboardingScreen from '../screens/auth/OnboardingScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import ForgotPasswordScreen from '../screens/auth/ForgotPasswordScreen';
import VerifyCodeScreen from '../screens/auth/VerifyCodeScreen';
import ResetPasswordScreen from '../screens/auth/ResetPasswordScreen';
import PasswordSuccessScreen from '../screens/auth/PasswordSuccessScreen';

// App Screens
import HomeScreen from '../screens/app/HomeScreen';
import ScannerScreen from '../screens/app/ScannerScreen';
import ProfileScreen from '../screens/app/ProfileScreen';
import ScanResultSafeScreen from '../screens/app/ScanResultSafeScreen';
import ScanResultAlertScreen from '../screens/app/ScanResultAlertScreen';
import AlertsScreen from '../screens/app/AlertsScreen';
import ReportScreen from '../screens/app/ReportScreen';
import AlertDetailScreen from '../screens/app/AlertDetailScreen';
import SettingsScreen from '../screens/app/SettingsScreen';
import EditProfileScreen from '../screens/app/EditProfileScreen';
import ChangePasswordScreen from '../screens/app/ChangePasswordScreen';
import NotificationsSettingsScreen from '../screens/app/NotificationsSettingsScreen';
import PrivacyScreen from '../screens/app/PrivacyScreen';
import HelpScreen from '../screens/app/HelpScreen';
import AboutScreen from '../screens/app/AboutScreen';
import MyReportsScreen from '../screens/app/MyReportsScreen';
import ReportDetailScreen from '../screens/app/ReportDetailScreen';
import AdminReportsScreen from '../screens/app/AdminReportsScreen';
import CreateAlertScreen from '../screens/app/CreateAlertScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

const TabIcon = ({ focused }: { focused: boolean }) => (
  <View style={[styles.tabIcon, focused && styles.tabIconActive]} />
);

// Dummy component for Scan tab (navigation handled by listener)
function ScanTabPlaceholder() {
  return null;
}

function MainTabs({ navigation }: NativeStackScreenProps<RootStackParamList, 'MainTabs'>) {
  const { isGuest } = useAuth();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarShowLabel: true,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.gray500,
        tabBarLabelStyle: styles.tabLabel,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Inicio',
          tabBarIcon: ({ focused }) => <TabIcon focused={focused} />,
        }}
      />
      <Tab.Screen
        name="Scan"
        component={ScanTabPlaceholder}
        listeners={{
          tabPress: (e) => {
            e.preventDefault();
            navigation.navigate('Scanner');
          },
        }}
        options={{
          tabBarLabel: 'Escanear',
          tabBarIcon: () => (
            <View style={styles.scanButtonContainer}>
              <View style={styles.scanButton}>
                <View style={styles.scanIcon} />
              </View>
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: isGuest ? 'Perfil (invitado)' : 'Perfil',
          tabBarIcon: ({ focused }) => <TabIcon focused={focused} />,
        }}
      />
    </Tab.Navigator>
  );
}

function AuthStack() {
  return (
    <Stack.Navigator
      initialRouteName="Onboarding"
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      <Stack.Screen name="VerifyCode" component={VerifyCodeScreen} />
      <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
      <Stack.Screen name="PasswordSuccess" component={PasswordSuccessScreen} />
    </Stack.Navigator>
  );
}

function AppStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="MainTabs" component={MainTabs} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
      <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />
      <Stack.Screen name="NotificationsSettings" component={NotificationsSettingsScreen} />
      <Stack.Screen name="Privacy" component={PrivacyScreen} />
      <Stack.Screen name="Help" component={HelpScreen} />
      <Stack.Screen name="About" component={AboutScreen} />
      <Stack.Screen
        name="Scanner"
        component={ScannerScreen}
        options={{ presentation: 'fullScreenModal' }}
      />
      <Stack.Screen
        name="ScanResultSafe"
        component={ScanResultSafeScreen}
        options={{ presentation: 'modal' }}
      />
      <Stack.Screen
        name="ScanResultAlert"
        component={ScanResultAlertScreen}
        options={{ presentation: 'modal' }}
      />
      <Stack.Screen name="Report" component={ReportScreen} />
      <Stack.Screen name="MyReports" component={MyReportsScreen} />
      <Stack.Screen name="ReportDetail" component={ReportDetailScreen} />
      <Stack.Screen name="AdminReports" component={AdminReportsScreen} />
      <Stack.Screen name="CreateAlert" component={CreateAlertScreen} />
      <Stack.Screen name="Alerts" component={AlertsScreen} />
      <Stack.Screen name="AlertDetail" component={AlertDetailScreen} />
    </Stack.Navigator>
  );
}

const SplashScreen = () => (
  <View style={styles.loadingContainer}>
    <ActivityIndicator size="large" color={COLORS.primary} />
  </View>
);

export default function AppNavigator() {
  const {
    initializing,
    loadingProfile,
    session,
    isGuest,
    passwordRecoveryMode,
  } = useAuth();

  if (initializing || loadingProfile) {
    return <SplashScreen />;
  }

  const shouldShowApp = (session || isGuest) && !passwordRecoveryMode;

  return (
    <NavigationContainer>
      {shouldShowApp ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.gray200,
    height: 60,
    paddingBottom: 8,
    paddingTop: 8,
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  tabIcon: {
    width: 24,
    height: 24,
    backgroundColor: COLORS.gray500,
    borderRadius: 6,
  },
  tabIconActive: {
    backgroundColor: COLORS.primary,
  },
  scanButtonContainer: {
    position: 'relative',
    top: -20,
  },
  scanButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  scanIcon: {
    width: 28,
    height: 28,
    backgroundColor: COLORS.white,
    borderRadius: 6,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.background,
  },
});
