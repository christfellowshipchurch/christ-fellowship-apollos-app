import React, { useRef } from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';

import { styled, withTheme, UIText } from '@apollosproject/ui-kit';
import BlurView from 'ui/BlurView';
import { CheckInButtonConnected } from '../../check-in';

const StyledBlurView = styled(({ theme }) => ({
  paddingHorizontal: theme.sizing.baseUnit,
  paddingVertical: theme.sizing.baseUnit * 0.75,
  flexDirection: 'row',
  justifyContent: 'space-around',
  alignItems: 'center',
}))(BlurView);

const Message = withTheme(({ theme }) => ({
  bold: true,
  style: { paddingHorizontal: theme.sizing.baseUnit * 0.25 },
}))(UIText);

export const CheckIn = ({ contentId, message, style }) => {
  const checkInRef = useRef();

  return (
    <StyledBlurView blurType="material" style={style}>
      <View style={{ flex: 2, paddingRight: 2 }}>
        <Message bold>{message}</Message>
      </View>
      <View style={{ flex: 1, paddingLeft: 2, alignItems: 'flex-end' }}>
        <CheckInButtonConnected id={contentId} ref={checkInRef} />
      </View>
    </StyledBlurView>
  );
};

CheckIn.propTypes = {
  contentId: PropTypes.string,
  message: PropTypes.string,
  style: PropTypes.object,
};

CheckIn.defaultProps = {
  message: "Let us know you're here!",
  style: {},
};

export default CheckIn;
