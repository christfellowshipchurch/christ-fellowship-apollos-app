import React, { useCallback } from 'react';
import PropTypes from 'prop-types';

import { FeaturesFeedConnected as CoreFeaturesFeedConnected } from '@apollosproject/ui-connected';

import { HorizontalDivider } from 'ui/Dividers';

import defaultAdditionalFeatures from './additionalFeatures';
import handleActionPress from './handleActionPress';

const FeaturesFeedConnected = ({ onRef, additionalFeatures, ...props }) => {
  const feedRef = useCallback((ref) => onRef(ref), []);

  return (
    <CoreFeaturesFeedConnected
      {...props}
      additionalFeatures={{
        ...defaultAdditionalFeatures,
        ...additionalFeatures,
      }}
      ItemSeparatorComponent={HorizontalDivider}
      ref={feedRef}
      onPressActionItem={handleActionPress}
    />
  );
};

FeaturesFeedConnected.propTypes = {
  onRef: PropTypes.func,
  additionalFeatures: PropTypes.shape({}),
};

FeaturesFeedConnected.defaultProps = {
  onRef: () => null,
  additionalFeatures: {},
};

export default FeaturesFeedConnected;
