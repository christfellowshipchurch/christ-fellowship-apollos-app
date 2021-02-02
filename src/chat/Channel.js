import PropTypes from 'prop-types';
import React, { useState, useEffect, useRef } from 'react';
import { createStackNavigator } from 'react-navigation';
import { SafeAreaView, KeyboardAvoidingView, Platform } from 'react-native';
import { get } from 'lodash';
import { ThemeProvider as ChatThemeProvider } from '@stream-io/styled-components';
import NavigationHeader from 'ui/NavigationHeader';

import { styled, withTheme } from '@apollosproject/ui-kit';

import MediaPlayerSpacer from '../media-player/controls/MediaPlayerSpacer';

import { useCurrentUser } from '../hooks';

// Local
import chatClient, { streami18n } from './client';
import mapChatTheme from './styles/mapTheme';
import { getStreamUser } from './utils';

import {
  Chat,
  Channel as ChannelInner,
  MessageList,
  MessageInput,
  LoadingMessages,
} from './components';

const themed = withTheme();

// :: Styled Components
// ---
const SafeChatContainer = styled(({ theme }) => ({
  flex: 1,
  backgroundColor: theme.colors.background.paper,
}))(SafeAreaView);

const FlexedMediaSpacer = styled(({ theme }) => ({
  flex: 1,
  backgroundColor: theme.colors.background.paper,
}))(MediaPlayerSpacer);

const KeyboardAvoider = styled({
  flex: 1,
})(Platform.OS === 'ios' ? KeyboardAvoidingView : React.Fragment);

// :: Main Component
// ---
const Channel = themed((props) => {
  const userId = props.navigation.getParam('user');
  const channelId = props.navigation.getParam('channelId');
  const [connecting, setConnecting] = useState(true);

  const { loading, data = {} } = useCurrentUser();

  const channel = useRef(null);

  const connect = async () => {
    try {
      const currentStreamUser = getStreamUser(get(data, 'currentUser'));

      // Initialize user connection with Stream Client if we haven't yet
      if (!chatClient.userID) {
        await chatClient.setUser(
          currentStreamUser,
          get(data, 'currentUser.streamChatToken')
        );
      }

      if (userId) {
        // Direct Message
        channel.current = chatClient.channel('messaging', {
          members: [userId, currentStreamUser.id],
        });
      } else if (channelId) {
        // Group Chat
        channel.current = chatClient.channel('messaging', channelId);
      }

      await channel.current.watch();

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
        if (get(chatClient, 'listeners.all.length', 0) < 2) {
          chatClient.disconnect();
        }
      };
    },
    [data.currentUser]
  );

  if (loading || connecting) {
    return (
      <ChatThemeProvider theme={mapChatTheme(props.theme)}>
        <Chat client={chatClient} i18nInstance={streami18n}>
          <FlexedMediaSpacer>
            <SafeChatContainer>
              <LoadingMessages />
              <MessageInput disabled />
            </SafeChatContainer>
          </FlexedMediaSpacer>
        </Chat>
      </ChatThemeProvider>
    );
  }

  return (
    <ChatThemeProvider theme={mapChatTheme(props.theme)}>
      <Chat client={chatClient} i18nInstance={streami18n}>
        <FlexedMediaSpacer>
          <ChannelInner channel={channel.current}>
            <KeyboardAvoider behavior={'padding'}>
              <SafeChatContainer>
                <MessageList />
              </SafeChatContainer>
              <MessageInput />
            </KeyboardAvoider>
          </ChannelInner>
        </FlexedMediaSpacer>
      </Chat>
    </ChatThemeProvider>
  );
});

Channel.propTypes = {
  navigation: PropTypes.shape({
    getParam: PropTypes.func,
  }),
  theme: PropTypes.shape({
    colors: PropTypes.shape({}),
  }),
};

const ChannelNavigator = createStackNavigator(
  {
    Channel,
  },
  {
    initialRouteName: 'Channel',
    headerMode: 'float',
    headerTransitionPreset: 'fade-in-place',
    headerLayoutPreset: 'left',
    navigationOptions: { header: null },
  }
);

export { Channel };

export default ChannelNavigator;
