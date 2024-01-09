import React, { useContext } from 'react';
import { Button } from 'react-native';

import { AuthContext } from '../contexts/auth';
import {
  USERNAME,
  PASSWORD,
  STAY_SIGNED_IN,
  SAVE_USERNAME,
} from '../constants/constants';
import { getValueFromStorage, saveToSecureStorage } from '../utils/utils';

const OpenBrowserButton = props => {
  const { username, password, setWebViewUri } = props;
  const { authenticate } = useContext(AuthContext);

  const handlePress = async () => {
    try {
      const mobileLoginToken = await authenticate(username, password);
      if (mobileLoginToken) {
        console.log(
          `${process.env.EXPO_PUBLIC_APP_HOST}login?mobileLoginToken=${mobileLoginToken}`
        );
        setWebViewUri(
          `${process.env.EXPO_PUBLIC_APP_HOST}login?mobileLoginToken=${mobileLoginToken}`
          //`${process.env.EXPO_PUBLIC_APP_HOST}login` //?mobileLoginToken=${mobileLoginToken}`
        );

        // Save username or username and password to app
        const saveUsername = await getValueFromStorage(SAVE_USERNAME);
        if (saveUsername) {
          saveToSecureStorage(USERNAME, username);

          const staySignedIn = await getValueFromStorage(STAY_SIGNED_IN);
          if (staySignedIn) {
            saveToSecureStorage(PASSWORD, password);
          } else {
            saveToSecureStorage(PASSWORD, null);
          }
        } else {
          saveToSecureStorage(USERNAME, null);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Button
      onPress={handlePress}
      title={'Open ' + process.env.EXPO_PUBLIC_PROJECT_NAME}
      accessibilityLabel={'Open ' + process.env.EXPO_PUBLIC_PROJECT_NAME}
    />
  );
};

export default OpenBrowserButton;
