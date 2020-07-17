import React from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';
import { DynamicValue, useDynamicValue } from 'react-native-dark-mode';

import { PrayerExperienceConnected } from '@apollosproject/ui-prayer';
import PrayerListFeatureConnected from '@apollosproject/ui-connected/src/PrayerListFeatureConnected';
import PrayerFeature from './PrayerFeature';

const dynamicTheme = new DynamicValue('light', 'dark');

const DynamicPrayerExperienceConnected = (props) => {
    const theme = useDynamicValue(dynamicTheme);

    return <PrayerExperienceConnected {...props} themeType={theme} />;
};

const PrayerListFeatureConnectedWithComponent = ({
    ItemSeparatorComponent,
    ...props
}) => (
        <View style={{ flexDirection: 'row' }}>
            <PrayerListFeatureConnected {...props} />
            {!!ItemSeparatorComponent && <ItemSeparatorComponent />}
        </View>
    );

PrayerListFeatureConnectedWithComponent.propTypes = {
    Component: PropTypes.oneOfType([
        PropTypes.node,
        PropTypes.func,
        PropTypes.object,
    ]),
    PrayerExperienceComponent: PropTypes.oneOfType([
        PropTypes.node,
        PropTypes.func,
        PropTypes.object,
    ]),
    ItemSeparatorComponent: PropTypes.oneOfType([
        PropTypes.node,
        PropTypes.func,
        PropTypes.object, // type check for React fragments
    ]),
};

PrayerListFeatureConnectedWithComponent.defaultProps = {
    Component: PrayerFeature,
    PrayerExperienceComponent: DynamicPrayerExperienceConnected,
    ItemSeparatorComponent: null,
};

export default PrayerListFeatureConnectedWithComponent;
