import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';

import {
  styled,
  Touchable,
  UIText,
  H6,
  Icon,
  withTheme,
} from '@apollosproject/ui-kit';

const ActionBarItemWrapper = styled(({ theme }) => ({
  padding: theme.sizing.baseUnit,
  alignItems: 'center',
  justifyContent: 'center',
}))(View);

const ActionBarItem = ({
  icon = 'empty',
  tint,
  size,
  label = '',
  ...touchableProps
}) => (
    <Touchable {...touchableProps}>
      <ActionBarItemWrapper>
        <Icon fill={tint} size={size} name={icon} />

        {/* using stlye object here is just as efficient as creating a new styled component with prop, since UIText is already a styled component */}
        <H6 style={{ color: tint, textAlign: 'center' }}>{label}</H6>
      </ActionBarItemWrapper>
    </Touchable>
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
