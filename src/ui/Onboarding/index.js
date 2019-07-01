import React from 'react';

import { GradientOverlayImage } from '@apollosproject/ui-kit';
import { ApolloConsumer } from 'react-apollo';

import {
  AskNotificationsConnected,
  AskNameConnected,
  FeaturesConnected,
  AboutYouConnected,
  LocationFinderConnected,
  OnboardingSwiper,
} from '@apollosproject/ui-onboarding';

import { requestPushPermissions } from '@apollosproject/ui-notifications';

function Onboarding({ navigation }) {
  return (
    <OnboardingSwiper>
      {({ swipeForward }) => (
        <>
          <AskNameConnected onPressPrimary={swipeForward} />
          <FeaturesConnected
            onPressPrimary={swipeForward}
            BackgroundComponent={
              <GradientOverlayImage
                source={'https://picsum.photos/640/640/?random'}
              />
            }
          />
          <AboutYouConnected
            onPressPrimary={swipeForward}
            BackgroundComponent={
              <GradientOverlayImage
                source={'https://picsum.photos/640/640/?random'}
              />
            }
          />
          <LocationFinderConnected
            onPressPrimary={swipeForward}
            onNavigate={() => {
              navigation.navigate('Location', {
                onFinished: swipeForward,
              });
            }}
            BackgroundComponent={
              <GradientOverlayImage
                source={'https://picsum.photos/640/640/?random'}
              />
            }
          />
          <ApolloConsumer>
            {(client) => (
              <AskNotificationsConnected
                onPressPrimary={() => navigation.replace('Tabs')}
                onRequestPushPermissions={() =>
                  requestPushPermissions({ client })
                }
                primaryNavText={'Finish'}
                BackgroundComponent={
                  <GradientOverlayImage
                    source={'https://picsum.photos/640/640/?random'}
                  />
                }
              />
            )}
          </ApolloConsumer>
        </>
      )}
    </OnboardingSwiper>
  );
}

Onboarding.navigationOptions = {
  title: 'Onboarding',
  header: null,
  gesturesEnabled: false,
};

export default Onboarding;
