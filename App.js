import React from 'react';

import AuthContext from './contexts/auth';
import HomeScreen from './components/HomeScreen';

export default function App() {
  return (
    <AuthContext>
      <HomeScreen />
    </AuthContext>
  );
}
