import React from 'react';
import { styled, GradientOverlayImage } from '@apollosproject/ui-kit';

import ApollosLandingScreen from './ui/LandingScreen';

const FullScreenImage = styled({
  resizeMode: 'cover',
  position: 'absolute',
})(GradientOverlayImage);

const LandingScreen = ({ navigation }) => (
  <ApollosLandingScreen
    onPressPrimary={() => {
      console.log({ navigation });
      console.log('Pressed the BUTTON');
      navigation.push('Auth');
      // navigation.push('TestNavigation');
    }}
    textColor={'white'}
    BackgroundComponent={
      <FullScreenImage source={'https://picsum.photos/375/812/?random'} />
    }
    primaryNavText={"Let's go!"}
  />
);

LandingScreen.navigationOptions = {
  header: null,
};

export default LandingScreen;
