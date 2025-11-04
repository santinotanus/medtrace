import React, { useEffect } from 'react';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, StyleSheet } from 'react-native';
import { RootStackParamList, MainTabParamList } from '../types';
import { COLORS } from '../constants/theme';

import type { NativeStackScreenProps, NativeStackNavigationProp } from '@react-navigation/native-stack';

// Auth Screens
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import OnboardingScreen from '../screens/auth/OnboardingScreen';
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
//import HistoryScreen from '../screens/app/HistoryScreen';
import SettingsScreen from '../screens/app/SettingsScreen';
import NotificationsSettingsScreen from '../screens/app/NotificationsSettingsScreen';
import PrivacyScreen from '../screens/app/PrivacyScreen';
import HelpScreen from '../screens/app/HelpScreen';
import AboutScreen from '../screens/app/AboutScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

// Custom Tab Bar Icon Component
const TabIcon = ({ focused }: { focused: boolean }) => (
  <View style={[styles.tabIcon, focused && styles.tabIconActive]} />
);

// Main Tabs Navigator
function MainTabs({ route }: NativeStackScreenProps<RootStackParamList, 'MainTabs'>) {
  const isGuest = route?.params?.guest === true;
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
        initialParams={{ guest: isGuest }}
      />
      <Tab.Screen
        name="Scan"
        component={ScannerScreen}
        options={{
          tabBarLabel: 'Escanear',
          tabBarIcon: ({ focused }) => (
            <View style={styles.scanButtonContainer}>
              <View style={styles.scanButton}>
                <View style={styles.scanIcon} />
              </View>
            </View>
          ),
        }}
      />
      {!isGuest && (
        <Tab.Screen
          name="Profile"
          component={ProfileScreen}
          options={{
            tabBarLabel: 'Perfil',
            tabBarIcon: ({ focused }) => <TabIcon focused={focused} />,
          }}
        />
      )}
    </Tab.Navigator>
  );
}

// Root Navigator
export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Onboarding"
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
        }}
      >
        {/* Auth Flow */}
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        <Stack.Screen name="VerifyCode" component={VerifyCodeScreen} />
        <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
        <Stack.Screen name="PasswordSuccess" component={PasswordSuccessScreen} />

        {/* Pantallas extra del Stack (a las que navega Profile) */}
         {/*<Stack.Screen name="History" component={HistoryScreen} />*/}
        <Stack.Screen name="Settings" component={SettingsScreen} />
        <Stack.Screen name="NotificationsSettings" component={NotificationsSettingsScreen} />
        <Stack.Screen name="Privacy" component={PrivacyScreen} />
        <Stack.Screen name="Help" component={HelpScreen} />
        <Stack.Screen name="About" component={AboutScreen} />
        {/* Main App */}
        <Stack.Screen name="MainTabs" component={MainTabs} />

        {/* Modales / resultados */}
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
        <Stack.Screen name="Alerts" component={AlertsScreen} />
        <Stack.Screen name="AlertDetail" component={AlertDetailScreen} />

        {/* Logout (resetea al Login) */}
        <Stack.Screen name="Logout" component={LogoutScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

function LogoutScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  useEffect(() => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  }, [navigation]);
  return null;
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
});
