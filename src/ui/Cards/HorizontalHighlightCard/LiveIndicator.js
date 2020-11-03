import React, { useState, useEffect } from 'react';
import { Animated } from 'react-native';

import { withTheme, Icon } from '@apollosproject/ui-kit';

const LiveIcon = withTheme(({ theme }) => ({
  name: 'live-dot',
  size: theme.helpers.rem(0.75),
  fill: theme.colors.alert,
}))(Icon);

export default withTheme()(({ theme }) => {
  const MIN = 0.3;
  const MAX = 1;
  const duration = 1000;
  const [opacity, setOpacity] = useState(new Animated.Value(MIN));
  const fadeIn = () => {
    Animated.timing(opacity, {
      toValue: MAX,
      duration,
    }).start(() => {
      fadeOut();
    });
  };
  const fadeOut = () => {
    Animated.timing(opacity, {
      toValue: MIN,
      duration,
    }).start(() => {
      fadeIn();
    });
  };

  useEffect(() => {
    fadeIn();
  }, []);

  return (
    <Animated.View
      style={{
        opacity,
      }}
    >
      <LiveIcon />
    </Animated.View>
  );
});
