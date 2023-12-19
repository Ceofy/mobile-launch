import * as SecureStore from 'expo-secure-store';

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
