import React, { useState, useContext, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useQuery } from '@apollo/client';
import { isEmpty } from 'lodash';

import { AppState } from 'react-native';
import { GET_FEED_FEATURES } from '@apollosproject/ui-connected';
import { FeedView } from '@apollosproject/ui-kit';

import { HorizontalDivider } from 'ui/Dividers';
import { FeatureConnected } from './FeatureConnected';

const loadingStateObject = [
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

const FeaturesFeedContext = React.createContext([]);

export const useFeaturesFeed = () => useContext(FeaturesFeedContext);

const FeaturesFeedConnected = ({
  ItemSeparatorComponent,
  featureFeedId,
  additionalFeatures,
  ...props
}) => {
  const appState = useRef(AppState.currentState);
  const [fetchDate, setFetchDate] = useState(new Date());
  const [features, setFeatures] = useState([]);
  const skip = !featureFeedId || isEmpty(featureFeedId);
  const { loading, error, refetch } = useQuery(GET_FEED_FEATURES, {
    skip,
    returnPartialData: true,
    partialRefetch: true,
    fetchPolicy: 'network-only',
    variables: {
      featureFeedId,
    },
    onCompleted: (data) => {
      const fetchedFeatures = data?.node?.features;

      /**
       * note : check to make sure we have the expected return data type and then map it to an array of String Ids
       * */

      if (!!fetchedFeatures && Array.isArray(fetchedFeatures)) {
        const fetchedFeatureIds = fetchedFeatures.map(({ id }) => id);
        const currentFeatureIds = features.map(({ id }) => id);

        if (
          JSON.stringify(currentFeatureIds) ===
          JSON.stringify(fetchedFeatureIds)
        ) {
          /**
           * note : if the new data fetch is the same as the current collection of Feature Ids in the provider, we want to set the fetch date to be right now so that Features in the Feature Feed will refetch their queries
           */
          setFetchDate(new Date());
        } else {
          /**
           * note : if the data fetch is not the same, let's just update the `featureIds` with our new Ids to rerender the Feature Feed with our new Feed shape
           */
          setFeatures(fetchedFeatures);
        }
      }
    },
  });
  const renderItem = ({ item }) => (
    <FeatureConnected {...item} additionalFeatures={additionalFeatures} />
  );

  /**
   * we've gotten feedback that it's not obvious to all users that we can pull-to-refresh data. Along with pull-to-refresh, we will also listen to App State changes and run `refetch` when our app comes back into 'active' state
   */
  const _handleAppStateChange = (nextAppState) => {
    if (nextAppState === 'active') {
      refetch();
    }
  };

  useEffect(() => {
    AppState.addEventListener('change', _handleAppStateChange);

    return () => {
      AppState.removeEventListener('change', _handleAppStateChange);
    };
  }, []);

  if (!featureFeedId) {
    return (
      <FeedView
        loadingStateData={loadingStateObject}
        renderItem={renderItem}
        loading
        refetch={refetch}
        {...props}
      />
    );
  }

  return (
    <FeaturesFeedContext.Provider value={{ features, fetchDate }}>
      <FeedView
        content={features}
        renderItem={renderItem}
        loading={loading && !features}
        refetch={refetch}
        error={error && !features}
        ItemSeparatorComponent={ItemSeparatorComponent}
        {...props}
      />
    </FeaturesFeedContext.Provider>
  );
};

FeaturesFeedConnected.propTypes = {
  additionalFeatures: PropTypes.shape({}),
  ItemSeparatorComponent: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.object,
  ]),
  featureFeedId: PropTypes.string,
};

FeaturesFeedConnected.defaultProps = {
  additionalFeatures: {},
  ItemSeparatorComponent: HorizontalDivider,
  featureFeedId: null,
};

export default FeaturesFeedConnected;
