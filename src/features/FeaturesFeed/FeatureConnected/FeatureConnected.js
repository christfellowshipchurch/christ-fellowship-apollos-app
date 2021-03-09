/**
 * FeatureConnected.js
 *
 * Author: Caleb Panza
 * Created: Mar 08, 2021
 *
 * This component fetches data for a given Feature Id and also handles nested refetches when this component is mounted as a child of a FeatureFeedProvider
 */

import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useQuery } from '@apollo/client';
import { useNavigation } from '@react-navigation/native';
import { isEmpty } from 'lodash';
import { featuresFeedComponentMapper } from '@apollosproject/ui-connected';

import { useLinkRouter } from 'hooks';
import { useFeaturesFeed } from '../FeaturesFeedConnected';
import handleActionPress from '../handleActionPress';

import localFeatures from '../additionalFeatures';
import GET_FEATURE from './getFeature';

const FeatureConnected = (props) => {
  const { id: featureId, additionalFeatures } = props;
  const skip = !featureId || isEmpty(featureId);
  const navigation = useNavigation();
  const { routeLink } = useLinkRouter();
  const { fetchDate } = useFeaturesFeed(featureId);
  const { data, loading, error, refetch } = useQuery(GET_FEATURE, {
    skip,
    returnPartialData: true,
    partialRefetch: true,
    fetchPolicy: 'cache-and-network',
    variables: {
      featureId,
    },
  });

  useEffect(
    () => {
      refetch();
    },
    [fetchDate, refetch]
  );

  if (error) return null;

  // todo : loading state
  if (loading && !data?.node?.id) return null;
  if (!data?.node?.id) return null;

  return featuresFeedComponentMapper({
    feature: data?.node,
    onPressActionItem: (args) =>
      handleActionPress({
        ...args,
        navigation,
        openUrl: (url) => routeLink(url, { nested: true }),
      }),
    openUrl: (url) => routeLink(url, { nested: true }),
    additionalFeatures: {
      ...localFeatures,
      ...additionalFeatures,
    },
  });
};

FeatureConnected.propTypes = {
  Component: PropTypes.oneOfType([PropTypes.func, PropTypes.element]),
};
FeatureConnected.defaultProps = {
  Component: () => null,
};

export default FeatureConnected;
