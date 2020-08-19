import React from 'react';
import PropTypes from 'prop-types';
import SendSMS from 'react-native-sms';

import { styled, Button } from '@apollosproject/ui-kit';

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

const StyledButton = styled(({ theme }) => {})(Button);

const MessagesButton = ({ buttonText, recipients, isLoading, disabled }) => {
  return (
    <>
      <StyledButton
        disabled={disabled || isLoading}
        isLoading={isLoading}
        onPress={() => {
          handleSendMessage(recipients);
        }}
        title={buttonText}
      />
    </>
  );
};

MessagesButton.propTypes = {
  buttonText: PropTypes.string,
  recipients: PropTypes.arrayOf(PropTypes.string),
  isLoading: PropTypes.bool,
  disabled: PropTypes.bool,
};

MessagesButton.defaultProps = {
  buttonText: 'Messages',
};

export default MessagesButton;
