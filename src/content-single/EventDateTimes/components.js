import React from 'react';
import { View, StyleSheet, Platform, Linking } from 'react-native';
import Color from 'color';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import {
  styled,
  withTheme,
  FlexedView,
  BodyText,
  Touchable,
} from '@apollosproject/ui-kit';

export const HorizontalLine = styled(({ theme }) => ({
  height: StyleSheet.hairlineWidth,
  backgroundColor: Color(
    Color(theme.colors.screen).isLight()
      ? theme.colors.black
      : theme.colors.white
  ).fade(0.1),
  opacity: 0.5,
  width: '70%',
  alignSelf: 'center',
  marginVertical: theme.sizing.baseUnit * 0.5,
}))(View);

export const Icon = withTheme(({ theme, icon, size }) => ({
  icon,
  size,
  color: theme.colors.text.tertiary,
  style: {
    marginRight: theme.sizing.baseUnit,
  },
}))(FontAwesomeIcon);

export const TextIconRow = ({ icon, fontSize, fontWeight, children }) => (
  <FlexedView
    style={{
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignItems: 'center',
    }}
  >
    <Icon icon={['fal', icon]} size={fontSize} />
    <BodyText style={{ fontWeight, fontSize }}>{children}</BodyText>
  </FlexedView>
);

export const ScheduleContainer = styled(({ theme }) => ({
  paddingVertical: theme.sizing.baseUnit * 0.5,
}))(View);

export const CampusContainer = styled(({ theme }) => ({
  // marginBottom: theme.sizing.baseUnit,
}))(View);

export const ContentContainer = styled(({ theme }) => ({
  paddingVertical: theme.sizing.baseUnit,
}))(View);

export const DirectionsTouchable = withTheme(({ theme, location }) => ({
  onPress: Platform.select({
    ios: () => {
      Linking.openURL(`http://maps.apple.com/maps?daddr=${location}`);
    },
    android: () => {
      Linking.openURL(`http://maps.google.com/maps?daddr=${location}`);
    },
  }),
  style: {
    marginVertical: theme.sizing.baseUnit,
  },
}))(Touchable);
