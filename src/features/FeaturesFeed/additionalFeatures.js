import React from 'react';
import {
  HeroListFeatureConnected,
  HorizontalCardListFeatureConnected,
  VerticalCardListFeatureConnected,
} from '@apollosproject/ui-connected';

import { ActionBarFeatureConnected } from './ActionBarFeature';
import { AvatarListFeatureConnected } from './AvatarListFeature';
import HeroListFeature from './HeroListFeature';
import HorizontalCardListFeature from './HorizontalCardListFeature';
import VerticalCardListFeature from './VerticalCardListFeature';

export default {
  ActionBarFeature: ActionBarFeatureConnected,
  AvatarListFeature: AvatarListFeatureConnected,
  HeroListFeature: (props) => (
    <HeroListFeatureConnected {...props} Component={HeroListFeature} />
  ),
  HorizontalCardListFeature: (props) => (
    <HorizontalCardListFeatureConnected
      {...props}
      Component={HorizontalCardListFeature}
    />
  ),
  VerticalCardListFeature: (props) => (
    <VerticalCardListFeatureConnected
      {...props}
      Component={VerticalCardListFeature}
    />
  ),
};
