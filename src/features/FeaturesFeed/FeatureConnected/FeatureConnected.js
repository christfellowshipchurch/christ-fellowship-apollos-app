/**
 * FeatureConnected.js
 *
 * Author: Caleb Panza
 * Created: Mar 08, 2021
 *
 * This component fetches data for a given Feature Id and also handles nested refetches when this component is mounted as a child of a FeatureFeedProvider
 */

import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { featuresFeedComponentMapper } from '@apollosproject/ui-connected';

import { useLinkRouter } from 'hooks';
import handleActionPress from '../handleActionPress';

import additionalFeatures from '../additionalFeatures';

const FeatureConnected = (props) => {
  const navigation = useNavigation();
  const { routeLink } = useLinkRouter();

  return featuresFeedComponentMapper({
    feature: props,
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

FeatureConnected.propTypes = {};
FeatureConnected.defaultProps = {};

export default FeatureConnected;
