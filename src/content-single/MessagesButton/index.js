import React from 'react';
import { Linking } from 'react-native';
import PropTypes from 'prop-types';

import { withTheme, Button, H4, Icon } from '@apollosproject/ui-kit';

const handleSendMessage = (recipients) => {
  const recString = recipients.join(',');
  Linking.openURL(`sms:${recString}`);
};

const StyledIcon = withTheme(({ theme }) => ({
  style: { marginRight: theme.sizing.baseUnit * 0.5 },
  fill: theme.colors.primary,
}))(Icon);

const MessagesButton = ({ buttonText, recipients, isLoading, disabled }) => (
  <Button
    disabled={disabled || isLoading}
    isLoading={isLoading}
    pill={false}
    onPress={() => {
      handleSendMessage(recipients);
    }}
    bordered
  >
    <StyledIcon name="message-bubble" size={16} />
    <H4>{buttonText}</H4>
  </Button>
);

MessagesButton.propTypes = {
  buttonText: PropTypes.string,
  recipients: PropTypes.arrayOf(PropTypes.string),
  isLoading: PropTypes.bool,
  disabled: PropTypes.bool,
};

MessagesButton.defaultProps = {
  buttonText: 'Send Message',
};

export default MessagesButton;
