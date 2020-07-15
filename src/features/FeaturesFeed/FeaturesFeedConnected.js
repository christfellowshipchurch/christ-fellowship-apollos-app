import React from 'react';

import { FeaturesFeedConnected as CoreFeaturesFeedConnected } from '@apollosproject/ui-connected';

import { HorizontalDivider } from 'ui/Dividers';

import VerticalCardListFeatureConnected from './VerticalCardListFeatureConnected';
import HeroListFeatureConnected from './HeroListFeatureConnected';

const MAPPINGS = {
    VerticalCardListFeature: VerticalCardListFeatureConnected,
    HeroListFeature: HeroListFeatureConnected,
};

const FeaturesFeedConnected = (props) => (
    <CoreFeaturesFeedConnected
        {...props}
        additionalFeatures={MAPPINGS}
        ItemSeparatorComponent={HorizontalDivider}
    />
);

export default FeaturesFeedConnected;
