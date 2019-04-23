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
}))(View);

const MarkerWrapView = styled({
  alignItems: 'center',
  justifyContent: 'center',
})(View);

// This is not good. Is there a better way to prevent cascading styles?

const MarkerRingView = styled(({ theme }) => ({
  width: 24,
  height: 24,
  borderRadius: 12,
  right: -8,
  top: -8,
  backgroundColor: Color(theme.colors.primary).fade(theme.alpha.low),
  position: 'absolute',
  borderWidth: 1,
  borderColor: Color(theme.colors.primary).fade(theme.alpha.medium),
  alignItems: 'stretch',
}))(View);

const StyledMarker = memo(
  ({ latitude, longitude, opacityStyle, scaleStyle }) => (
    <Marker coordinate={{ latitude, longitude }}>
      <MarkerWrapView>
        <Animated.View style={opacityStyle}>
          <MarkerRingView>
            <Animated.View style={scaleStyle} />
          </MarkerRingView>
          <MarkerView />
        </Animated.View>
      </MarkerWrapView>
    </Marker>
  )
);

StyledMarker.displayName = 'StyledMarker';

StyledMarker.propTypes = {
  latitude: PropTypes.number.isRequired,
  longitude: PropTypes.number.isRequired,
  opacityStyle: PropTypes.shape({}),
  scaleStyle: PropTypes.shape({}),
};

export default StyledMarker;
