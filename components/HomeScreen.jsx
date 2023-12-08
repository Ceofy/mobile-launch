import React, { useState, useEffect } from 'react';
import { View, TextInput, Text, StyleSheet } from 'react-native';

import { StatusBar } from 'expo-status-bar';
import * as SecureStore from 'expo-secure-store';
import OpenBrowserButton from './OpenBrowserButton';

import { USERNAME, PASSWORD } from '../constants/constants';

const getValueFor = async key => {
  let result = await SecureStore.getItemAsync(key);
  return result;
};

const HomeScreen = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    const fetchSavedCredentials = async () => {
      const savedUsername = await getValueFor(USERNAME);
      const savedPassword = await getValueFor(PASSWORD);
      if (savedUsername) {
        setUsername(savedUsername);
      }
      if (savedPassword) {
        setPassword(savedPassword);
      }
    };

    fetchSavedCredentials();
  }, []);

  return (
    <View style={styles.container}>
      <TextInput
        placeholder={USERNAME}
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        placeholder={PASSWORD}
        value={password}
        onChangeText={setPassword}
      />
      <OpenBrowserButton username={username} password={password} />
      <StatusBar style='auto' />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default HomeScreen;
