import React, { useContext } from 'react';
import { Button } from 'react-native';

import { AuthContext } from '../contexts/auth';

const OpenBrowserButton = props => {
  const { username, password, setWebViewUri } = props;
  const { authenticate } = useContext(AuthContext);

  const handlePress = async () => {
    try {
      const mobileLoginToken = await authenticate(username, password);
      setWebViewUri(
        `${process.env.EXPO_PUBLIC_APP_HOST}login?mobileLoginToken=${mobileLoginToken}`
      );
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
