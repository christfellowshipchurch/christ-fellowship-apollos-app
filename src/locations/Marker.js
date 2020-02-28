import React, { memo } from 'react';
import { View, Animated } from 'react-native';
import PropTypes from 'prop-types';
import { Marker } from 'react-native-maps';
import Color from 'color';

import { styled } from '@apollosproject/ui-kit';

const MarkerView = styled(({ theme }) => ({
  width: theme.sizing.baseUnit * 0.5,
  height: theme.sizing.baseUnit * 0.5,
  borderRadius: theme.sizing.baseUnit * 0.25,
  backgroundColor: Color(theme.colors.primary).fade(theme.alpha.medium),
  zIndex: 2,
}))(View);

const MarkerRingView = styled(({ theme }) => ({
  width: theme.sizing.baseUnit * 1.5,
  height: theme.sizing.baseUnit * 1.5,
  borderRadius: theme.sizing.baseUnit * 0.75,
  backgroundColor: Color(theme.colors.primary).fade(theme.alpha.low),
  borderWidth: 1,
  borderColor: Color(theme.colors.primary).fade(theme.alpha.medium),
  alignItems: 'center',
  justifyContent: 'center',
}))(View);

const StyledMarker = memo(({ latitude, longitude, opacityStyle, onPress }) => (
  <Marker onPress={onPress} coordinate={{ latitude, longitude }}>
    <Animated.View style={opacityStyle}>
      <MarkerRingView>
        <MarkerView />
      </MarkerRingView>
    </Animated.View>
  </Marker>
));

StyledMarker.displayName = 'StyledMarker';

StyledMarker.propTypes = {
  latitude: PropTypes.number.isRequired,
  longitude: PropTypes.number.isRequired,
  onPress: PropTypes.func.isRequired,
  opacityStyle: PropTypes.shape({}),
};

export default StyledMarker;
