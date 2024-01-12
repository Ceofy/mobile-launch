import React, { useContext } from 'react';
import { Button } from 'react-native-paper';

import { AuthContext } from 'MobileLaunch/contexts/auth';
import {
  USERNAME,
  PASSWORD,
  STAY_SIGNED_IN,
  SAVE_USERNAME,
} from 'MobileLaunch/constants';
import { getValueFromStorage, saveToSecureStorage } from 'MobileLaunch/utils';

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
      accessibilityLabel={'Open ' + process.env.EXPO_PUBLIC_PROJECT_NAME}
      mode='contained'
      dark={true}
    >
      Log In
    </Button>
  );
};

export default OpenBrowserButton;
