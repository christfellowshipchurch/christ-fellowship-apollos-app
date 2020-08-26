import React from 'react';
import { View } from 'react-native';
import { AirPlayButton as AirPlayBtn } from '@apollosproject/react-native-airplay-btn';

import { styled } from '@apollosproject/ui-kit';

const Wrapper = styled(
  ({ theme }) => ({
    /* 40px is the size the airplay-btn package demands we use 😢 We add the same padding values to
     * match the size of the other small icons on the screen */
    width: 40 + theme.sizing.baseUnit * 1.25,
    height: 40 + theme.sizing.baseUnit * 1.25,
    justifyContent: 'center',
    alignItems: 'center',
  }),
  'ui-media.MediaPlayer.AirPlayButton.Wrapper'
)(View);

const StyledAirplayButton = styled(
  ({ theme }) => ({
    tintColor: theme.colors.paper,
  }),
  'ui-media.MediaPlayer.AirPlayButton.StyledAirplayButton.'
)(AirPlayBtn);

const AirPlayButton = () => (
  <Wrapper>
    <StyledAirplayButton />
  </Wrapper>
);
export default AirPlayButton;
