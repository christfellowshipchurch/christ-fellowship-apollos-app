import React from 'react';
import { View, Dimensions, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import { WebView } from 'react-native-webview';
import { styled, BackgroundView } from '@apollosproject/ui-kit';

import NavigationHeader from '../content-single/NavigationHeader';

const InlineWebViewContainer = styled(() => ({
  flex: 1,
  height: '100%',
  width: '100%',
  justifyContent: 'space-around',
  alignItems: 'center',
  padding: 0,
}))(View);

const InlineWebView = ({ navigation }) => {
  const { height, width } = Dimensions.get('window');

  return (
    <BackgroundView>
      <StatusBar hidden />
      <SafeAreaView style={{ flex: 1, width: '100%', height: '100%' }}>
        <InlineWebViewContainer>
          <WebView
            source={{
              uri: navigation.getParam('uri'),
            }}
            style={{ flex: 1, width, height }}
            scrollEnabled
          />
        </InlineWebViewContainer>
      </SafeAreaView>
    </BackgroundView>
  );
};

InlineWebView.navigationOptions = {
  title: 'Web View',
  header: NavigationHeader,
  headerTransparent: true,
  headerMode: 'float',
};

export default InlineWebView;
