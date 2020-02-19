import React, { useState } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { get } from 'lodash';
import {
  TouchableScale,
  styled,
  H4,
  FlexedView,
  withTheme,
} from '@apollosproject/ui-kit';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { UserWebBrowserConsumer } from '../user-web-browser';

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

const Title = styled(() => ({
  color: 'white',
  fontWeight: 'bold',
  alignSelf: 'flex-start',
}))(H4);

const CloseButton = withTheme(() => ({
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
    <UserWebBrowserConsumer>
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
    </UserWebBrowserConsumer>
  ) : null;
};

export default LiveNowButton;
