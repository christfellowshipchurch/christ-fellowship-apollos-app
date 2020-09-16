import React from 'react';

import styled from '@stream-io/styled-components';
import { ActivityIndicator } from '@apollosproject/ui-kit';

const Container = styled.View`
  width: 100%;
  justify-content: center;
  align-items: center;
  ${({ theme }) => theme.channelListFooterLoadingIndicator.container.css}
`;

const ChannelListFooterLoadingIndicator = () => (
  <Container>
    <ActivityIndicator size={'large'} />
  </Container>
);

export default ChannelListFooterLoadingIndicator;
