import React from 'react';
import { View, Platform } from 'react-native';
import { styled, withTheme, Icon, UIText } from '@apollosproject/ui-kit';

const Container = styled(({ theme }) => ({
  alignItems: 'center',
  justifyContent: 'flex-start',
  paddingHorizontal: theme.sizing.baseUnit,
  flexDirection: 'row',
}))(View);

const Title = styled(({ theme }) => ({
  textTransform: 'uppercase',
  fontWeight: Platform.select({
    ios: '900',
    android: 'bold',
  }),
  marginLeft: 5,
  fontSize: 16,
  color: theme.colors.text.primary,
  ...Platform.select({
    ios: {
      lineHeight: 0,
    },
  }),
}))(UIText);

const BrandIcon = withTheme(({ theme }) => ({
  fill: theme.colors.primary,
  name: 'brand',
  size: 20,
}))(Icon);

const Wordmark = () => (
  <Container>
    <BrandIcon />
    <Title>CHRIST FELLOWSHIP</Title>
  </Container>
);

export default Wordmark;
