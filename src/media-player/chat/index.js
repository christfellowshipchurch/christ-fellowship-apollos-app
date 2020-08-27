import PropTypes from 'prop-types';
import React, { useState, useEffect, useRef } from 'react';
import { View, ScrollView } from 'react-native';
import {
  Chat,
  Channel,
  MessageList,
  MessageInput,
} from 'stream-chat-react-native';

import { H4 } from '@apollosproject/ui-kit';
import { useCurrentUser } from '../../hooks';

import chatClient from './client';

const theme = {
  messageList: {
    listContainer: {
      css: {
        borderColor: 'green',
        borderWidth: 5,
      },
    },
  },
};



const LiveStreamChat = ({ contentId }) => {
  const [connecting, setConnecting] = useState(true);

  const { loading, data } = useCurrentUser();

  const channel = useRef(null);

  const connect = async () => {
    console.log({ data, contentId });
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
      channel.current.watch();
      setConnecting(false);
    } catch (e) {
      console.error(e.message);
    }
  };

  useEffect(
    () => {
      if (!loading) {
        connect();
      }
      return () => chatClient.disconnect();
    },
    [loading]
  );

  if (loading || connecting) {
    return (
      <ScrollView
        style={{ height: '100%' }}
        contentContainerStyle={{
          flex: 1,
          backgroundColor: 'white',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <H4>{'Loading'}</H4>
      </ScrollView>
    );
  }

  return (
    <Chat client={chatClient} style={theme}>
      <Channel channel={channel.current}>
        <View style={{ height: '50%', backgroundColor: 'white' }}>
          <MessageList
            additionalFlatListProps={{
              contentContainerStyle: {
                borderColor: 'red',
                borderWidth: 5,
              },
            }}
          />
          <MessageInput />
        </View>
      </Channel>
    </Chat>
  );
};

LiveStreamChat.propTypes = {
  contentId: PropTypes.string,
};

export default LiveStreamChat;
