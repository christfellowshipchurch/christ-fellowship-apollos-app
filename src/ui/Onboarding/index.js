import React from 'react';
import { useQuery } from '@apollo/client';
import { get } from 'lodash';
import {
  checkNotifications,
  openSettings,
  requestNotifications,
  RESULTS,
} from 'react-native-permissions';

import { Image } from 'react-native';
import {
  NavigationService,
  BackgroundView,
  styled,
  FlexedView,
} from '@apollosproject/ui-kit';
import {
  AskNotificationsConnected,
  FeaturesConnected,
  LocationFinderConnected,
  OnboardingSwiper,
  onboardingComplete,
  WITH_USER_ID,
} from '@apollosproject/ui-onboarding';

const FullscreenBackgroundView = styled({
  position: 'absolute',
  width: '100%',
  height: '100%',
})(BackgroundView);

const StyledGradient = styled({
  maxHeight: '40%',
  width: '100%',
})(Image);

const hero = require('./hero.jpg');

const Onboarding = ({ navigation }) => {
  const { data } = useQuery(WITH_USER_ID, {
    fetchPolicy: 'network-only',
  });

  const id = get(data, 'currentUser.id');

  return (
    <>
      <FullscreenBackgroundView />
      <FlexedView>
        <StyledGradient source={hero} resizeMode="cover" />
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
            </>
          )}
        </OnboardingSwiper>
      </FlexedView>
    </>
  );
};

export default Onboarding;
