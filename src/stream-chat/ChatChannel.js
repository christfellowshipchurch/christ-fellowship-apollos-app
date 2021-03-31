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
import Color from 'color';

import { View, StyleSheet } from 'react-native';
import {
  Card,
  Chat,
  Channel,
  MessageList,
  MessageInput,
  MessageTextContainer,
  renderText,
  useTheme,
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

// :: Styles
// :: ======================================
const ErrorContainer = styled(() => ({
  justifyContent: 'center',
  alignItems: 'center',
}))(BackgroundView);

const RedBox = styled(() => ({
  width: '100',
  height: '100',
  backgroundColor: 'salmon',
}))(View);

// :: Components
// :: ======================================
const UrlPreview = (props) => <Card {...props} />;
// todo : if the only thing in the message is a single Url, just don't render the text
const MessageText = (props) => {
  const theme = useTheme();

  const {
    theme: {
      colors,
      messageSimple: {
        content: {
          markdown,
          textContainer: { onlyEmojiMarkdown, ...textContainer },
        },
      },
    },
  } = theme;

  return renderText({ colors, ...props });
};

const ChatChannel = ({
  streamChatChannel,
  relatedNode,
  keyboardVerticalOffset,
  theme,
  withMedia,
  children,
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

  const chatTheme = {
    dark: theme?.type === 'dark',
    colors: {
      accent_blue: theme.colors.primary,
      accent_green: theme.colors.success,
      accent_red: theme.colors.alert,
      black: theme.colors.text.primary,
      blue_alice: Color(theme.colors.background.screen)
        .mix(Color(theme.colors.primary), 0.15)
        .hex(),
      border: Color(theme.colors.background.screen)
        .mix(Color(theme.colors.text.primary), 0.1)
        .hex(),
      icon_background: theme.colors.background.paper,
      grey: Color(theme.colors.background.screen)
        .mix(Color(theme.colors.text.primary))
        .hex(),
      grey_gainsboro: Color(theme.colors.background.screen)
        .mix(Color(theme.colors.text.secondary))
        .hex(),
      grey_whisper: Color(theme.colors.background.screen)
        .mix(Color(theme.colors.text.tertiary))
        .hex(),
      targetedMessageBackground: theme.colors.background.paper,
      white: theme.colors.background.paper,
      white_smoke: theme.colors.background.screen,
      white_snow: theme.colors.background.screen,
    },
    dateHeader: {
      container: {
        backgroundColor: theme.colors.text.tertiary,
      },
      text: {
        color: theme.colors.background.screen,
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
    overlay: {
      reactionsLists: {
        reaction: {
          color: theme.colors.primary,
        },
      },
    },
  };

  // note : special consideration made for Stream with a Media Player attached to the top
  // :: Split screen between video and chat : https://github.com/GetStream/stream-chat-react-native/wiki/Cookbook-v3.0
  if (withMedia) {
    return (
      <Chat
        client={StreamChatClient}
        i18nInstance={Streami18n}
        style={chatTheme}
      >
        <Channel
          channel={channel}
          keyboardVerticalOffset={keyboardVerticalOffset}
          supportedReactions={supportedReactions}
          UrlPreview={UrlPreview}
          // MessageText={MessageText}
          //   thread={thread}
        >
          {children}
          <MessageList
          // onThreadSelect={(thread) => {
          //   setThread(thread);
          //   navigation.navigate('Thread');
          // }}
          />
          <MessageInput />
        </Channel>
      </Chat>
    );
  }

  return (
    <Chat client={StreamChatClient} i18nInstance={Streami18n} style={chatTheme}>
      <Channel
        channel={channel}
        keyboardVerticalOffset={keyboardVerticalOffset}
        supportedReactions={supportedReactions}
        UrlPreview={UrlPreview}
        // MessageText={MessageText}
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
  withMedia: PropTypes.bool,
};

ChatChannel.defaultProps = {
  keyboardVerticalOffset: 0,
  withMedia: false,
};

export default withTheme()(ChatChannel);
