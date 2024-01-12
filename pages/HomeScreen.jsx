import React, { useState, useEffect, useContext, useRef } from 'react';
import { View, StyleSheet, Image, ScrollView } from 'react-native';

import { TextInput, Switch, Text, useTheme } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';

import { StatusBar } from 'expo-status-bar';
import OpenBrowserButton from 'MobileLaunch/components/OpenBrowserButton';

import {
  USERNAME,
  PASSWORD,
  STAY_SIGNED_IN,
  SAVE_USERNAME,
} from 'MobileLaunch/constants';
import {
  getValueFromSecureStorage,
  getValueFromStorage,
  saveToStorage,
} from 'MobileLaunch/utils';
import { usePushNotifications } from 'MobileLaunch/hooks/usePushNotifications';
import { AuthContext } from 'MobileLaunch/contexts/auth';

const HomeScreen = props => {
  const { setWebViewUri } = props;
  const { authError } = useContext(AuthContext);
  const { colors } = useTheme();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [staySignedInCheckboxValue, setStaySignedInCheckboxValue] = useState();
  const [saveUsernameCheckboxValue, setSaveUsernameCheckboxValue] = useState();

  usePushNotifications();

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

  const handleSaveUsernameCheckboxChange = value => {
    setSaveUsernameCheckboxValue(value);
    saveToStorage(SAVE_USERNAME, value);

    if (!value) {
      handleStaySignedInCheckboxChange(false);
    }
  };

  const handleStaySignedInCheckboxChange = value => {
    saveToStorage(STAY_SIGNED_IN, value);
    setStaySignedInCheckboxValue(value);

    if (value) {
      handleSaveUsernameCheckboxChange(true);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps='handled'
    >
      <Image
        source={require('MobileLaunch/assets/ease_logo.png')}
        resizeMode='contain'
        style={{
          width: '100%',
          aspectRatio: 3,
          height: null,
        }}
      />
      <View style={{ width: '100%', marginTop: 10, marginBottom: 20 }}>
        <Text variant='headlineMedium'>Participant Log in</Text>
        <Text variant='titleMedium' style={{ color: colors.textSecondary }}>
          Login as a participant to the EASE Trial.
        </Text>
      </View>

      {authError && (
        <View
          style={{
            width: '100%',
            backgroundColor: 'rgba(222, 54, 24, 0.15)',
            display: 'flex',
            flexDirection: 'row',
            padding: 15,
            marginBottom: 25,
            borderRadius: 4,
          }}
        >
          <MaterialIcons
            name='error-outline'
            size={24}
            color={colors.error}
            style={{ marginRight: 10 }}
          />
          <Text variant='bodyMedium' style={{ flex: 1 }}>
            Login failed. Please ensure your SubjectID and password are correct,
            or check with a research assistant if you continue having problems.
          </Text>
        </View>
      )}

      <TextInput
        label='Enter your SubjectID *'
        value={username}
        onChangeText={setUsername}
        mode='outlined'
        style={styles.textInput}
        error={authError}
      />
      <TextInput
        label='Enter your password *'
        value={password}
        onChangeText={setPassword}
        mode='outlined'
        style={styles.textInput}
        error={authError}
      />
      <View style={{ marginTop: 5, marginBottom: 10 }}>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 5,
          }}
        >
          <Switch
            value={saveUsernameCheckboxValue}
            onValueChange={handleSaveUsernameCheckboxChange}
          />
          <Text style={{ marginLeft: 8 }}> Remember my username</Text>
        </View>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <Switch
            value={staySignedInCheckboxValue}
            onValueChange={handleStaySignedInCheckboxChange}
          />
          <Text style={{ marginLeft: 8 }}> Stay signed in</Text>
        </View>
      </View>
      <OpenBrowserButton
        username={username}
        password={password}
        setWebViewUri={setWebViewUri}
      />
      <StatusBar style='auto' />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  textInput: {
    width: '100%',
    marginBottom: 10,
  },
});

export default HomeScreen;
