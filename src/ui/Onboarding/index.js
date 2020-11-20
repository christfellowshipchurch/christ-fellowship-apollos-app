import React from 'react';
import { Query } from 'react-apollo';
import {
  checkNotifications,
  openSettings,
  requestNotifications,
  RESULTS,
} from 'react-native-permissions';

import { withThemeMixin, NavigationService } from '@apollosproject/ui-kit';
import {
  AskNotificationsConnected,
  FeaturesConnected,
  LocationFinderConnected,
  OnboardingSwiper,
  onboardingComplete,
  WITH_USER_ID,
} from '@apollosproject/ui-onboarding';

import AuthBackground from '../AuthBackground';

const { resetAction } = NavigationService;

function Onboarding({ navigation }) {
  return (
    <AuthBackground>
      <OnboardingSwiper>
        {({ swipeForward }) => (
          <>
            <FeaturesConnected
              onPressPrimary={swipeForward}
              description="We'd like to help you personalize your profile to make the most of your Christ Fellowship mobile app experience."
            />
            <LocationFinderConnected
              onPressPrimary={swipeForward}
              onNavigate={() => {
                navigation.navigate('Location');
              }}
              primaryNavText={'Next'}
              description="We'll use your location to connect you with your nearby campus and community."
            />
            <Query query={WITH_USER_ID} fetchPolicy="network-only">
              {({
                data: { currentUser: { id } = { currentUser: { id: null } } },
              }) => (
                <AskNotificationsConnected
                  onPressPrimary={() => {
                    onboardingComplete({ userId: id });
                    navigation.dispatch(
                      NavigationService.resetAction({
                        navigatorName: 'Tabs',
                        routeName: 'Home',
                      })
                    );
                  }}
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
                  primaryNavText={'Finish'}
                  description="We'll let you know when important things are happening and keep you in the loop."
                />
              )}
            </Query>
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
