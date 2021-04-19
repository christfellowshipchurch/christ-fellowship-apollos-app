import { View, StyleSheet } from 'react-native';
import { styled } from '@apollosproject/ui-kit';

// eslint-disable-next-line import/prefer-default-export
export const HorizontalDivider = styled(({ theme }) => ({
  height: StyleSheet.hairlineWidth,
  backgroundColor: theme.colors.text.primary,
  opacity: 0.35,
  width: '70%',
  marginVertical: theme.sizing.baseUnit * 2,
  alignSelf: 'center',
}))(View);

// eslint-disable-next-line import/prefer-default-export
export const VerticalDivider = styled(({ theme }) => ({
  width: StyleSheet.hairlineWidth,
  backgroundColor: theme.colors.text.primary,
  opacity: 0.35,
  height: '70%',
  marginHorizontal: theme.sizing.baseUnit * 2,
  alignSelf: 'center',
}))(View);
