import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';

import { styled, Touchable, H6, Icon, withTheme } from '@apollosproject/ui-kit';

const ActionBarItemWrapper = styled(({ theme }) => ({
  padding: theme.sizing.baseUnit,
  alignItems: 'center',
  justifyContent: 'center',
}))(View);

const StyledIcon = withTheme(({ theme }) => ({
  fill: theme.colors.primary,
}))(Icon);

const StyledLabel = styled(({ theme }) => ({
  textAlign: 'center',
  color: theme.colors.primary,
}))(H6);

const StyledTouchable = styled(({ theme }) => ({
  flex: 1,
  alignItems: 'center',
}))(Touchable);

const ActionBarItem = ({
  icon = 'empty',
  size,
  label = '',
  ...touchableProps
}) => (
  <StyledTouchable {...touchableProps}>
    <ActionBarItemWrapper>
      <StyledIcon size={size} name={icon} />

      {/* using stlye object here is just as efficient as creating a new styled component with prop, since UIText is already a styled component */}
      <StyledLabel>{label}</StyledLabel>
    </ActionBarItemWrapper>
  </StyledTouchable>
);

ActionBarItem.propTypes = {
  icon: PropTypes.string,
  size: PropTypes.number,
  label: PropTypes.string,
  tint: PropTypes.string,
};

export default withTheme(({ theme, ...props }) => ({
  tint: theme.colors.action.primary,
  size: theme.sizing.baseUnit * 1.5,
  ...props,
}))(ActionBarItem);
