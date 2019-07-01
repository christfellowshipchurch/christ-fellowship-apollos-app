import React from 'react';
import { Query } from 'react-apollo';
import { get } from 'lodash';

import {
  Card,
  CardContent,
  TouchableScale,
  styled,
  ChannelLabel,
  UIText,
} from '@apollosproject/ui-kit';
import { WebBrowserConsumer } from 'ChristFellowship/src/ui/WebBrowser';

import GET_LIVE_STREAM from './getLiveStream';

const LiveCard = styled(({ theme }) => ({
  backgroundColor: theme.colors.lightSecondary,
}))(Card);

const LiveNowButton = () => (
  <Query
    query={GET_LIVE_STREAM}
    fetchPolicy="cache-and-network"
    pollInterval={60000}
  >
    {({ loading, data }) => {
      const isLive = get(data, 'liveStream.isLive', false);

      return isLive ? (
        <WebBrowserConsumer>
          {(openUrl) => (
            <TouchableScale
              onPress={() => openUrl('https://apollos.churchonline.org/')}
            >
              <LiveCard isLoading={loading}>
                <CardContent>
                  <ChannelLabel
                    icon="video"
                    label={
                      <UIText>
                        <UIText bold>{`We're live.`} </UIText>
                        Watch now!
                      </UIText>
                    }
                  />
                </CardContent>
              </LiveCard>
            </TouchableScale>
          )}
        </WebBrowserConsumer>
      ) : null;
    }}
  </Query>
);

export default LiveNowButton;
