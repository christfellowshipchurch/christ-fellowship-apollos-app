/**
 * FeatureConnected.js
 *
 * Author: Caleb Panza
 * Created: Mar 08, 2021
 *
 * This component fetches data for a given Feature Id and also handles nested refetches when this component is mounted as a child of a FeatureFeedProvider
 */

import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useQuery } from '@apollo/client';
import { useNavigation } from '@react-navigation/native';
import { isEmpty, get } from 'lodash';
import {
  featuresFeedComponentMapper,
  GET_HERO_LIST_FEATURE,
  GET_HORIZONTAL_CARD_LIST_FEATURE,
  GET_VERTICAL_CARD_LIST_FEATURE,
} from '@apollosproject/ui-connected';

import { useLinkRouter } from 'hooks';
import { useFeaturesFeed } from '../FeaturesFeedConnected';
import handleActionPress from '../handleActionPress';

import additionalFeatures from '../additionalFeatures';
import GET_FEATURE, {
  GET_ACTION_BAR_FEATURE,
  GET_AVATAR_LIST_FEATURE,
} from './getFeature';

/**
 * note : network connectivity with the mobile app in production is really shotty for some reason. In an effort to help eliviate some pressure, we are going to select the query for this instance of a Feature based on the typename. As a fallback, we'll just fetch the Id for the feature
 */
const QUERY_MAP = {
  ActionBarFeature: GET_ACTION_BAR_FEATURE,
  AvatarListFeature: GET_AVATAR_LIST_FEATURE,
  HeroListFeature: GET_HERO_LIST_FEATURE,
  HorizontalCardListFeature: GET_HORIZONTAL_CARD_LIST_FEATURE,
  VerticalCardListFeature: GET_VERTICAL_CARD_LIST_FEATURE,
};

const FeatureConnected = ({ id: featureId }) => {
  const skip = !featureId || isEmpty(featureId);
  const [typename] = featureId.split(':');
  const query = get(QUERY_MAP, typename, GET_FEATURE);

  const [feature, setFeature] = useState({ __typename: typename });
  const [failAttempt, setFailAttempt] = useState(0);
  const navigation = useNavigation();
  const { routeLink } = useLinkRouter();
  const { fetchDate } = useFeaturesFeed(featureId);
  const { loading, error, refetch } = useQuery(query, {
    skip,
    fetchPolicy: 'cache-and-network',
    variables: {
      featureId,
    },
    onError: () => {
      /**
       * Increment our fail attempt by 1 and trigger a refetch.
       *
       * note : we limit this to 3 attempts
       */
      if (failAttempt < 3) {
        setFailAttempt(failAttempt + 1);
        refetch();
      }
    },
    onCompleted: (data) => {
      const fetchedFeature = data?.node;

      if (fetchedFeature) {
        setFeature(fetchedFeature);
      }

      /**
       * Reset our fail attempt for subsequent refetches
       */
      if (failAttempt > 0) {
        setFailAttempt(0);
      }
    },
  });

  useEffect(
    () => {
      if (!loading) {
        refetch();
      }
    },
    [fetchDate, refetch]
  );

  if (error && !feature) return null;

  return featuresFeedComponentMapper({
    feature: {
      ...feature,
      isLoading: loading && !feature?.id,
    },
    onPressActionItem: (args) =>
      handleActionPress({
        ...args,
        navigation,
        openUrl: (url) => routeLink(url, { nested: true }),
      }),
    openUrl: (url) => routeLink(url, { nested: true }),
    additionalFeatures,
  });
};

FeatureConnected.propTypes = {
  Component: PropTypes.oneOfType([PropTypes.func, PropTypes.element]),
  forceLoading: PropTypes.bool,
};
FeatureConnected.defaultProps = {
  Component: () => null,
  forceLoading: false,
};

export default FeatureConnected;
