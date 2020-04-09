import React from 'react';
import {
  checkNotifications,
  openSettings,
  requestNotifications,
  RESULTS,
} from 'react-native-permissions';

import { withThemeMixin } from '@apollosproject/ui-kit';
import {
  AskNotificationsConnected,
  FeaturesConnected,
  LocationFinderConnected,
  OnboardingSwiper,
} from '@apollosproject/ui-onboarding';

import AuthBackground from '../AuthBackground';

function Onboarding({ navigation }) {
  return (
    <AuthBackground>
      <OnboardingSwiper>
        {({ swipeForward }) => (
          <>
            <FeaturesConnected onPressPrimary={swipeForward} />
            <LocationFinderConnected
              onPressPrimary={swipeForward}
              onNavigate={() => {
                navigation.navigate('Location');
              }}
              primaryNavText={'Next'}
            />
            <AskNotificationsConnected
              onRequestPushPermissions={(update) => {
                checkNotifications().then((checkRes) => {
                  if (checkRes.status === RESULTS.DENIED) {
                    requestNotifications(['alert', 'badge', 'sound']).then(
                      () => {
                        update();
                      }
                    );
                  } else {
                    openSettings();
                  }
                });
              }}
              onPressPrimary={() => navigation.replace('Tabs')}
              primaryNavText={'Finish'}
            />
          </>
        )}
      </OnboardingSwiper>
    </AuthBackground>
  );
}

const OnboardingWithTheme = withThemeMixin({
  type: 'onboarding',
  colors: {
    background: {
      paper: 'white',
    },
  },
})(Onboarding);

OnboardingWithTheme.navigationOptions = {
  title: 'Onboarding',
  header: null,
  gesturesEnabled: false,
};

export default OnboardingWithTheme;
