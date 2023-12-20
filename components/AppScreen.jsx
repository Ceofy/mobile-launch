import React, { useEffect, useContext } from 'react';
import HomeScreen from './HomeScreen';
import { AuthContext } from '../contexts/auth';
import { getValueFromSecureStore, launchWebapp } from '../utils/utils';
import { USERNAME, PASSWORD } from '../constants/constants';

const AppScreen = () => {
  const { authenticate } = useContext(AuthContext);

  useEffect(() => {
    const attemptToLaunchWebapp = async () => {
      try {
        const username = await getValueFromSecureStore(USERNAME);
        const password = await getValueFromSecureStore(PASSWORD);

        if (username && password) {
          const mobileLoginToken = await authenticate(username, password);
          if (mobileLoginToken) {
            await launchWebapp(mobileLoginToken);
          }
        }
      } catch (error) {
        console.error(error);
      }
    };

    attemptToLaunchWebapp();
  }, []);

  return <HomeScreen />;
};

export default AppScreen;
