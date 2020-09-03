import React, { useCallback } from 'react';
import PropTypes from 'prop-types';

import { FeaturesFeedConnected as CoreFeaturesFeedConnected } from '@apollosproject/ui-connected';

import { HorizontalDivider } from 'ui/Dividers';

import additionalFeatures from './additionalFeatures';

const FeaturesFeedConnected = ({ onRef, ...props }) => {
  const feedRef = useCallback((ref) => onRef(ref), []);

  return (
    <CoreFeaturesFeedConnected
      {...props}
      additionalFeatures={additionalFeatures}
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
