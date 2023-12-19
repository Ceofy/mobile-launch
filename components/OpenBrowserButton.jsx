import React, { useContext, useEffect } from 'react';
import { Button } from 'react-native';

import * as WebBrowser from 'expo-web-browser';

import { AuthContext } from '../contexts/auth';

const OpenBrowserButton = props => {
  const { username, password } = props;
  const { authenticate } = useContext(AuthContext);

  const launchWebapp = async (username, password) => {
    const mobileLoginToken = await authenticate(username, password);

    // Launch webapp
    let urlString = process.env.EXPO_PUBLIC_APP_HOST;
    if (mobileLoginToken) {
      urlString += `login?mobileLoginToken=${mobileLoginToken}`;
    }

    WebBrowser.openBrowserAsync(urlString);
  };

  return (
    <Button
      onPress={() => launchWebapp(username, password)}
      title={'Open ' + process.env.EXPO_PUBLIC_PROJECT_NAME}
      accessibilityLabel={'Open ' + process.env.EXPO_PUBLIC_PROJECT_NAME}
    />
  );
};

export default OpenBrowserButton;
