import React, { useState, useEffect, useContext } from 'react';
import { View, TextInput, Text, StyleSheet } from 'react-native';

import { StatusBar } from 'expo-status-bar';
import OpenBrowserButton from './OpenBrowserButton';

import { USERNAME, PASSWORD } from '../constants/constants';
import { getValueFromSecureStore } from '../utils/utils';
import { usePushNotifications } from '../hooks/usePushNotifications';
import { AuthContext } from '../contexts/auth';

const HomeScreen = () => {
  const { authError } = useContext(AuthContext);
  const { notification } = usePushNotifications();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    const fetchSavedCredentials = async () => {
      try {
        const savedUsername = await getValueFromSecureStore(USERNAME);
        const savedPassword = await getValueFromSecureStore(PASSWORD);
        if (savedUsername) {
          setUsername(savedUsername);
        }
        if (savedPassword) {
          setPassword(savedPassword);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchSavedCredentials();
  }, []);

  return (
    <View style={styles.container}>
      {notification ? (
        <>
          <Text>Notification:</Text>
          <Text>{JSON.stringify(notification.request.content.title)}</Text>
          <Text>{JSON.stringify(notification.request.content.body)}</Text>
        </>
      ) : null}

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
      {authError ? (
        <>
          <Text>Error:</Text>
          <Text>{authError}</Text>
        </>
      ) : null}
      <StatusBar style='auto' />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#bbb',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default HomeScreen;
