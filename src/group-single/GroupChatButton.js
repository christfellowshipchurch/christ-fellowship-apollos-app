import React from 'react';
import PropTypes from 'prop-types';
import { useNavigation } from '@react-navigation/native';

import { View } from 'react-native';
import { styled, withTheme, Button, H4, Icon } from '@apollosproject/ui-kit';

const StyledButton = styled(({ theme }) => ({
  marginBottom: theme.sizing.baseUnit,
}))(Button);

const ButtonContentLayout = styled(({ theme }) => ({
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
}))(View);

const IconSpacing = styled(({ theme }) => ({
  paddingRight: theme.sizing.baseUnit * 0.3,
}))(View);

const StyledIcon = withTheme(({ theme }) => ({
  name: 'chat-conversation',
  size: 18,
}))(Icon);

const GroupChatButton = ({ channelId, groupName }) => {
  const navigation = useNavigation();

  if (!channelId) {
    return null;
  }

  const handlePress = () =>
    navigation.navigate('ChatChannel', {
      channelId,
      name: groupName,
    });

  return (
    <StyledButton onPress={handlePress} type={'primary'} pill={false}>
      <ButtonContentLayout>
        <IconSpacing>
          <StyledIcon />
        </IconSpacing>

        <H4>Message Group</H4>
      </ButtonContentLayout>
    </StyledButton>
  );
};

GroupChatButton.propTypes = {
  channelId: PropTypes.string,
  groupName: PropTypes.string,
};

export default GroupChatButton;
