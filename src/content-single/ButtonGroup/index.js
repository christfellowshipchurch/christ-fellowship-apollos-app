/**
 * ButtonGroup.js
 *
 * Author: Caleb Panza
 * Created: Feb 11, 2021
 *
 * Renders a group of buttons for a given Content Item
 */

import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { useNavigation } from '@react-navigation/native';
import { useQuery } from '@apollo/client';
import { isEmpty } from 'lodash';
import ApollosConfig from '@apollosproject/config';
import { useLinkRouter } from 'hooks';

import { styled, Button } from '@apollosproject/ui-kit';
import ButtonWithLinkRouting from 'ui/ButtonWithLinkRouting';
import { handleActionPress } from 'features';
import { ItemSeparatorComponent } from '../ContentBody';
import { ACTIONS_FRAGMENT } from '../getContentItem';

const { FRAGMENTS } = ApollosConfig;
const { RELATED_NODE_FRAGMENT } = FRAGMENTS;

const GET_CONTENT_ACTIONS = gql`
  query getContentActions($nodeId: ID!) {
    nodeActions(nodeId: $nodeId) {
      action
      title
      relatedNode {
        ...RelatedFeatureNodeFragment
      }
    }
  }

  ${RELATED_NODE_FRAGMENT}
`;

const StyledButton = styled(({ theme }) => ({
  marginVertical: theme.sizing.baseUnit * 0.5,
}))(Button);

const ButtonGroup = ({ nodeId }) => {
  // note : hack to get around a current bug with the skip prop
  const skip = !nodeId || isEmpty(nodeId);
  const navigation = useNavigation();
  const { routeLink } = useLinkRouter();
  const { data, error, loading } = useQuery(GET_CONTENT_ACTIONS, {
    variables: {
      nodeId,
    },
    skip,
    fetchPolicy: 'cache-first',
  });

  const actions = data?.nodeActions;

  if (!actions || (Array.isArray(actions) && !actions.length)) return null;

  return (
    <ItemSeparatorComponent>
      {actions.map((n) => (
        <StyledButton
          key={`${n?.title}:${n?.relatedNode?.id}`}
          title={n?.title}
          pill={false}
          onPress={() =>
            handleActionPress({
              ...n,
              navigation,
              openUrl: (url) => routeLink(url, { nested: true }),
            })
          }
        />
      ))}
    </ItemSeparatorComponent>
  );
};

ButtonGroup.propTypes = {
  nodeId: PropTypes.string,
};
ButtonGroup.defaultProps = {};

export default ButtonGroup;
