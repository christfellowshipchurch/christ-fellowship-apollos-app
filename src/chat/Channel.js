import PropTypes from 'prop-types';
import React, { useState, useEffect, useRef } from 'react';
import { createStackNavigator } from 'react-navigation';
import { SafeAreaView, View, Platform } from 'react-native';
import { get } from 'lodash';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import { ThemeProvider as ChatThemeProvider } from '@stream-io/styled-components';

import { styled, withTheme, ActivityIndicator } from '@apollosproject/ui-kit';

import MediaPlayerSpacer from '../media-player/controls/MediaPlayerSpacer';
import { MINI_PLAYER_HEIGHT } from '../media-player/controls/MiniControls';

import { useCurrentUser } from '../hooks';
import { navigationOptions, NavigationSpacer } from '../navigation';

// Local
import chatClient, { streami18n } from './client';
import mapChatTheme from './styles/mapTheme';
import { getStreamUser } from './utils';

import {
  Chat,
  Channel as ChannelInner,
  MessageList,
  MessageInput,
} from './components';

const themed = withTheme();
const KeyboardAvoider = Platform.OS === 'ios' ? KeyboardSpacer : React.Fragment;

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

const PaddedView = styled(({ theme }) => ({
  paddingBottom: theme.sizing.baseUnit,
  backgroundColor: theme.colors.background.paper,
}))(View);

// :: Main Component
// ---
const Channel = themed((props) => {
  const userId = props.navigation.getParam('userId');

  const [connecting, setConnecting] = useState(true);
  const [playerVisible, setPlayerVisible] = useState(false);

  const { loading, data = {} } = useCurrentUser();

  const channel = useRef(null);

  const connect = async () => {
    try {
      const currentStreamUser = getStreamUser(get(data, 'currentUser'));

      if (!chatClient.userID) {
        await chatClient.setUser(
          currentStreamUser,
          get(data, 'currentUser.streamChatToken')
        );
      }

      channel.current = chatClient.channel('messaging', {
        members: [userId, currentStreamUser.id],
      });

      await channel.current.watch();

      const response = await chatClient.queryUsers({ id: { $in: [userId] } });
      props.navigation.setParams({ name: get(response, 'users[0].name') });

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
      <SafeChatContainer>
        <ActivityIndicator size={'large'} />
      </SafeChatContainer>
    );
  }

  return (
    <ChatThemeProvider theme={mapChatTheme(props.theme)}>
      <Chat client={chatClient} i18nInstance={streami18n}>
        <FlexedMediaSpacer
          onOpen={() => setPlayerVisible(true)}
          onClose={() => setPlayerVisible(false)}
          Component={PaddedView}
        >
          <ChannelInner channel={channel.current}>
            <SafeChatContainer>
              <NavigationSpacer />
              <MessageList />
            </SafeChatContainer>
            <MessageInput />
            <KeyboardAvoider
              topSpacing={playerVisible ? -MINI_PLAYER_HEIGHT : 0}
            />
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

Channel.navigationOptions = ({ navigation, ...props }) =>
  navigationOptions({
    navigation,
    ...props,
    title: navigation.getParam('name', '…'),
    blur: false,
    headerLeft: null,
  });

const ChannelNavigator = createStackNavigator(
  {
    Channel,
  },
  {
    initialRouteName: 'Channel',
    headerLayoutPreset: 'left',
  }
);

export { Channel };

export default ChannelNavigator;
