import React from 'react';

import { VerticalCardListFeatureConnected as CoreVerticalCardListFeatureConnected } from '@apollosproject/ui-connected';

import VerticalCardListFeature from './VerticalCardListFeature';

const VerticalCardListFeatureConnected = (props) => (
  <CoreVerticalCardListFeatureConnected
    {...props}
    Component={VerticalCardListFeature}
  />
);

export default VerticalCardListFeatureConnected;
