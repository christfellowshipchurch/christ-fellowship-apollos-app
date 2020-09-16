import PropTypes from 'prop-types';
import React, { useState, useEffect, useRef } from 'react';
import { createStackNavigator } from 'react-navigation';
import { View } from 'react-native';

import { styled, ActivityIndicator } from '@apollosproject/ui-kit';
import MediaPlayerSpacer from '../media-player/controls/MediaPlayerSpacer';
import { useCurrentUser } from '../hooks';
import { navigationOptions, NavigationSpacer } from '../navigation';

import {
  Chat,
  Channel as ChannelInner,
  MessageList,
  MessageInput,
} from './components';
import chatClient, { streami18n } from './client';

const ChatContainer = styled(({ theme }) => ({
  flex: 1,
  backgroundColor: theme.colors.background.paper,
}))(View);

const FlexedMediaSpacer = styled({
  flex: 1,
})(MediaPlayerSpacer);

const PaddedView = styled(({ theme }) => ({
  paddingBottom: theme.sizing.baseUnit,
}))(View);

const Channel = ({ navigation }) => {
  const userId = navigation.getParam('userId');

  const [connecting, setConnecting] = useState(true);

  const { loading, data = {} } = useCurrentUser();

  const channel = useRef(null);

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

      if (!chatClient.userID) {
        await chatClient.setUser(user, currentUser?.streamChatToken);
      }

      channel.current = chatClient.channel('messaging', {
        members: [userId, currentUser?.id.split(':')[1]],
      });

      await channel.current.watch();

      const response = await chatClient.queryUsers({ id: { $in: [userId] } });
      navigation.setParams({ name: response?.users?.[0]?.name });

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
      <ChatContainer>
        <ActivityIndicator size={'large'} />
      </ChatContainer>
    );
  }

  return (
    <Chat client={chatClient} i18nInstance={streami18n}>
      <FlexedMediaSpacer Component={PaddedView}>
        <NavigationSpacer />
        <ChatContainer>
          <ChannelInner channel={channel.current}>
            <MessageList />
            <MessageInput />
          </ChannelInner>
        </ChatContainer>
      </FlexedMediaSpacer>
    </Chat>
  );
};

Channel.propTypes = {
  navigation: PropTypes.shape({
    getParam: PropTypes.func,
  }),
};

Channel.navigationOptions = ({ navigation, ...props }) =>
  navigationOptions({
    navigation,
    ...props,
    title: navigation.getParam('name', '…'),
    blur: true,
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