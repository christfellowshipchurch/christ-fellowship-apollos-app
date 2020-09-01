import React, { useCallback } from 'react';
import PropTypes from 'prop-types';

import { FeaturesFeedConnected as CoreFeaturesFeedConnected } from '@apollosproject/ui-connected';

import { HorizontalDivider } from 'ui/Dividers';

import VerticalCardListFeatureConnected from './VerticalCardListFeatureConnected';
import HeroListFeatureConnected from './HeroListFeatureConnected';

const MAPPINGS = {
  VerticalCardListFeature: VerticalCardListFeatureConnected,
  HeroListFeature: HeroListFeatureConnected,
};

const FeaturesFeedConnected = ({ onRef, ...props }) => {
  const feedRef = useCallback((ref) => onRef(ref), []);

  return (
    <CoreFeaturesFeedConnected
      {...props}
      additionalFeatures={MAPPINGS}
      ItemSeparatorComponent={HorizontalDivider}
      ref={feedRef}
    />
  );
};

FeaturesFeedConnected.propTypes = {
  onRef: PropTypes.func,
};

FeaturesFeedConnected.defaultProps = {
  onRef: () => null,
};

export default FeaturesFeedConnected;
