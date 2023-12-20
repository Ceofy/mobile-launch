import React, { useEffect, useContext, useState } from 'react';
import { AuthContext } from '../contexts/auth';
import { getValueFromSecureStore } from '../utils/utils';
import { USERNAME, PASSWORD } from '../constants/constants';

import HomeScreen from './HomeScreen';
import WebView from './/WebView';

const AppScreen = () => {
  const { authenticate } = useContext(AuthContext);
  const [webViewUri, setWebViewUri] = useState();

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

  return webViewUri ? (
    <WebView setWebViewUri={setWebViewUri} uri={webViewUri} />
  ) : (
    <HomeScreen setWebViewUri={setWebViewUri} />
  );
};

export default AppScreen;
