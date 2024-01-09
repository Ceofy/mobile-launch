import React from 'react';

import AuthContext from './contexts/auth';

import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppScreen from './components/AppScreen';

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthContext>
        <AppScreen />
      </AuthContext>
    </SafeAreaProvider>
  );
}
