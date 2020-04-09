import { compose } from 'recompose';
import { BottomTabBar } from 'react-navigation-tabs';

import { withTabBarMediaSpacer } from '@apollosproject/ui-media-player';
import { styled, withTheme } from '@apollosproject/ui-kit';

const ThemedBottomTabBar = compose(
  withTheme(({ theme }) => ({
    activeTintColor: theme.colors.primary,
    inactiveTintColor: theme.colors.text.tertiary,
    safeAreaInset: { bottom: 'never' },
  })),
  styled(({ theme }) => ({
    borderTopWidth: 0,
    backgroundColor: theme.colors.background.paper,
    paddingTop: theme.sizing.baseUnit * 0.8,
    paddingHorizontal: theme.sizing.baseUnit,
  })),
  withTabBarMediaSpacer
)(BottomTabBar);

export default ThemedBottomTabBar;
