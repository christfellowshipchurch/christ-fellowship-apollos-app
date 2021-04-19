import React from 'react';
import PropTypes from 'prop-types';

import { View, useColorScheme } from 'react-native';
import { PrayerExperienceConnected } from '@apollosproject/ui-prayer';
import PrayerListFeatureConnected from '@apollosproject/ui-connected/src/PrayerListFeatureConnected';
import PrayerFeature from './PrayerFeature';

const DynamicPrayerExperienceConnected = (props) => {
  /**
   * We don't want to accidentally set the Prayer Experience theme to something invalid, so we'll check for either `light` or `dark` and fall back to `light`
   */
  const scheme = useColorScheme();
  const theme = scheme === 'light' || scheme === 'dark' ? scheme : 'light';

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
