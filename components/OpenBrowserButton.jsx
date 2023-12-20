import React, { useContext, useEffect } from 'react';
import { Button } from 'react-native';

import { AuthContext } from '../contexts/auth';
import { launchWebapp } from '../utils/utils';

const OpenBrowserButton = props => {
  const { username, password } = props;
  const { authenticate } = useContext(AuthContext);

  const handlePress = async () => {
    try {
      const mobileLoginToken = await authenticate(username, password);

      launchWebapp(mobileLoginToken);
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
