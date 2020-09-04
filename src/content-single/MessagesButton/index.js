import React from 'react';
import PropTypes from 'prop-types';
import SendSMS from 'react-native-sms';

import { withTheme, Button, H4, Icon } from '@apollosproject/ui-kit';

const handleSendMessage = (recipients) => {
  SendSMS.send(
    {
      //Recipients Number
      recipients,
      //An array of types that would trigger a "completed" response when using android
      successTypes: ['sent', 'queued'],
    },
    (completed, cancelled, error) => {
      if (completed) {
        console.log('SMS Sent Completed');
      } else if (cancelled) {
        console.log('SMS Sent Cancelled');
      } else if (error) {
        console.log('Some error occured');
      }
    }
  );
};

const StyledIcon = withTheme(({ theme }) => ({
  style: { marginRight: theme.sizing.baseUnit * 0.5 },
  fill: theme.colors.primary,
}))(Icon);

const MessagesButton = ({ buttonText, recipients, isLoading, disabled }) => {
  return (
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
};

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
