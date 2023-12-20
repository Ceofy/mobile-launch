import React, { useRef } from 'react';
import { WebView as WebViewComponent } from 'react-native-webview';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

const WebView = props => {
  const { setWebViewUri, uri } = props;

  const handleWebViewNavigationStateChange = newNavState => {
    if (newNavState.url === 'https://ease.uhndata.io/login') {
      setWebViewUri();
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar hidden={false} />
      <WebViewComponent
        source={{
          uri: uri,
        }}
        onNavigationStateChange={handleWebViewNavigationStateChange}
      />
    </SafeAreaView>
  );
};

export default WebView;
