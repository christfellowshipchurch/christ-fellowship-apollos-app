import React from 'react';
import PropTypes from 'prop-types';
import { styled, Button } from '@apollosproject/ui-kit';

const StyledButton = styled(({ theme }) => ({
  marginBottom: theme.sizing.baseUnit,
}))(Button);

const GroupChatButton = ({ isLoading }) => (
  <StyledButton
    onPress={() => null}
    loading={isLoading}
    title={'Message Group'}
    type={'primary'}
    pill={false}
  />
);

GroupChatButton.propTypes = {
  isLoading: PropTypes.bool,
};

export default GroupChatButton;
