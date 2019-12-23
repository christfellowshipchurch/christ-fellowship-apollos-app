import { compose } from 'recompose';
import { BottomTabBar } from 'react-navigation-tabs';

import { withTabBarMediaSpacer } from '@apollosproject/ui-media-player';
import { styled, withTheme } from '@apollosproject/ui-kit';

const ThemedBottomTabBar = compose(
  withTheme(({ theme }) => ({
    // showLabel: false,
    activeTintColor: theme.colors.primary,
    inactiveTintColor: theme.colors.text.tertiary,
    safeAreaInset: { bottom: 'never' },
  })),
  styled(({ theme }) => ({
    borderTopWidth: 0,
    backgroundColor: theme.colors.background.paper,
    paddingHorizontal: theme.sizing.baseUnit * 2.5,
  })),
  withTabBarMediaSpacer
)(BottomTabBar);

export default ThemedBottomTabBar;
