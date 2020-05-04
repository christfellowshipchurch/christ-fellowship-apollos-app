import React from 'react';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';
import { get } from 'lodash';
import RockAuthedWebBrowser from './web-browser';
import UILandingScreen from './ui/LandingScreen';
import AuthBackgroundComponent from './ui/AuthBackground';

const GET_PRIVACY_POLICY_URL = gql`
  query privacyPolicy {
    privacyPolicyUrl
  }
`;

const LandingScreen = ({ navigation }) => {
  const { loading, data, error } = useQuery(GET_PRIVACY_POLICY_URL, {
    fetchPolicy: 'network-only',
  });

  const privacyPolicyUrl = get(data, 'privacyPolicyUrl', '');

  return (
    <RockAuthedWebBrowser>
      {(openUrl) => (
        <UILandingScreen
          onPressPrimary={() => navigation.push('Auth')}
          onPressSecondary={() =>
            !loading &&
            !error &&
            !!privacyPolicyUrl &&
            privacyPolicyUrl !== '' &&
            openUrl(privacyPolicyUrl)
          }
          textColor={'white'}
          BackgroundComponent={<AuthBackgroundComponent />}
          buttonTitle="Let's go!"
        />
      )}
    </RockAuthedWebBrowser>
  );
};

LandingScreen.navigationOptions = {
  header: null,
};

export default LandingScreen;
