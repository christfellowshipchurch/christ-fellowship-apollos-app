import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';

const NavigationSpacer = ({ height }) => (
    <View
        style={{
            backgroundColor: 'transparent',
            height,
        }}
    />
);

NavigationSpacer.propTypes = {
    height: PropTypes.number,
};
NavigationSpacer.defaultProps = {
    height: 50,
};

export default NavigationSpacer;
