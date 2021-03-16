import React, { useEffect } from 'react';
import gql from 'graphql-tag';
import PropTypes from 'prop-types';
import { useQuery } from '@apollo/client';
import { isEmpty } from 'lodash';
import ApollosConfig from '@apollosproject/config';

import { ActivityIndicator } from '@apollosproject/ui-kit';
import ActionBar from 'ui/ActionBar';

import ActionBarFeature from './ActionBarFeature';

const { FRAGMENTS } = ApollosConfig;

const GET_ACTION_BAR_FEATURE = gql`
  query getActionBarFeature($featureId: ID!) {
    node(id: $featureId) {
      ...ActionBarFeatureFragment
    }
  }
  ${FRAGMENTS.ACTION_BAR_FEATURE_FRAGMENT}
  ${FRAGMENTS.THEME_FRAGMENT}
  ${FRAGMENTS.RELATED_NODE_FRAGMENT}
`;

const ActionBarFeatureConnected = ({ featureId, refetchStatus, ...props }) => {
  const { data, loading, error, refetch } = useQuery(GET_ACTION_BAR_FEATURE, {
    fetchPolicy: 'cache-and-network',
    variables: { featureId },
    skip: isEmpty(featureId),
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

  if (error && !node?.actions?.length) return null;

  if (loading && !node?.actions?.length)
    return (
      <ActionBar>
        <ActivityIndicator />
      </ActionBar>
    );

  return <ActionBarFeature {...props} {...node} />;
};

ActionBarFeatureConnected.propTypes = {
  featureId: PropTypes.string,
  actions: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string,
      action: PropTypes.string,
      relatedNode: PropTypes.shape({
        id: PropTypes.string,
      }),
      theme: PropTypes.shape({
        colors: PropTypes.shape({
          primary: PropTypes.string,
        }),
      }),
    })
  ),
  isLoading: PropTypes.bool,
  listKey: PropTypes.string,
  onPressItem: PropTypes.func,
};

ActionBarFeatureConnected.defaultProps = {
  actions: [],
  onPressItem: () => null,
};

export default ActionBarFeatureConnected;
