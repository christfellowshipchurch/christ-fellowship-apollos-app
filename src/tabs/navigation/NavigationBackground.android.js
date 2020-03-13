import React from 'react';
import { View, StyleSheet } from 'react-native';
import { DynamicValue, useDynamicValue } from 'react-native-dark-mode';
import { styled } from '@apollosproject/ui-kit';

const dynamicBackgroundColor = new DynamicValue('white', 'black');

const StyledBackground = styled(({ theme, type }) => ({
  backgroundColor: theme.colors[type],
  ...StyleSheet.absoluteFill,
}))(View);

export const NavigationBackground = () => {
  const type = useDynamicValue(dynamicBackgroundColor);
  return <StyledBackground type={type} />;
};

NavigationBackground.propTypes = {};

NavigationBackground.defaultProps = {};

export default NavigationBackground;
