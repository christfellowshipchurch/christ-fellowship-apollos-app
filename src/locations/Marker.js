import React, { memo } from 'react';
import { View, Animated } from 'react-native';
import PropTypes from 'prop-types';
import { Marker } from 'react-native-maps';
import Color from 'color';

import { styled } from '@apollosproject/ui-kit';

const MarkerView = styled(({ theme }) => ({
  width: 8,
  height: 8,
  borderRadius: 4,
  backgroundColor: Color(theme.colors.primary).fade(theme.alpha.medium),
  zIndex: 2,
}))(View);

const MarkerRingView = styled(({ theme }) => ({
  width: 24,
  height: 24,
  borderRadius: 12,
  backgroundColor: Color(theme.colors.primary).fade(theme.alpha.low),
  borderWidth: 1,
  borderColor: Color(theme.colors.primary).fade(theme.alpha.medium),
  alignItems: 'center',
  justifyContent: 'center',
}))(View);

const StyledMarker = memo(({ latitude, longitude, opacityStyle }) => (
  <Marker coordinate={{ latitude, longitude }}>
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
  opacityStyle: PropTypes.shape({}),
};

export default StyledMarker;
