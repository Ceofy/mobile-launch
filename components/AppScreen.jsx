import React, { useEffect, useContext, useState } from 'react';
import { AuthContext } from '../contexts/auth';
import { getValueFromSecureStore } from '../utils/utils';
import { USERNAME, PASSWORD } from '../constants/constants';
import * as SplashScreen from 'expo-splash-screen';

import HomeScreen from './HomeScreen';
import WebView from './/WebView';

SplashScreen.preventAutoHideAsync();

const AppScreen = () => {
  const { authenticate } = useContext(AuthContext);
  const [webViewUri, setWebViewUri] = useState();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const attemptToLaunchWebapp = async () => {
      try {
        const username = await getValueFromSecureStore(USERNAME);
        const password = await getValueFromSecureStore(PASSWORD);

        if (username && password) {
          const mobileLoginToken = await authenticate(username, password);
          if (mobileLoginToken) {
            setWebViewUri(
              `${process.env.EXPO_PUBLIC_APP_HOST}login?mobileLoginToken=${mobileLoginToken}`
            );
          }
        }
      } catch (error) {
        console.error(error);
      }
    };

    attemptToLaunchWebapp();
  }, []);

  useEffect(() => {
    if (isLoading && webViewUri) {
      setIsLoading(false);
      SplashScreen.hideAsync();
    }
  }, [webViewUri]);

  if (isLoading) {
    return null;
  }

  return webViewUri ? (
    <WebView setWebViewUri={setWebViewUri} uri={webViewUri} />
  ) : (
    <HomeScreen setWebViewUri={setWebViewUri} />
  );
};

export default AppScreen;
