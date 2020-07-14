import React from 'react';

import { FeaturesFeedConnected as CoreFeaturesFeedConnected } from '@apollosproject/ui-connected';

import VerticalCardListFeatureConnected from './VerticalCardListFeatureConnected';

const MAPPINGS = {
    VerticalCardListFeature: VerticalCardListFeatureConnected,
};

const FeaturesFeedConnected = (props) => (
    <CoreFeaturesFeedConnected {...props} additionalFeatures={MAPPINGS} />
);

export default FeaturesFeedConnected;
