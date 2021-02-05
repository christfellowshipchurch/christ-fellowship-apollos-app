import React from 'react';
import PropTypes from 'prop-types';
import { styled, Button, NavigationService } from '@apollosproject/ui-kit';

const StyledButton = styled(({ theme }) => ({
  marginBottom: theme.sizing.baseUnit,
}))(Button);

const GroupChatButton = ({ channelId, groupName }) => {
  if (!channelId) {
    return null;
  }

  const handlePress = () =>
    NavigationService.navigate('ChatChannel', {
      channelId,
      name: groupName,
      nested: true,
    });

  return (
    <StyledButton
      onPress={handlePress}
      title={'Message Group'}
      type={'primary'}
      pill={false}
    />
  );
};

GroupChatButton.propTypes = {
  channelId: PropTypes.string,
  groupName: PropTypes.string,
};

export default GroupChatButton;
