import * as SecureStore from 'expo-secure-store';
import * as WebBrowser from 'expo-web-browser';

export const saveToSecureStore = async (key, value) => {
  if (value == null) {
    value = '';
  }
  await SecureStore.setItemAsync(key, value);
};

export const getValueFromSecureStore = async key => {
  let result = await SecureStore.getItemAsync(key);
  return result;
};

export const launchWebapp = async mobileLoginToken => {
  if (!mobileLoginToken) {
    throw new Error();
  }

  let urlString = process.env.EXPO_PUBLIC_APP_HOST;
  if (mobileLoginToken) {
    urlString += `login?mobileLoginToken=${mobileLoginToken}`;
  }

  WebBrowser.openBrowserAsync(urlString);
};
