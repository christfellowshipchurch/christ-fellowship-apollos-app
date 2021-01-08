import React, { useCallback } from 'react';
import PropTypes from 'prop-types';

import { FeaturesFeedConnected as CoreFeaturesFeedConnected } from '@apollosproject/ui-connected';

import { HorizontalDivider } from 'ui/Dividers';

import defaultAdditionalFeatures from './additionalFeatures';
import handleActionPress from './handleActionPress';

const FeaturesFeedConnected = ({
  onRef,
  additionalFeatures,
  ItemSeparatorComponent,
  ...props
}) => {
  const feedRef = useCallback((ref) => onRef(ref), []);

  return (
    <CoreFeaturesFeedConnected
      {...props}
      additionalFeatures={{
        ...defaultAdditionalFeatures,
        ...additionalFeatures,
      }}
      ItemSeparatorComponent={ItemSeparatorComponent}
      ref={feedRef}
      onPressActionItem={handleActionPress}
    />
  );
};

FeaturesFeedConnected.propTypes = {
  onRef: PropTypes.func,
  additionalFeatures: PropTypes.shape({}),
  ItemSeparatorComponent: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.object,
  ]),
};

FeaturesFeedConnected.defaultProps = {
  onRef: () => null,
  additionalFeatures: {},
  ItemSeparatorComponent: HorizontalDivider,
};

export default FeaturesFeedConnected;
