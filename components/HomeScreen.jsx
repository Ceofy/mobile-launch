import React, { useState, useEffect, useContext } from 'react';
import { View, TextInput, Text, StyleSheet } from 'react-native';
import Checkbox from 'expo-checkbox';

import { StatusBar } from 'expo-status-bar';
import OpenBrowserButton from './OpenBrowserButton';

import {
  USERNAME,
  PASSWORD,
  STAY_SIGNED_IN,
  SAVE_USERNAME,
} from '../constants/constants';
import {
  getValueFromSecureStorage,
  getValueFromStorage,
  saveToSecureStorage,
  saveToStorage,
} from '../utils/utils';
import { usePushNotifications } from '../hooks/usePushNotifications';
import { AuthContext } from '../contexts/auth';

const HomeScreen = props => {
  const { setWebViewUri } = props;
  const { authError, onLayout } = useContext(AuthContext);
  const { notification } = usePushNotifications();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [staySignedInCheckboxValue, setStaySignedInCheckboxValue] = useState();
  const [saveUsernameCheckboxValue, setSaveUsernameCheckboxValue] = useState();

  useEffect(() => {
    const fetchSavedCredentials = async () => {
      try {
        // Check if user opted to save username
        const saveUsername = await getValueFromStorage(SAVE_USERNAME);
        setSaveUsernameCheckboxValue(saveUsername);

        if (saveUsername) {
          // Load username
          const savedUsername = await getValueFromSecureStorage(USERNAME);
          if (savedUsername) {
            setUsername(savedUsername);
          }

          // Check if user also opted to save password and stay signed in
          const staySignedIn = await getValueFromStorage(STAY_SIGNED_IN);
          setStaySignedInCheckboxValue(staySignedIn);
          if (staySignedIn) {
            // Load password
            const savedPassword = await getValueFromSecureStorage(PASSWORD);
            if (savedPassword) {
              setPassword(savedPassword);
            }
          }
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchSavedCredentials();
  }, []);

  const handleStaySignedInCheckboxChange = value => {
    setStaySignedInCheckboxValue(value);
    saveToStorage(STAY_SIGNED_IN, value);

    if (value) {
      handleSaveUsernameCheckboxChange(true);
    }
  };

  const handleSaveUsernameCheckboxChange = value => {
    setSaveUsernameCheckboxValue(value);
    saveToStorage(SAVE_USERNAME, value);
  };

  return (
    <View style={styles.container} onLayout={onLayout}>
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
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
        }}
      >
        <Checkbox
          value={saveUsernameCheckboxValue}
          onValueChange={handleSaveUsernameCheckboxChange}
        />
        <Text style={{ marginLeft: 16 }}> Remember my username</Text>
      </View>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
        }}
      >
        <Checkbox
          value={staySignedInCheckboxValue}
          onValueChange={handleStaySignedInCheckboxChange}
        />
        <Text style={{ marginLeft: 16 }}> Stay signed in</Text>
      </View>
      <OpenBrowserButton
        username={username}
        password={password}
        setWebViewUri={setWebViewUri}
      />
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
