// This file was largely copied from `FeaturesFeedConnected`
// from the @apollosproject/ui-connected package
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { View, ScrollView } from 'react-native';
import { useQuery } from '@apollo/client';
import { get, isEmpty } from 'lodash';
import gql from 'graphql-tag';

import { styled } from '@apollosproject/ui-kit';
import {
  featuresFeedComponentMapper,
  GET_FEATURE_FEED,
} from '@apollosproject/ui-connected';

import HorizontalFeatureFeed from 'ui/HorizontalFeatureFeed';
import { VerticalDivider, HorizontalDivider } from 'ui/Dividers';
import PrayerFeatureConnected from '../PrayerFeatureConnected';
import LiveStreamListFeatureConnected from '../LiveStreamListFeatureConnected';

import { useFeaturesFeed } from '../../FeaturesFeed/FeaturesFeedConnected';

// getHomeFeed uses the HOME_FEATURES in the config.yml
// You can also hardcode an ID if you are confident it will never change
// Or use some other strategy to get a FeatureFeed.id
export const GET_HOME_FEED = gql`
  query getHomeHeaderFeatureFeed {
    homeHeaderFeedFeatures {
      id
    }
  }
`;

// The Core Components for Features are created to work for a feed-type view.
// Since we have a completely different type of horizontal scrolling experience
// for Header Features, we want to override all Core Components with a `null`
// value so that we don't accidentally add a feature that breaks the entire UI.
// This will also allow for us to backlog specific items to go in and create
// experiences for each of these Feature types that are unique to this visual
// expression
const MAPPINGS = {
  ActionListFeature: () => null,
  HeroListFeature: () => null,
  HorizontalCardListFeature: () => null,
  VerticalCardListFeature: () => null,
  PrayerListFeature: PrayerFeatureConnected,
  LiveStreamListFeature: LiveStreamListFeatureConnected,
};

const Container = styled(({ theme }) => ({
  flexDirection: 'row',
  paddingHorizontal: theme.sizing.baseUnit * 0.5,
  paddingVertical: theme.sizing.baseUnit * 0.5,
}))(View);

const StyledVerticalDivider = styled(({ theme }) => ({
  alignSelf: 'flex-end',
  marginHorizontal: theme.sizing.baseUnit * 0.5,
}))(VerticalDivider);

const StyledHorizontalDivider = styled(({ theme }) => ({
  width: '100%',
  marginTop: theme.sizing.baseUnit * 0.25,
  marginBottom: theme.sizing.baseUnit,
  opacity: 0.25,
}))(HorizontalDivider);

const mapFeatures = (
  features,
  { additionalFeatures = [], onPressActionItem } = {}
) =>
  features.map((item, i) =>
    featuresFeedComponentMapper({
      feature: {
        ...item,
        ItemSeparatorComponent:
          i < features.length - 1 ? StyledVerticalDivider : null,
      },
      onPressActionItem,
      additionalFeatures: { ...MAPPINGS, ...additionalFeatures },
    })
  );

const HorizontalFeaturesFeedConnected = ({
  features,
  error,
  isLoading,
  ...props
}) => {
  if (error) return null;
  if (isLoading && !features.length) return <HorizontalFeatureFeed isLoading />;

  return features.length > 0 ? (
    <View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} {...props}>
        <Container>{mapFeatures(features)}</Container>
      </ScrollView>
      <StyledHorizontalDivider />
    </View>
  ) : null;
};

HorizontalFeaturesFeedConnected.propTypes = {
  additionalFeatures: PropTypes.shape({}),
  error: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
    PropTypes.object,
  ]),
  features: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
    })
  ),
  isLoading: PropTypes.bool,
  onPressActionItem: PropTypes.func,
  Component: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.func,
    PropTypes.object, // type check for React fragments
  ]),
};

HorizontalFeaturesFeedConnected.defaultProps = {
  error: null,
  features: [],
  isLoading: false,
  onPressActionItem: () => null,
};

export default HorizontalFeaturesFeedConnected;
