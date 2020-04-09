import React from 'react';
import { StatusBar } from 'react-native';
import PropTypes from 'prop-types';
import { DynamicValue, useDynamicValue } from 'react-native-dark-mode';

import { withTheme } from '@apollosproject/ui-kit';

const dynamicBarStyleValue = new DynamicValue('dark-content', 'light-content');

const AppStatusBar = withTheme(({ theme, barStyle = 'dark-content' }) => ({
    barStyle,
    backgroundColor: theme.colors.paper,
}))(StatusBar);

const DynamicStatusBar = ({ barStyle }) => {
    const dynamicBarStyle = useDynamicValue(dynamicBarStyleValue);

    return <AppStatusBar barStyle={barStyle || dynamicBarStyle} />;
};

DynamicStatusBar.propTypes = {
    barStyle: PropTypes.oneOf(['dark-content', 'light-content', null]),
};

DynamicStatusBar.defaultProps = {
    barStyle: null,
};

export default DynamicStatusBar;
