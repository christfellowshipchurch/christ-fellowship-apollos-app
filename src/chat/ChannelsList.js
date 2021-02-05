import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import { createNativeStackNavigator } from 'react-native-screens/native-stack';
import { SafeAreaView } from 'react-native';
import { get } from 'lodash';
import moment from 'moment';
import { ThemeProvider as ChatThemeProvider } from '@stream-io/styled-components';

import {
  styled,
  withTheme,
  ModalCloseButton,
  ModalBackButton,
} from '@apollosproject/ui-kit';
import MediaPlayerSpacer from '../media-player/controls/MediaPlayerSpacer';
import { useCurrentUser } from '../hooks';

import { Chat, ChannelList, LoadingChannels } from './components';
import chatClient, { streami18n } from './client';
import mapChatTheme from './styles/mapTheme';
import { ChatChannel } from './Channel';

const SafeChatContainer = styled(({ theme }) => ({
  flex: 1,
  backgroundColor: theme.colors.background.paper,
}))(SafeAreaView);

const FlexedMediaSpacer = styled(({ theme }) => ({
  flex: 1,
  backgroundColor: theme.colors.background.paper,
}))(MediaPlayerSpacer);

const themed = withTheme();

const ChatChannelsList = themed((props) => {
  const [connecting, setConnecting] = useState(true);

  const { loading, data = {} } = useCurrentUser();

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
              <LoadingChannels />
            </SafeChatContainer>
          </FlexedMediaSpacer>
        </Chat>
      </ChatThemeProvider>
    );
  }

  const curUserId = get(data, 'currentUser.id', '').split(':')[1];
  const filters = {
    type: 'messaging',
    members: { $in: [curUserId] },
  };
  const sort = { last_message_at: -1 };
  const options = {
    state: true,
    watch: true,
  };

  const sinceYesterday = moment().subtract(12, 'hour');
  const filterFn = (channels) =>
    channels.filter((c) =>
      moment(get(c, 'state.last_message_at')).isAfter(sinceYesterday)
    );

  return (
    <ChatThemeProvider theme={mapChatTheme(props.theme)}>
      <Chat client={chatClient} i18nInstance={streami18n}>
        <FlexedMediaSpacer>
          <SafeChatContainer>
            <ChannelList
              filters={filters}
              sort={sort}
              options={options}
              postFilter={filterFn}
              onSelect={(channel) => {
                const members = get(channel, 'state.members');
                const userId = Object.keys(members).find(
                  (id) => id !== curUserId
                );
                props.navigation.navigate('ChatChannel', {
                  userId,
                  nested: true,
                });
              }}
            />
          </SafeChatContainer>
        </FlexedMediaSpacer>
      </Chat>
    </ChatThemeProvider>
  );
});

ChatChannelsList.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }),
  theme: PropTypes.shape({
    colors: PropTypes.shape({}),
  }),
};

const { Screen, Navigator } = createNativeStackNavigator();

const ChatChannelsListNavigator = ({ route, ...props }) => (
  <Navigator
    {...props}
    headerMode="screen"
    screenOptions={{
      headerTranslucent: true,
      headerStyle: { backgroundColor: 'transparent' },
      headerHideShadow: true,
      headerRight: ModalCloseButton,
      headerLeft: ModalBackButton,
      headerTitle: '',
    }}
  >
    <Screen
      name="ChatChannelsList"
      component={ChatChannelsList}
      initialParams={route.params}
    />
    <Screen
      name="ChatChannel"
      component={ChatChannel}
      initialParams={route.params}
    />
  </Navigator>
);

ChatChannelsListNavigator.propTypes = {
  route: PropTypes.shape({
    params: PropTypes.shape({}),
  }),
};

export default ChatChannelsListNavigator;
