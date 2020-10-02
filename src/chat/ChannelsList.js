import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import { createStackNavigator } from 'react-navigation';
import { SafeAreaView, View } from 'react-native';
import { get } from 'lodash';
import moment from 'moment';
import { ThemeProvider as ChatThemeProvider } from '@stream-io/styled-components';

import { styled, withTheme, ActivityIndicator } from '@apollosproject/ui-kit';
import MediaPlayerSpacer from '../media-player/controls/MediaPlayerSpacer';
import { useCurrentUser } from '../hooks';
import { navigationOptions, NavigationSpacer } from '../navigation';

import { Chat, ChannelList } from './components';
import chatClient, { streami18n } from './client';
import mapChatTheme from './styles/mapTheme';
import { Channel } from './Channel';

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

const themed = withTheme();

const ChannelsList = themed((props) => {
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
      <SafeChatContainer>
        <ActivityIndicator size={'large'} />
      </SafeChatContainer>
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

  const sinceYesterday = moment().subtract(24, 'hour');
  const filterFn = (channels) =>
    channels.filter((c) =>
      moment(get(c, 'state.last_message_at')).isAfter(sinceYesterday)
    );

  return (
    <ChatThemeProvider theme={mapChatTheme(props.theme)}>
      <Chat client={chatClient} i18nInstance={streami18n}>
        <FlexedMediaSpacer Component={PaddedView}>
          <SafeChatContainer>
            <NavigationSpacer />
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
                props.navigation.navigate('Channel', { userId, nested: true });
              }}
            />
          </SafeChatContainer>
        </FlexedMediaSpacer>
      </Chat>
    </ChatThemeProvider>
  );
});

ChannelsList.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }),
  theme: PropTypes.shape({
    colors: PropTypes.shape({}),
  }),
};

ChannelsList.navigationOptions = ({ navigation, ...props }) =>
  navigationOptions({
    navigation,
    ...props,
    title: 'Conversations',
    blur: false,
    headerLeft: null,
  });

const ChannelsListNavigator = createStackNavigator(
  {
    ChannelsList,
    Channel,
  },
  {
    initialRouteName: 'ChannelsList',
    headerLayoutPreset: 'left',
  }
);

export default ChannelsListNavigator;
