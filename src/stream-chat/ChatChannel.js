/**
 * ChatChannel.js
 *
 * Author: Caleb Panza
 * Created: Mar 29, 2021
 *
 * A single Channel used for chatting with Stream.IO
 */

import React from 'react';
import PropTypes from 'prop-types';
import { useStreamChatChannel } from 'hooks';

import { View, StyleSheet } from 'react-native';
import {
  Chat,
  Channel,
  MessageList,
  MessageInput,
} from 'stream-chat-react-native';
import {
  BackgroundView,
  ActivityIndicator,
  UIText,
  styled,
  withTheme,
} from '@apollosproject/ui-kit';

import { StreamChatClient, Streami18n } from './client';
import supportedReactions from './supportedReactions';

const ErrorContainer = styled(() => ({
  justifyContent: 'center',
  alignItems: 'center',
}))(BackgroundView);

const ChatChannel = ({
  streamChatChannel,
  relatedNode,
  keyboardVerticalOffset,
  theme,
}) => {
  const { channel, loading } = useStreamChatChannel({
    id: streamChatChannel?.id,
    relatedNode,
  });

  if (loading)
    return (
      <BackgroundView>
        <ActivityIndicator />
      </BackgroundView>
    );

  if (!channel && !loading)
    return (
      <ErrorContainer>
        <UIText>Oops!</UIText>
      </ErrorContainer>
    );

  const chatTheme =
    theme?.type === 'dark'
      ? {
          dark: true,
          colors: {
            accent_blue: theme.colors.primary,
            accent_green: theme.colors.success,
            accent_red: theme.colors.alert,
            white_snow: theme.colors.background.screen,
            white: theme.colors.background.screen,
            black: theme.colors.text.primary,
            grey: theme.colors.text.primary,
            grey_gainsboro: theme.colors.text.secondary,
            grey_whisper: theme.colors.text.tertiary,
            icon_background: theme.colors.background.paper,
            border: theme.colors.text.tertiary,
            targetedMessageBackground: theme.colors.background.paper,
          },
          dateHeader: {
            text: {
              color: theme.colors.text.secondary,
            },
          },
          messageSimple: {
            content: {
              containerInner: {
                backgroundColor: theme.colors.background.paper,
                borderColor: theme.colors.background.paper,
              },
            },
          },
        }
      : {};

  return (
    <Chat client={StreamChatClient} i18nInstance={Streami18n} style={chatTheme}>
      <Channel
        channel={channel}
        keyboardVerticalOffset={keyboardVerticalOffset}
        supportedReactions={supportedReactions}
        //   thread={thread}
      >
        <View style={StyleSheet.absoluteFill}>
          <MessageList
          // onThreadSelect={(thread) => {
          //   setThread(thread);
          //   navigation.navigate('Thread');
          // }}
          />
          <MessageInput />
        </View>
      </Channel>
    </Chat>
  );
};

ChatChannel.propTypes = {
  streamChatChannel: PropTypes.shape({
    id: PropTypes.string,
    channelId: PropTypes.string,
    channelType: PropTypes.string,
  }),
  relatedNode: PropTypes.shape({
    id: PropTypes.string,
    title: PropTypes.string,
  }),
  keyboardVerticalOffset: PropTypes.number,
  theme: PropTypes.shape({
    type: PropTypes.string,
    colors: PropTypes.shape({
      primary: PropTypes.string,
      alert: PropTypes.string,
      success: PropTypes.string,
      text: PropTypes.shape({
        primary: PropTypes.string,
        secondary: PropTypes.string,
        tertiary: PropTypes.string,
      }),
      background: PropTypes.shape({
        screen: PropTypes.string,
        paper: PropTypes.string,
      }),
    }),
  }),
};

ChatChannel.defaultProps = {
  keyboardVerticalOffset: 0,
};

export default withTheme()(ChatChannel);
