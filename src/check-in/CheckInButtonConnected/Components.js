import { View, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Color from 'color';

import {
  styled,
  Icon,
  withTheme,
  UIText,
  InlineActivityIndicator,
  PaddedView,
  BodyText,
} from '@apollosproject/ui-kit';

export const StyledButton = styled(
  ({ theme, disabled, isLoading, isCheckedIn }) => {
    let backgroundColor = Color(theme.colors.primary);

    if (isCheckedIn && !isLoading) {
      backgroundColor = Color(theme.colors.success);
    }

    if (isLoading || disabled) {
      backgroundColor = backgroundColor.mix(
        Color(theme.colors.background.screen)
      );
    }

    return {
      paddingVertical: theme.sizing.baseUnit * 0.25,
      paddingHorizontal: theme.sizing.baseUnit * 0.5,
      marginLeft: 5,
      backgroundColor: backgroundColor.hex(),
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: theme.sizing.baseBorderRadius,
      ...(isLoading ? { minWidth: 75 } : {}),
    };
  }
)(View);

export const ButtonTitle = styled(({ theme }) => ({
  fontSize: 12,
  color: theme.colors.background.screen,
  paddingHorizontal: theme.sizing.baseUnit * 0.25,
}))(UIText);

export const ButtonIcon = withTheme(({ theme }) => ({
  size: 16,
  fill: theme.colors.background.screen,
  style: { paddingHorizontal: theme.sizing.baseUnit * 0.25 },
}))(Icon);

export const ActivityIndicator = withTheme(({ theme }) => ({
  color: theme.colors.background.screen,
}))(InlineActivityIndicator);

export const FlexedSafeAreaView = styled(({ theme }) => ({
  flex: 1,
  justifyContent: 'space-between',
  padding: theme.sizing.baseUnit,
}))(SafeAreaView);

export const BottomSheetTitle = styled(({ theme }) => ({
  alignItems: 'center',
}))(View);

export const CheckBoxDisabled = styled(({ theme, checked }) => ({
  opacity: 0.5,
}))(View);

export const CheckBox = styled(({ theme, checked }) => ({
  borderWidth: 2,
  height: 24,
  width: 24,
  borderRadius: 3,
  borderColor: checked ? theme.colors.primary : theme.colors.text.secondary,
  justifyContent: 'center',
  alignItems: 'center',
}))(View);

export const CheckBoxTitle = styled(({ theme }) => ({
  paddingHorizontal: theme.sizing.baseUnit * 0.5,
}))(BodyText);

export const CheckIcon = withTheme(({ theme }) => ({
  fill: theme.colors.primary,
  name: 'check',
  size: 18,
}))(Icon);

export const CheckInContainer = styled(({ theme }) => ({
  flex: 1,
  justifyContent: 'flex-start',
  alignItems: 'center',
  textAlign: 'center',
}))(PaddedView);

export const Row = styled(({ theme }) => ({
  paddingVertical: theme.sizing.baseUnit * 0.5,
  flexDirection: 'row',
  justifyContent: 'flex-start',
  alignItems: 'center',
}))(View);

export const StyledFlatList = styled(({ theme }) => ({
  padding: theme.sizing.baseUnit,
}))(FlatList);
