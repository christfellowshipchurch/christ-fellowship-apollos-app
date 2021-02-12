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
import { useQuery } from '@apollo/client';
import { isEmpty } from 'lodash';

import { styled } from '@apollosproject/ui-kit';
import ButtonWithLinkRouting from 'ui/ButtonWithLinkRouting';
import { ItemSeparatorComponent } from '../UniversalContentItem';
import { ACTIONS_FRAGMENT } from '../getContentItem';

const GET_CONTENT_ACTIONS = gql`
  query getContentActions($nodeId: ID!) {
    node(id: $nodeId) {
      ...ActionsFragment
    }
  }

  ${ACTIONS_FRAGMENT}
`;

const StyledButton = styled(({ theme }) => ({
  marginVertical: theme.sizing.baseUnit * 0.5,
}))(ButtonWithLinkRouting);

const ButtonGroup = ({ nodeId }) => {
  // note : hack to get around a current bug with the skip prop
  const skip = !nodeId || isEmpty(nodeId);
  const { data } = useQuery(GET_CONTENT_ACTIONS, {
    variables: {
      nodeId,
    },
    skip,
    fetchPolicy: skip ? 'cache-only' : 'cache-and-network',
  });

  const actions = data?.node?.callsToAction;

  if (!actions || (Array.isArray(actions) && !actions.length)) return null;

  return (
    <ItemSeparatorComponent>
      {actions.map((n) => (
        <StyledButton
          key={`${n.call}:${n.action}`}
          title={n.call}
          pill={false}
          url={n.action}
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
