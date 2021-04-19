import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';

import {
  styled,
  Touchable,
  UIText,
  Icon,
  withTheme,
  InlineActivityIndicator,
} from '@apollosproject/ui-kit';

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
  fontSize: theme.helpers.rem(0.65),
  lineHeight: theme.helpers.verticalRhythm(0.65),
  fontFamily: theme.typography.sans.bold.default,
  paddingTop: 3,
}))(UIText);

const StyledTouchable = styled(({ theme }) => ({
  flex: 1,
  alignItems: 'center',
}))(Touchable);

const ActionBarItem = ({
  icon = 'empty',
  size,
  label = '',
  isLoading,
  ...touchableProps
}) => (
  <StyledTouchable {...touchableProps}>
    <ActionBarItemWrapper>
      {isLoading ? (
        <InlineActivityIndicator />
      ) : (
        <>
          <StyledIcon size={size} name={icon} />

          {/* using stlye object here is just as efficient as creating a new styled component with prop, since UIText is already a styled component */}
          <StyledLabel>{label}</StyledLabel>
        </>
      )}
    </ActionBarItemWrapper>
  </StyledTouchable>
);

ActionBarItem.propTypes = {
  icon: PropTypes.string,
  size: PropTypes.number,
  label: PropTypes.string,
  tint: PropTypes.string,
  isLoading: PropTypes.bool,
};

export default withTheme(({ theme, ...props }) => ({
  tint: theme.colors.action.primary,
  size: theme.sizing.baseUnit * 1.5,
  isLoading: false,
  ...props,
}))(ActionBarItem);
