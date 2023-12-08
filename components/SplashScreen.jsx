import React from 'react';

import { Text, View, ActivityIndicator } from 'react-native';

const SplashScreen = () => {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Loading...</Text>
      <ActivityIndicator size='large' />
    </View>
  );
};

export default SplashScreen;
