import React from 'react';
import PropTypes from 'prop-types';

import { Button, BodySmall, Icon, withTheme } from '@apollosproject/ui-kit';

const StyledButton = withTheme(({ theme }) => ({
  style: {
    height: theme.sizing.baseUnit * 2,
    alignSelf: 'flex-end',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0,
  },
}))(Button);

const StyledIcon = withTheme(({ size, theme }) => ({
  size: (size || theme.sizing.baseUnit * 2) * 0.4375,
  style: {
    marginRight: theme.sizing.baseUnit * 0.5,
  },
}))(Icon);

const EditGroupButton = (props) => (
  <StyledButton bordered onPress={props.onPress}>
    <StyledIcon name="settings" />
    <BodySmall bold>Edit Group</BodySmall>
  </StyledButton>
);

EditGroupButton.propTypes = {
  onPress: PropTypes.func.isRequired,
};

export default EditGroupButton;
