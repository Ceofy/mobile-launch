import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const saveToSecureStorage = async (key, value) => {
  // False, null, or empty string
  if (!value && value !== 0) {
    value = '';
  }
  await SecureStore.setItemAsync(key, value.toString());
};

export const getValueFromSecureStorage = async key => {
  let result = await SecureStore.getItemAsync(key);
  return result;
};

export const saveToStorage = async (key, value) => {
  // False, null, or empty string
  if (!value && value !== 0) {
    value = '';
  }
  await AsyncStorage.setItem(key, value.toString());
};

export const getValueFromStorage = async key => {
  let result = await AsyncStorage.getItem(key);
  return result;
};
