import React from 'react';

import AuthContext from './contexts/auth';

import { SafeAreaProvider } from 'react-native-safe-area-context';
import {
  PaperProvider,
  MD3LightTheme as DefaultTheme,
} from 'react-native-paper';

import AppScreen from './pages/AppScreen';

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#0097A7',
    secondary: '#A71000',
    text: 'rgba(0, 0, 0, 0.87)',
    textSecondary: 'rgba(0, 0, 0, 0.6)',
    placeholder: 'rgba(0, 0, 0, 0.23)',
    error: 'rgb(222, 54, 24)',
  },
};

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthContext>
        <PaperProvider theme={theme}>
          <AppScreen />
        </PaperProvider>
      </AuthContext>
    </SafeAreaProvider>
  );
}
