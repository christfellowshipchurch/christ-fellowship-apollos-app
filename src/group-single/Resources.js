import React from 'react';
import PropTypes from 'prop-types';
import { Button, H4, PaddedView, styled } from '@apollosproject/ui-kit';
import { useLinkRouter } from '../hooks';

const StyledH4 = styled(({ theme }) => ({
  paddingBottom: theme.sizing.baseUnit,
}))(H4);

const StyledButton = styled(({ theme }) => ({
  marginBottom: theme.sizing.baseUnit * 0.5,
}))(Button);

const Resources = ({ resources, isLoading, navigation }) => {
  const { routeLink } = useLinkRouter();
  return (
    <PaddedView>
      <StyledH4>{'Resources'}</StyledH4>
      {resources.map(({ id, relatedNode, action, title }) => {
        // TODO: move to outside the render cycle and the `Resources` component. This looks like it would make a good `switch` statement
        const handleOnPress = () => {
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
          <StyledButton
            onPress={() => handleOnPress()}
            type={'secondary'}
            bordered
            loading={isLoading}
            pill={false}
            title={title}
            key={id}
          />
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
