import React from 'react';
import { View } from 'react-native';

import { styled, UIText } from '@apollosproject/ui-kit';
import { lightenBy } from 'utils/theme';
import { withTranslationContext } from '../../context';

const Container = styled(({ theme }) => ({
  width: '100%',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: lightenBy(theme.colors.alert, 0.25).hex(),
  padding: 3,
}))(View);

const ErrorText = styled(({ theme }) => ({
  color: theme.colors.alert,
  padding: 3,
}))(UIText);

const ChannelListHeaderNetworkDownIndicator = withTranslationContext(
  ({ t }) => (
    <Container>
      <ErrorText>{t('Connection failure, reconnecting now ...')}</ErrorText>
    </Container>
  )
);

export default ChannelListHeaderNetworkDownIndicator;
