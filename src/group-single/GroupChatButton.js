import React from 'react';
import PropTypes from 'prop-types';
import { styled, Button, NavigationService } from '@apollosproject/ui-kit';

import { useFeatureFlag } from '../hooks';

const StyledButton = styled(({ theme }) => ({
  marginBottom: theme.sizing.baseUnit,
}))(Button);

const GroupChatButton = ({ channelId, groupName }) => {
  const { enabled } = useFeatureFlag({ key: 'GROUP_CHAT' });

  if (!enabled || !channelId) {
    return null;
  }

  const handlePress = () =>
    NavigationService.navigate('Channel', {
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
