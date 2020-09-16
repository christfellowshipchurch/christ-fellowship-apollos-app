import React from 'react';
import { View } from 'react-native';
import { styled, ActivityIndicator } from '@apollosproject/ui-kit';

const Container = styled({
  width: '100%',
  justifyContent: 'center',
  alignItems: 'center',
})(View);

const ChannelListFooterLoadingIndicator = () => (
  <Container>
    <ActivityIndicator />
  </Container>
);

export default ChannelListFooterLoadingIndicator;
