/**
 * ChatChannelSingle.js
 *
 * Author: Caleb Panza
 * Created: Mar 30, 2021
 *
 * A view that renders a full screen, single Chat Channel. It is assumed that this component will sit inside of a Navigation Stack and expects to properties formatted as Navigation Params.
 */

import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { SafeAreaView } from 'react-native-safe-area-context';

import LinearGradient from 'react-native-linear-gradient';
import {
  ThemeMixin,
  styled,
  withTheme,
  ActivityIndicator,
} from '@apollosproject/ui-kit';
import { ChatChannel } from '../components';
import { useStreamChat } from '../context';
import { ConnectionStatus } from '../hooks';

const BackgroundView = compose(
  withTheme(({ theme }) => ({
    start: { x: 0, y: 0 },
    end: { x: 0, y: 0.5 },
    colors: [theme.colors.background.screen, theme.colors.background.paper],
  })),
  styled({ flex: 1, height: '100%' })
)(LinearGradient);

const ChatChannelSingle = (props) => {
  const params = props?.route?.params;
  const { connectionStatus, setChannel, channel } = useStreamChat();

  // note : not the most elegant solution, but it's the easiest way to handle deep linking with push notifications
  useEffect(
    () => {
      if (
        ConnectionStatus.CONNECTED &&
        params?.streamChannelId &&
        params?.streamChannelType
      ) {
        setChannel({
          channelId: params?.streamChannelId,
          channelType: params?.streamChannelType,
        });
      }
    },
    [params, connectionStatus]
  );

  return (
    <ThemeMixin>
      <BackgroundView>
        {!channel ? (
          <ActivityIndicator />
        ) : (
          <SafeAreaView edges={['bottom']}>
            <ChatChannel />
          </SafeAreaView>
        )}
      </BackgroundView>
    </ThemeMixin>
  );
};

ChatChannelSingle.propTypes = {
  route: PropTypes.shape({
    params: PropTypes.shape({
      itemId: PropTypes.string,
      relatedNode: {
        id: PropTypes.string,
        title: PropTypes.string,
      },
      channel: PropTypes.shape({}),
      hideNavigationHeader: PropTypes.bool,
    }),
  }),
};

ChatChannelSingle.defaultProps = {
  route: {
    params: {
      hideNavigationHeader: false,
    },
  },
};

export default ChatChannelSingle;
