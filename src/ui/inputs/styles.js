import { Icon, withTheme } from '@apollosproject/ui-kit';

// eslint-disable-next-line import/prefer-default-export
export const InputIcon = withTheme(
  ({ theme, error, disabled, icon, fill, focused, hideIcon }) => {
    const color = disabled
      ? theme.colors.text.tertiary
      : focused
        ? theme.colors.primary
        : theme.colors.text.secondary;

    return {
      name: icon,
      size: 20,
      marginHorizontal: theme.sizing.baseUnit * 0.5,
      fill: hideIcon ? 'transparent' : color,
    };
  }
)(Icon);
