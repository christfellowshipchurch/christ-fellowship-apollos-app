import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Query } from '@apollo/client/react/components';
import { get } from 'lodash';

import { FeedView } from '@apollosproject/ui-kit';

import { featuresFeedComponentMapper } from '@apollosproject/ui-connected';
import additionalFeatures from '../additionalFeatures';
import GET_EVENTS_FEED_FEATURES from './getEventsFeedFeatures';

class FeaturesFeedConnected extends PureComponent {
  static propTypes = {
    Component: PropTypes.oneOfType([
      PropTypes.node,
      PropTypes.func,
      PropTypes.object, // type check for React fragments
    ]),
    onPressActionItem: PropTypes.func,
    additionalFeatures: PropTypes.shape({}),
  };

  refetchFunctions = {};

  loadingStateObject = [
    {
      isLoading: true,
      __typename: 'VerticalCardListFeature',
      isFeatured: true,
      id: 'feature1',
    },
    { isLoading: true, __typename: 'ActionListFeature', id: 'feature2' },
    {
      isLoading: true,
      __typename: 'HorizontalCardListFeature',
      id: 'feature3',
    },
    { isLoading: true, __typename: 'VerticalCardListFeature', id: 'feature4' },
  ];

  renderFeatures = ({ item }) =>
    featuresFeedComponentMapper({
      feature: item,
      refetchRef: this.refetchRef,
      onPressActionItem: this.props.onPressActionItem,
      additionalFeatures: {
        ...additionalFeatures,
        ...this.props.additionalFeatures,
      },
    });

  // eslint-disable-next-line
  refetchRef = ({ refetch, id }) => (this.refetchFunctions[id] = refetch);

  refetch = () => {
    Promise.all(Object.values(this.refetchFunctions).map((rf) => rf()));
  };

  render() {
    const { Component, onPressActionItem, ...props } = this.props;
    return (
      <Query query={GET_EVENTS_FEED_FEATURES} fetchPolicy="cache-and-network">
        {({ error, data, loading, refetch }) => {
          const features = get(data, 'eventsFeedFeatures', []);
          this.refetchRef({ refetch, id: 'eventsFeed' });
          return (
            <FeedView
              error={error}
              content={features}
              loadingStateData={this.loadingStateData}
              renderItem={this.renderFeatures}
              loading={loading}
              refetch={this.refetch}
              {...props}
            />
          );
        }}
      </Query>
    );
  }
}

export default FeaturesFeedConnected;
