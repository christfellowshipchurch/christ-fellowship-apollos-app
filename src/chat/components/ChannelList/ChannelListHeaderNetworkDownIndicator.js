import React from 'react';
import { View } from 'react-native';

import { styled, UIText } from '@apollosproject/ui-kit';
import { withTranslationContext } from '../../context';

const Container = styled({
  width: '100%',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '#fae6e8',
  padding: 3,
})(View);

const ErrorText = styled({
  color: 'red',
  padding: 3,
})(UIText);

const ChannelListHeaderNetworkDownIndicator = withTranslationContext(
  ({ t }) => (
    <Container>
      <ErrorText>{t('Connection failure, reconnecting now ...')}</ErrorText>
    </Container>
  )
);

export default ChannelListHeaderNetworkDownIndicator;
