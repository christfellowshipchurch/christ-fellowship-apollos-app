import React, { useEffect } from 'react';
import { useQuery } from '@apollo/client';
import {
  HeroListFeatureConnected,
  HorizontalCardListFeatureConnected,
  VerticalCardListFeatureConnected,
  GET_VERTICAL_CARD_LIST_FEATURE,
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
  VerticalCardListFeature: ({ featureId, refetchStatus, ...props }) => {
    const { loading, error, data, refetch } = useQuery(
      GET_VERTICAL_CARD_LIST_FEATURE,
      {
        fetchPolicy: 'cache-and-network',
        variables: { featureId },
      }
    );
    const node = data?.node;

    useEffect(
      () => {
        if (!loading && refetchStatus === 2) {
          refetch();
        }
      },
      [refetchStatus]
    );

    return (
      <VerticalCardListFeature
        {...props}
        {...node}
        isLoading={loading && !node}
      />
    );
  },
};
