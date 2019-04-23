import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import Swiper from 'react-native-swiper';
import {
  withTheme,
  BackgroundView,
  GradientOverlayImage,
} from '@apollosproject/ui-kit';

import {
  AskNotificationsConnected,
  AskNameConnected,
  Features,
  AboutYouConnected,
  LocationFinderConnected,
} from './slides';

// Provides themed colors to Swiper dots
const ThemedSwiper = withTheme(({ theme }) => ({
  dotColor: theme.colors.background.inactive, // theme.colors.lightSecondary looks the best.
  activeDotColor: theme.colors.action.primary,
}))(({ swiperRef, ...props }) => <Swiper ref={swiperRef} {...props} />);

class Onboarding extends Component {
  static navigationOptions = () => ({
    title: 'Onboarding',
    header: null,
  });

  constructor() {
    super();

    this.swiper = null;
  }

  // Creates ref to Swiper to be passed as a prop to children.
  setSwiperRef = (r) => {
    this.swiper = r;

    return this.swiper;
  };

  // Advance swiper 1 slide. See Swiper documentation for scrollBy details. https://github.com/leecade/react-native-swiper#methods
  handleOnPressPrimary = () => this.swiper.scrollBy(1);

  render() {
    return (
      <BackgroundView>
        <ThemedSwiper
          loop={false}
          /* Disables swipe gestures. We currently we dont display a back button so this is our
           * only back navigation option. */
          // scrollEnabled={false}
          showsButtons={false}
          swiperRef={this.setSwiperRef}
        >
          <AskNameConnected onPressPrimary={this.handleOnPressPrimary} />
          <Features
            imgSrc={{ uri: 'https://picsum.photos/1200/1200?random' }}
            onPressPrimary={this.handleOnPressPrimary}
          />
          <AboutYouConnected
            imgSrc={{ uri: 'https://picsum.photos/1200/1200?random' }}
            onPressPrimary={this.handleOnPressPrimary}
          />
          <LocationFinderConnected onPressPrimary={this.handleOnPressPrimary}>
            <GradientOverlayImage
              source={'https://picsum.photos/640/640/?random'}
            />
          </LocationFinderConnected>
          <AskNotificationsConnected
            onPressPrimary={() => this.props.navigation.navigate('Home')}
            primaryNavText={'Finish'}
          >
            <GradientOverlayImage
              source={'https://picsum.photos/640/640/?random'}
            />
          </AskNotificationsConnected>
        </ThemedSwiper>
      </BackgroundView>
    );
  }
}

export default Onboarding;
