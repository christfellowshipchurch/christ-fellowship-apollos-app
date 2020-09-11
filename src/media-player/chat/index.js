import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { useLazyQuery } from '@apollo/react-hooks';
import React, { useState, useEffect, useRef } from 'react';

import { styled, ActivityIndicator } from '@apollosproject/ui-kit';
import { useCurrentUser } from '../../hooks';

import MediaPlayerSafeLayout from '../controls/MediaPlayerSafeLayout';
import {
  Chat,
  Channel,
  MessageList,
  MessageFloatingBy,
  MessageInput,
} from './components';
import chatClient, { streami18n } from './client';

const GET_CURRENT_USER_ROLE_FOR_CHANNEL = gql`
  query getCurrentUserRoleForChannel($channelId: ID!) {
    currentUser {
      id
      streamChatRole(id: $channelId)
    }
  }
`;

const ChatContainer = styled(({ theme, isPortrait }) => ({
  flex: 1,
  // borderColor: 'green', borderWidth: 5,
  ...(isPortrait ? {} : { position: 'absolute', top: 0, right: 0, bottom: 0 }),
  zIndex: isPortrait ? 1 : 2,
  width: isPortrait ? '100%' : '50%',
  backgroundColor: isPortrait
    ? theme.colors.background.screen
    : theme.colors.transparent,
}))(MediaPlayerSafeLayout);

const LiveStreamChat = ({ isPortrait, contentId }) => {
  const [connecting, setConnecting] = useState(true);

  const { loading, data = {} } = useCurrentUser();

  const [fetchRole] = useLazyQuery(GET_CURRENT_USER_ROLE_FOR_CHANNEL, {
    fetchPolicy: 'network-only',
    variables: {
      channelId: contentId,
    },
  });

  const channel = useRef(null);

  // const handleChannelEvent = (e) => {
  //   console.log({ e });
  //   console.log('channel event recvd, showing state', {
  //     channel: channel.current.state,
  //   });
  // };
  //
  // const handleClientEvent = (e) => {
  //   console.log({ e });
  //   console.log('client event recvd, showing client', { client: chatClient });
  // };

  const connect = async () => {
    try {
      const { currentUser = {} } = data;
      const user = {
        id: currentUser?.id.split(':')[1],
        name: `${currentUser?.profile?.firstName} ${
          currentUser?.profile?.lastName
        }`,
        image: currentUser?.profile?.photo?.uri,
      };

      await chatClient.setUser(user, currentUser?.streamChatToken);
      // const res = await chatClient.setUser(user, currentUser?.streamChatToken);
      // console.log('setUser', { res });
      channel.current = chatClient.channel('livestream', contentId);

      await channel.current.watch();
      // chatClient.on(handleClientEvent);
      // channel.current.on(handleChannelEvent);

      // Now that we're sure the channel exists, we can request the user's role for it. On the
      // server, this will either add or remove the user as a moderator while computing the result.
      // (So this is kind of a mutation.)
      fetchRole();

      setConnecting(false);
    } catch (e) {
      console.error(e.message); // eslint-disable-line no-console
    }
  };

  useEffect(
    () => {
      if (!loading) {
        connect();
      }
      return () => {
        // if (channel.current) {
        //   channel.current.off(handleChannelEvent);
        //   chatClient.off(handleClientEvent);
        // }
        chatClient.disconnect();
      };
    },
    [data.currentUser]
  );

  if (loading || connecting) {
    return (
      <ChatContainer isPortrait={isPortrait}>
        <ActivityIndicator size={'large'} />
      </ChatContainer>
    );
  }

  return (
    <Chat client={chatClient} i18nInstance={streami18n}>
      <ChatContainer isPortrait={isPortrait}>
        <Channel
          disableKeyboardCompatibleView={!isPortrait}
          channel={channel.current}
        >
          {isPortrait ? (
            <React.Fragment>
              <MessageList />
              <MessageInput />
            </React.Fragment>
          ) : (
            <MessageFloatingBy />
          )}
        </Channel>
      </ChatContainer>
    </Chat>
  );
};

LiveStreamChat.propTypes = {
  isPortrait: PropTypes.bool,
  contentId: PropTypes.string,
};

export default LiveStreamChat;
