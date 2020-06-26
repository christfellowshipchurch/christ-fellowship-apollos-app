/* eslint-disable react-native/no-inline-styles */
import React, { useState, useEffect } from 'react';
import { View, ImageBackground } from 'react-native';

import { storiesOf } from '@apollosproject/ui-storybook';

import { CheckInButton } from '.';

// Since the UI for CheckInButton relies heavily on a background
// image due to the blur view that we use, we want to write stories
// with a background image, and AuthBackground does just that so
// we're hijacking it!
const BackgroundPhoto = (props) => (
  <View style={{ width: '100%', height: '100%' }}>
    <ImageBackground
      source={require('../../ui/AuthBackground/auth_background.jpg')}
      style={{ width: '100%', height: '100%', justifyContent: 'center' }}
      {...props}
    />
    <View
      style={{
        width: '100%',
        height: '10%',
        position: 'absolute',
        bottom: 0,
        backgroundColor: 'white',
      }}
    />
  </View>
);

const InteractiveCheckIn = () => {
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [checkInCountdown, setCheckInCountdown] = useState(0);

  const simulateCheckIn = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsCheckedIn(true);
      setCheckInCountdown(5);
    }, 5000);
  };

  const defaultMessage = 'Click the button to check in';
  const isLoadingMessage = 'You are currently being checked in...';
  const checkedInMessage = `You are checked in. Reseting in: ${checkInCountdown}`;

  useEffect(
    () => {
      setTimeout(() => {
        if (checkInCountdown < 1) {
          setIsCheckedIn(false);
        } else {
          setCheckInCountdown(checkInCountdown - 1);
        }
      }, 1000);
    },
    [checkInCountdown]
  );

  return (
    <View style={{ flexDirection: 'column' }}>
      <CheckInButton
        isLoading={isLoading}
        disabled={isCheckedIn}
        message={
          isLoading
            ? isLoadingMessage
            : isCheckedIn
              ? checkedInMessage
              : defaultMessage
        }
        onPress={simulateCheckIn}
        title={isCheckedIn ? 'Checked In' : 'Check In'}
        isCheckedIn={isCheckedIn}
      />
    </View>
  );
};

storiesOf('ui-kit/CheckInButton', module).add('Default', () => (
  <BackgroundPhoto>
    <CheckInButton />
  </BackgroundPhoto>
));

storiesOf('ui-kit/CheckInButton', module).add('loading', () => (
  <BackgroundPhoto>
    <CheckInButton isLoading />
  </BackgroundPhoto>
));

storiesOf('ui-kit/CheckInButton', module).add('interactive', () => (
  <BackgroundPhoto>
    <InteractiveCheckIn isLoading />
  </BackgroundPhoto>
));
