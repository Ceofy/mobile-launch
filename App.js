import React from 'react';

import AuthContext from './contexts/auth';
import AppScreen from './components/AppScreen';

export default function App() {
  return (
    <AuthContext>
      <AppScreen />
    </AuthContext>
  );
}
