import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';

import { StatusBar, useColorScheme, Appearance } from 'react-native';
import { withTheme } from '@apollosproject/ui-kit';

const dynamicBarStyleValue = {
  light: 'dark-content',
  dark: 'light-content',
};

const AppStatusBar = withTheme(({ theme, barStyle = 'dark-content' }) => ({
  barStyle,
  backgroundColor: theme.colors.background.paper,
}))(StatusBar);

const DynamicStatusBar = ({ barStyle }) => {
  const [scheme] = useState(Appearance.getColorScheme());
  // const scheme = useColorScheme();
  const dynamicBarStyle = get(dynamicBarStyleValue, scheme, 'dark-content');

  return <AppStatusBar barStyle={barStyle || dynamicBarStyle} />;
};

DynamicStatusBar.propTypes = {
  barStyle: PropTypes.oneOf(['dark-content', 'light-content', null]),
};

DynamicStatusBar.defaultProps = {
  barStyle: null,
};

export default StatusBar;
