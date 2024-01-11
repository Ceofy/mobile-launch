import React, { useEffect, useContext, useState } from 'react';
import { AuthContext } from '../contexts/auth';
import { getValueFromSecureStorage, getValueFromStorage } from '../utils/utils';
import { USERNAME, PASSWORD, STAY_SIGNED_IN } from '../constants/constants';
import * as SplashScreen from 'expo-splash-screen';
import * as WebBrowser from 'expo-web-browser';

import HomeScreen from './HomeScreen';
import WebView from './/WebView';
import { Platform } from 'react-native';

SplashScreen.preventAutoHideAsync();

const AppScreen = () => {
  const { authenticate } = useContext(AuthContext);
  const [webViewUri, setWebViewUri] = useState();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initialOperations = async () => {
      try {
        // Check if user opted to stay signed in
        const staySignedIn = await getValueFromStorage(STAY_SIGNED_IN);

        // If they did, attempt to sign them in
        if (staySignedIn) {
          const username = await getValueFromSecureStorage(USERNAME);
          const password = await getValueFromSecureStorage(PASSWORD);

          if (username && password) {
            const mobileLoginToken = await authenticate(username, password);
            if (mobileLoginToken) {
              setWebViewUri(
                `${process.env.EXPO_PUBLIC_APP_HOST}login?mobileLoginToken=${mobileLoginToken}`
              );
            }
          }
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    initialOperations();
  }, []);

  useEffect(() => {
    if (isLoading && webViewUri) {
      setIsLoading(false);
    }
  }, [webViewUri]);

  useEffect(() => {
    if (!isLoading) {
      SplashScreen.hideAsync();
    }
  }, [isLoading]);

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
