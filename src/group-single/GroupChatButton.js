import React from 'react';
import PropTypes from 'prop-types';
import { styled, Button, NavigationService } from '@apollosproject/ui-kit';

const StyledButton = styled(({ theme }) => ({
  marginBottom: theme.sizing.baseUnit,
}))(Button);

const GroupChatButton = ({ channelId, channelType, groupName }) => {
  if (!channelId) {
    return null;
  }

  const handlePress = () =>
    NavigationService.navigate('Channel', {
      channelId,
      channelType,
      name: groupName,
      nested: true,
    });

  return (
    <StyledButton
      onPress={handlePress}
      title={`Message Group`}
      type={'primary'}
      pill={false}
    />
  );
};

GroupChatButton.propTypes = {
  channelId: PropTypes.string,
  channelType: PropTypes.string,
  groupName: PropTypes.string,
};

export default GroupChatButton;
