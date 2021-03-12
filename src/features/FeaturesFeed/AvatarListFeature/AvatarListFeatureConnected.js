import React from 'react';
import PropTypes from 'prop-types';
import { useQuery } from '@apollo/client';
import gql from 'graphql-tag';
import { isEmpty } from 'lodash';
import ApollosConfig from '@apollosproject/config';

import AvatarListFeature from './AvatarListFeature';

const { FRAGMENTS } = ApollosConfig;

const GET_AVATAR_LIST_FEATURE = gql`
  query getAvatarListFeature($featureId: ID!) {
    node(id: $featureId) {
      ...AvatarListFeatureFragment
    }
  }
  ${FRAGMENTS.AVATAR_LIST_FRAGMENT}
  ${FRAGMENTS.THEME_FRAGMENT}
  ${FRAGMENTS.RELATED_NODE_FRAGMENT}
`;

const AvatarListFeatureConnected = ({ featureId, ...props }) => {
  const { data, loading } = useQuery(GET_AVATAR_LIST_FEATURE, {
    fetchPolicy: 'cache-and-network',
    variables: { featureId },
    skip: isEmpty(featureId),
  });
  const node = data?.node;
  const hasPeople = node?.people.length > 0;

  if (!hasPeople && !loading) return null;

  return <AvatarListFeature {...props} {...node} />;
};

AvatarListFeatureConnected.propTypes = {
  featureId: PropTypes.string,
  onPressItem: PropTypes.func,
  primaryAction: PropTypes.shape({
    action: PropTypes.string,
    icon: PropTypes.string,
    theme: PropTypes.shape({}),
    relatedNode: PropTypes.shape({
      id: PropTypes.string,
    }),
  }),
};

AvatarListFeatureConnected.defaultProps = {};

export default AvatarListFeatureConnected;
