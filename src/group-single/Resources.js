import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { get } from 'lodash';
import { useApolloClient } from '@apollo/react-hooks';

import { PaddedView, H4, styled, ThemeMixin } from '@apollosproject/ui-kit';
import ActionListItem from '../ui/ActionListItem';
import { useLinkRouter } from '../hooks';

const GROUP_RESOURCE_INTERACTION = gql`
  mutation($nodeId: ID!, $action: InteractionAction!) {
    interactWithNode(nodeId: $nodeId, action: $action) {
      success
    }
  }
`;

const StyledH4 = styled(({ theme }) => ({
  paddingBottom: theme.sizing.baseUnit,
}))(H4);

const Resources = ({ resources, isLoading, navigation }) => {
  const { routeLink } = useLinkRouter();
  const client = useApolloClient();

  const trackResourceInteraction = (relatedNode, action) => {
    try {
      client.mutate({
        mutation: GROUP_RESOURCE_INTERACTION,
        variables: {
          nodeId: relatedNode.id,
          action: `GROUP_${action}`,
        },
      });
    } catch (err) {
      // Allow this analytics call to silently fail
    }
  };

  const handleResourcePress = ({ relatedNode, action }) => {
    trackResourceInteraction(relatedNode, action);

    if (action === 'READ_CONTENT') {
      navigation.navigate('ContentSingle', {
        itemId: relatedNode.id,
        transitionKey: 2,
      });
    }
    if (action === 'READ_EVENT') {
      navigation.navigate('Event', {
        eventId: relatedNode.id,
        transitionKey: 2,
      });
    }
    if (action === 'READ_PRAYER') {
      navigation.navigate('PrayerRequestSingle', {
        prayerRequestId: relatedNode.id,
        transitionKey: 2,
      });
    }
    if (action === 'READ_GROUP') {
      navigation.navigate('GroupSingle', {
        itemId: relatedNode.id,
        transitionKey: 2,
      });
    }
    if (action === 'OPEN_URL') {
      routeLink(relatedNode.url, { nested: true });
    }
  };

  return (
    <PaddedView>
      <StyledH4>{'Resources'}</StyledH4>
      {resources.map((resource) => {
        const { id, relatedNode, action, title } = resource;

        const isUrlResource = action === 'OPEN_URL';
        const actionListItemProps = isUrlResource
          ? {
              title,
              label: relatedNode.url,
              icon: 'link',
            }
          : {
              title,
              label: get(relatedNode, 'label'),
              imageSource: get(relatedNode, 'coverImage.sources[0].uri'),
            };

        const handleOnPress = () => handleResourcePress(resource);

        return (
          <ThemeMixin
            mixin={{ colors: { primary: 'rgba(120, 120, 128, 0.36)' } }}
            key={id}
          >
            <ActionListItem {...actionListItemProps} onPress={handleOnPress} />
          </ThemeMixin>
        );
      })}
    </PaddedView>
  );
};

Resources.propTypes = {
  resources: PropTypes.arrayOf(
    PropTypes.shape({
      url: PropTypes.string,
      title: PropTypes.string,
      contentChannelItem: PropTypes.string,
      relatedNode: PropTypes.shape({
        id: PropTypes.string,
      }),
      action: PropTypes.string,
      icon: PropTypes.string,
    })
  ),
  isLoading: PropTypes.bool,
};

export default Resources;
