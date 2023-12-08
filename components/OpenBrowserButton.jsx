import React from 'react';
import { Text } from 'react-native';

import * as SecureStore from 'expo-secure-store';
import * as WebBrowser from 'expo-web-browser';

import { USERNAME, PASSWORD } from '../constants/constants';

const save = async (key, value) => {
  if (value == null) {
    value = '';
  }
  await SecureStore.setItemAsync(key, value);
};

const OpenBrowserButton = props => {
  const { username, password } = props;

  const authenticate = async (username, password) => {
    // Save username and password to app
    save(USERNAME, username);
    save(PASSWORD, password);

    // Get temporary launch token from app
    let token;
    try {
      const response = await fetch(
        process.env.EXPO_PUBLIC_API_HOST + '/authentication',
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username,
            password,
            strategy: 'local',
            getMobileLoginToken: true,
          }),
        }
      );

      token = (await response.json()).mobileLoginToken;
    } catch (error) {
      console.error(error);
    }

    // Launch webapp
    let urlString = process.env.EXPO_PUBLIC_APP_HOST;
    if (token) {
      urlString += `/login?mobileLoginToken=${token}`;
    }

    WebBrowser.openBrowserAsync(urlString);
  };

  return (
    <Text onPress={() => authenticate(username, password)}>
      Open {process.env.EXPO_PUBLIC_PROJECT_NAME}
    </Text>
  );
};

export default OpenBrowserButton;
