import PropTypes from 'prop-types';
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

  const { loading, data } = useCurrentUser();

  const channel = useRef(null);

  // const handleChannelEvent = (e) => {
  //   console.log({ e });
  //   console.log('channel event recvd, showing state', { channel: channel.current.state });
  // };
  //
  // const handleClientEvent = (e) => {
  //   console.log({ e });
  //   console.log('client event recvd, showing state', { channel: channel.current.state });
  // };

  const connect = async () => {
    try {
      await chatClient.setUser(
        {
          id: data?.currentUser?.id.split(':')[1],
          name: `${data?.currentUser?.profile?.firstName} ${
            data?.currentUser?.profile?.lastName
          }`,
          image: data?.currentUser?.profile?.photo?.uri,
        },
        data?.currentUser?.streamChatToken
      );
      channel.current = chatClient.channel('livestream', contentId);
      await channel.current.watch();
      // const res = await channel.current.watch({ presence: true });
      // console.log(' just watched', { res });
      // chatClient.on(handleClientEvent);
      // channel.current.on(handleChannelEvent);
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
    [loading]
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
