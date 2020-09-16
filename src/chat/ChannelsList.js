import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import { createStackNavigator } from 'react-navigation';
import { SafeAreaView, View } from 'react-native';

import { styled, ActivityIndicator } from '@apollosproject/ui-kit';
import MediaPlayerSpacer from '../media-player/controls/MediaPlayerSpacer';
import { useCurrentUser } from '../hooks';
import { navigationOptions, NavigationSpacer } from '../navigation';

import { Chat, ChannelList } from './components';
import chatClient, { streami18n } from './client';
import { Channel } from './Channel';

const SafeChatContainer = styled(({ theme }) => ({
  flex: 1,
  backgroundColor: theme.colors.background.paper,
}))(SafeAreaView);

const FlexedMediaSpacer = styled({
  flex: 1,
})(MediaPlayerSpacer);

const PaddedView = styled(({ theme }) => ({
  paddingBottom: theme.sizing.baseUnit,
}))(View);

const ChannelsList = ({ navigation }) => {
  const [connecting, setConnecting] = useState(true);

  const { loading, data = {} } = useCurrentUser();
  const { currentUser = {} } = data;

  const connect = async () => {
    try {
      const user = {
        id: currentUser?.id.split(':')[1],
        name: `${currentUser?.profile?.firstName} ${
          currentUser?.profile?.lastName
        }`,
        image: currentUser?.profile?.photo?.uri,
      };

      if (!chatClient.userID) {
        await chatClient.setUser(user, currentUser?.streamChatToken);
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
        chatClient.disconnect();
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

  const filters = {
    type: 'messaging',
    members: { $in: [currentUser?.id.split(':')[1]] },
  };
  const sort = { last_message_at: -1 };
  const options = {
    state: true,
    watch: true,
  };

  return (
    <Chat client={chatClient} i18nInstance={streami18n}>
      <FlexedMediaSpacer Component={PaddedView}>
        <SafeChatContainer>
          <NavigationSpacer />
          <ChannelList
            filters={filters}
            sort={sort}
            options={options}
            onSelect={async (channel) => {
              const { members } = await channel.queryMembers({
                id: { $nin: [currentUser?.id.split(':')[1]] },
              });
              const userId = members?.[0]?.user?.id;
              navigation.navigate('Channel', { userId, nested: true });
            }}
          />
        </SafeChatContainer>
      </FlexedMediaSpacer>
    </Chat>
  );
};

ChannelsList.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }),
};

ChannelsList.navigationOptions = ({ navigation, ...props }) =>
  navigationOptions({
    navigation,
    ...props,
    title: 'Conversations',
    blur: true,
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
