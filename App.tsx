import React from 'react';
import { StatusBar } from 'expo-status-bar';
import AppNavigator from './src/navigation/AppNavigator';
import { AuthProvider } from './src/context/AuthContext';
import { BiometricLock } from './src/components/BiometricLock';

export default function App() {
  return (
    <AuthProvider>
      <BiometricLock>
        <StatusBar style="dark" />
        <AppNavigator />
      </BiometricLock>
    </AuthProvider>
  );
}
