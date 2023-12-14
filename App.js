import React from 'react';

import HomeScreen from './components/HomeScreen';
import { usePushNotifications } from './hooks/usePushNotifications';

export default function App() {
  const { expoPushToken, notification } = usePushNotifications();

  return <HomeScreen />;
}

/**
 * App workflow
 *
 * Splashscreen while authentication info is pulled up
 *
 * Not authenticated:
 *    - Button to launch EASE and log in
 *    - Complete survey, or not
 *    - App gets authenticated
 *
 * App asks for permission to give push notifications
 *
 * Thereafter:
 *    - Have username and password fields
 *    - Allow users to save info
 *    - Allow users to copy password
 *    - Button to launch webapp
 *
 * In addition:
 *    - App updates if password changes in webapp?
 */
