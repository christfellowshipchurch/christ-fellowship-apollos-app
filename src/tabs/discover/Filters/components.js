/**
 * components.js
 *
 * Author: Caleb Panza
 * Created: Mar 05, 2021
 *
 * For organizational purposes, all styled components that make up the Filters section are placed here.
 */

import { View } from 'react-native';
import Color from 'color';

import { Touchable, H6, styled } from '@apollosproject/ui-kit';

import { lightenBy, darkenBy } from 'utils/theme';

export const EndCapSpacer = styled(({ theme }) => ({
  width: theme.sizing.baseUnit * 0.5,
}))(View);

export const Container = styled(({ theme, active }) => ({
  paddingVertical: theme.sizing.baseUnit,
}))(View);

export const StyledH5 = styled(({ theme, active }) => ({
  color: active ? theme.colors.white : theme.colors.text.secondary,
  fontWeight: active ? 'bold' : 'normal',
  letterSpacing: 1,
  lineHeight: theme.helpers.verticalRhythm(0.5),
}))(H6);

export const RoundedBorder = styled(({ theme, active }) => {
  let borderColor = theme.colors.primary;

  if (!active) {
    const { screen } = theme.colors.background;
    borderColor = Color(screen).isDark()
      ? lightenBy(screen, 0.25).hex()
      : darkenBy(screen, 0.05).hex();
  }

  return {
    marginHorizontal: theme.sizing.baseUnit * 0.25,
    backgroundColor: active
      ? theme.colors.primary
      : theme.colors.background.screen,
    paddingVertical: theme.sizing.baseUnit * 0.5,
    paddingHorizontal: theme.sizing.baseUnit,
    borderWidth: 1,
    borderColor,
    borderRadius: theme.sizing.baseBorderRadius,
  };
})(View);

export const LoadingStateContainer = styled(({ theme }) => ({
  flexDirection: 'row',
  paddingVertical: theme.sizing.baseUnit,
  paddingLeft: theme.sizing.baseUnit - 10,
}))(View);

export const LoadingState = styled(({ theme }) => ({
  borderRadius: theme.sizing.baseBorderRadius,
  backgroundColor: theme.colors.background.inactive,
  height: theme.helpers.rem(0.5),
  width: '15%',
  marginHorizontal: 10,
}))(View);

export const StyledTouchable = styled(({ theme }) => ({
  borderRadius: theme.sizing.baseBorderRadius,
}))(Touchable);
