import React from 'react';
import { ActivityIndicator, View, Dimensions } from 'react-native';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
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

const GET_PRIVACY_POLICY_URL = gql`
  query privacyPolicy {
    privacyPolicyUrl
  }
`;

const PrivacyPolicyConnected = () => (
  <Query query={GET_PRIVACY_POLICY_URL} fetchPolicy="network-only">
    {({ loading, data: { privacyPolicyUrl = '' } = {}, error }) => {
      if (loading) return <ActivityIndicator />;

      const { height, width } = Dimensions.get('window');

      return (
        <BackgroundView>
          <SafeAreaView style={{ flex: 1, width: '100%', height: '100%' }}>
            <InlineWebViewContainer>
              <WebView
                source={{
                  uri: privacyPolicyUrl,
                }}
                style={{ flex: 1, width, height }}
                scrollEnabled
              />
            </InlineWebViewContainer>
          </SafeAreaView>
        </BackgroundView>
      );
    }}
  </Query>
);

PrivacyPolicyConnected.navigationOptions = {
  title: 'Privacy Policy',
  header: NavigationHeader,
  headerTransparent: true,
  headerMode: 'float',
};

export default PrivacyPolicyConnected;
