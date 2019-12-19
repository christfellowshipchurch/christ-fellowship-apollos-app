import React, { useState } from 'react';
import { useQuery } from 'react-apollo';
import { get } from 'lodash';
import {
  Card,
  TouchableScale,
  styled,
  H4,
  FlexedView,
  withTheme,
} from '@apollosproject/ui-kit';
import { WebBrowserConsumer } from 'ChristFellowship/src/ui/WebBrowser';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';

import GET_LIVE_STREAM from './getLiveStream';

const Banner = styled(({ theme }) => ({
  backgroundColor: theme.colors.primary,
  paddingVertical: theme.sizing.baseUnit * 0.7,
  paddingHorizontal: theme.sizing.baseUnit,
  width: '100%',
  marginVertical: 0,
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
}))(FlexedView);

const Title = styled(({ theme }) => ({
  color: 'white',
  fontWeight: 'bold',
  alignSelf: 'flex-start',
}))(H4);

const CloseButton = withTheme(({ theme }) => ({
  color: 'white',
  icon: ['fal', 'times'],
  size: 24,
}))(FontAwesomeIcon);

const LiveNowButton = () => {
  const { loading, error, data } = useQuery(GET_LIVE_STREAM, {
    fetchPolicy: 'cache-and-network',
    pollInterval: 60000,
  });

  const [isLive, setIsLive] = useState(get(data, 'liveStream.isLive', false));

  if (loading || error) return null;

  return isLive ? (
    <WebBrowserConsumer>
      {(openUrl) => (
        <Banner>
          <TouchableScale
            onPress={() => openUrl('https://apollos.churchonline.org/')}
          >
            <Title>Join us for Church Online</Title>
          </TouchableScale>
          <TouchableScale onPress={() => setIsLive(false)}>
            <CloseButton />
          </TouchableScale>
        </Banner>
      )}
    </WebBrowserConsumer>
  ) : null;
};

export default LiveNowButton;
