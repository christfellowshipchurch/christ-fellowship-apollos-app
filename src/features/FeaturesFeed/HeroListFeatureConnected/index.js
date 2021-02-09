import React from 'react';

import { HeroListFeatureConnected as CoreHeroListFeatureConnected } from '@apollosproject/ui-connected';
import HeroListFeature from './HeroListFeature';

const HeroListFeatureConnected = (props) => (
  <CoreHeroListFeatureConnected {...props} Component={HeroListFeature} />
);

export default HeroListFeatureConnected;
