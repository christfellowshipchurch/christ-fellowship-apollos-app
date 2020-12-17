import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { useLazyQuery } from '@apollo/client';
import React, { useState, useEffect, useRef } from 'react';
import { View, KeyboardAvoidingView, Platform } from 'react-native';
import { get } from 'lodash';
import moment from 'moment';
import numeral from 'numeral';
import { ThemeProvider as ChatThemeProvider } from '@stream-io/styled-components';

import { styled, Icon, UIText, withTheme } from '@apollosproject/ui-kit';
import { useCurrentUser } from '../hooks';

import {
  Chat,
  Channel,
  MessageList,
  MessageInput,
  LoadingMessages,
  LoadingErrorIndicator,
} from '../chat/components';
import { withPlayerContext } from '../chat/context';
import chatClient, { streami18n } from '../chat/client';
import mapChatTheme from '../chat/styles/mapTheme';

const GET_CURRENT_USER_ROLE_FOR_CHANNEL = gql`
  query getCurrentUserRoleForChannel($channelId: ID!) {
    currentUser {
      id
      streamChatRole(id: $channelId)
    }
  }
`;

const KeyboardAvoider = styled(({ isPortrait, theme }) => ({
  flex: 1,
  marginBottom: isPortrait ? theme.sizing.baseUnit : 0,
  backgroundColor: theme.colors.background.paper,
  paddingRight: !isPortrait ? theme.sizing.baseUnit : 0,
}))(Platform.OS === 'ios' ? KeyboardAvoidingView : View);

const WatchingContainer = styled(({ theme }) => ({
  position: 'absolute',
  top: -theme.helpers.rem(2),
  right: 0,
  flexDirection: 'row',
  alignItems: 'center',
  height: theme.helpers.rem(2),
}))(View);

const WatchingIcon = withTheme(({ theme }) => ({
  name: 'groups',
  fill: theme.colors.lightPrimary,
  size: theme.helpers.rem(1),
  style: {
    marginHorizontal: 5,
  },
}))(Icon);

const WatchingText = styled(({ theme }) => ({
  color: theme.colors.lightPrimary,
  fontWeight: 'bold',
}))(UIText);

const LiveStreamChat = (props) => {
  const [connecting, setConnecting] = useState(true);
  const [error, setError] = useState(false);
  const [numWatching, setNumWatching] = useState(0);

  const { loading, data = {} } = useCurrentUser();

  const [fetchRole] = useLazyQuery(GET_CURRENT_USER_ROLE_FOR_CHANNEL, {
    fetchPolicy: 'network-only',
    variables: {
      channelId: props.channelId,
    },
  });

  const channel = useRef(null);
  const updateNumWatching = () =>
    setNumWatching(get(channel.current, 'state.watcher_count', 0));

  const handleChannelEvent = (e) => {
    // console.log({ e });
    switch (e.type) {
      case 'user.watching.start':
      case 'user.watching.stop': {
        updateNumWatching();
        break;
      }
      default:
        break;
    }
  };

  const loadChannels = async () => {
    const filter = {
      type: 'messaging',
      members: { $in: [get(data, 'currentUser.id', '').split(':')[1]] },
    };
    const sort = { last_message_at: -1 };
    const options = { watch: false, state: false };

    const channels = await chatClient.queryChannels(filter, sort, options);
    const sinceYesterday = moment().subtract(12, 'hour');
    const recentOnly = channels.filter((c) =>
      moment(get(c, 'state.last_message_at')).isAfter(sinceYesterday)
    );
    props.onChannelsUpdated({ channels: recentOnly });
  };

  const handleClientEvent = (e) => {
    // console.log({ e });
    switch (e.type) {
      case 'notification.message_new': {
        loadChannels();
        break;
      }
      default:
        break;
    }
  };

  const connect = async () => {
    try {
      const firstName = get(data, 'currentUser.profile.firstName', '');
      const lastName = get(data, 'currentUser.profile.lastName', '');
      const user = {
        id: get(data, 'currentUser.id', '').split(':')[1],
        name: `${firstName} ${lastName}`,
        image: get(data, 'currentUser.profile.photo.uri'),
      };

      if (!chatClient.userID) {
        await chatClient.setUser(
          user,
          get(data, 'currentUser.streamChatToken')
        );
      }

      channel.current = chatClient.channel(
        'livestream',
        props.channelId,
        props.event
      );

      await channel.current.watch();
      channel.current.on(handleChannelEvent);

      if (get(chatClient, 'listeners.all.length', 0) < 2) {
        chatClient.on(handleClientEvent);
      }

      // Now that we're sure the channel exists, we can request the user's role for it. On the
      // server, this will either add or remove the user as a moderator while computing the result.
      // (So this is kind of a mutation.)
      fetchRole();

      setConnecting(false);
      updateNumWatching();
    } catch (e) {
      console.warn(e.message); // eslint-disable-line no-console
      setError(true);
    }
  };

  useEffect(
    () => {
      if (!loading) {
        connect();
      }
      return () => {
        if (channel.current) {
          channel.current.off(handleChannelEvent);
        }
        if (get(chatClient, 'listeners.all.length', 0) < 2) {
          chatClient.off(handleClientEvent);
          chatClient.disconnect();
        }
      };
    },
    [props.channelId, data.currentUser]
  );

  useEffect(
    () => {
      if (!loading && !connecting) loadChannels();
    },
    [loading, connecting]
  );

  if (loading || connecting) {
    return (
      <ChatThemeProvider theme={mapChatTheme(props.theme)}>
        <Chat client={chatClient} i18nInstance={streami18n}>
          <KeyboardAvoider behavior={'padding'} isPortrait={props.isPortrait}>
            <LoadingMessages />
            <MessageInput disabled />
          </KeyboardAvoider>
        </Chat>
      </ChatThemeProvider>
    );
  }

  if (error) {
    return (
      <Chat client={chatClient} i18nInstance={streami18n}>
        <KeyboardAvoider behavior={'padding'} isPortrait={props.isPortrait}>
          <LoadingErrorIndicator
            listType={'message'}
            retry={() => setError(false)}
          />
        </KeyboardAvoider>
      </Chat>
    );
  }

  return (
    <ChatThemeProvider theme={mapChatTheme(props.theme)}>
      <Chat client={chatClient} i18nInstance={streami18n}>
        <KeyboardAvoider behavior={'padding'} isPortrait={props.isPortrait}>
          <Channel channel={channel.current}>
            {numWatching > 1 &&
              props.isPortrait && (
                <WatchingContainer>
                  <WatchingText>
                    {numeral(numWatching).format('0,0')}
                  </WatchingText>
                  <WatchingIcon />
                </WatchingContainer>
              )}
            <MessageList />
            <MessageInput />
          </Channel>
        </KeyboardAvoider>
      </Chat>
    </ChatThemeProvider>
  );
};

LiveStreamChat.propTypes = {
  isPortrait: PropTypes.bool,
  channelId: PropTypes.string,
  event: PropTypes.shape({
    parentId: PropTypes.string,
    name: PropTypes.string,
    startsAt: PropTypes.string,
    endsAt: PropTypes.string,
  }),
  onChannelsUpdated: PropTypes.func,
  theme: PropTypes.shape({
    colors: PropTypes.shape({}),
  }),
};

const themed = withTheme();

export default withPlayerContext(themed(LiveStreamChat));
