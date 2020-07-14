import React from 'react';
import PropTypes from 'prop-types';
import PrayerListFeatureConnected from '@apollosproject/ui-connected/src/PrayerListFeatureConnected';
import PrayerFeature from './PrayerFeature';

const PrayerListFeatureConnectedWithComponent = (props) => (
    <PrayerListFeatureConnected {...props} />
);

PrayerListFeatureConnectedWithComponent.propTypes = {
    Component: PropTypes.oneOfType([
        PropTypes.node,
        PropTypes.func,
        PropTypes.object,
    ]),
};

PrayerListFeatureConnectedWithComponent.defaultProps = {
    Component: PrayerFeature,
};

export default PrayerListFeatureConnectedWithComponent;
