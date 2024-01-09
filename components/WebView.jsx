import React, { useRef } from 'react';
import { WebView as WebViewComponent } from 'react-native-webview';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

const WebView = props => {
  const { setWebViewUri, uri } = props;
  const webViewRef = useRef();

  const handleWebViewNavigationStateChange = async newNavState => {
    // On log out, go back to mobile app
    if (newNavState.url === 'https://ease.uhndata.io/login') {
      webViewRef.current.stopLoading();
      setWebViewUri();
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar hidden={false} />
      <WebViewComponent
        ref={webViewRef}
        source={{
          uri: uri,
        }}
        onNavigationStateChange={handleWebViewNavigationStateChange}
      />
    </SafeAreaView>
  );
};

export default WebView;
