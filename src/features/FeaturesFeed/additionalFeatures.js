import React, { useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { get } from 'lodash';
import {
  HeroListFeatureConnected,
  HorizontalCardListFeatureConnected,
  VerticalCardListFeatureConnected,
  GET_HERO_LIST_FEATURE,
  GET_HORIZONTAL_CARD_LIST_FEATURE,
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
  HeroListFeature: ({ featureId, refetchStatus, ...props }) => {
    const { loading, error, data, refetch } = useQuery(GET_HERO_LIST_FEATURE, {
      fetchPolicy: 'cache-and-network',
      variables: { featureId },
    });
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
      <HeroListFeature
        featureId={featureId}
        {...props}
        {...node}
        isLoading={loading && !node}
      />
    );
  },
  HorizontalCardListFeature: ({ featureId, refetchStatus, ...props }) => {
    const { loading, error, data, refetch } = useQuery(
      GET_HORIZONTAL_CARD_LIST_FEATURE,
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
      <HorizontalCardListFeature
        featureId={featureId}
        {...props}
        {...node}
        cards={get(node, 'cards', []).map(({ actionIcon, ...card }) => ({
          ...card,
          ...(actionIcon != null ? { actionIcon: card.actionIcon } : {}), // temp hack because ContentCard doesn't handle null action icon well
          coverImage: get(card, 'coverImage.sources', undefined),
          __typename: card.relatedNode.__typename,
          id: card.relatedNode.id,
        }))}
        isLoading={loading && !node}
      />
    );
  },
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
        featureId={featureId}
        {...props}
        {...node}
        cards={get(node, 'cards', []).map(({ actionIcon, ...card }) => ({
          ...card,
          ...(actionIcon != null ? { actionIcon: card.actionIcon } : {}), // temp hack because ContentCard doesn't handle null action icon well
          coverImage: get(card, 'coverImage.sources', undefined),
          __typename: card.relatedNode.__typename,
          id: card.relatedNode.id,
        }))}
        isLoading={loading && !node}
      />
    );
  },
};
