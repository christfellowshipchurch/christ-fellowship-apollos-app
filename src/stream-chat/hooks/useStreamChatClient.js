/**
 * useStreamChatClient.js
 *
 * Author: Caleb Panza
 * Created: Apr 01, 2021
 *
 * Hook that manages the connection between a User and Stream.IO. Logs in when a user logs in and logs out when a user logs out.
 *
 * note : this really should only be used by the StreamChatClientContextProvider for a single, gloablly managed state of the Chat Client.
 *
 */

import { useEffect, useState } from 'react';

import ApollosConfig from '@apollosproject/config';
import { StreamChat } from 'stream-chat';
import { useCurrentUser } from 'hooks';
import { StreamChatClient } from '../client';

const API_KEY = ApollosConfig.STREAM_CHAT_API_KEY;

const staticUser = {
  id: 'AuthenticatedUser:64302734012a9ca790d3ef795bdcea48',
  firstName: 'Caleb',
  lastName: 'Panza',
  photo: {
    uri:
      'https://cloudfront.christfellowship.church/GetImage.ashx?guid=3376aa0d-5610-4a8a-ae24-046250ebf297&mode=crop&h=150&w=150&format=jpg&quality=70',
  },
  streamChatToken:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNjQzMDI3MzQwMTJhOWNhNzkwZDNlZjc5NWJkY2VhNDgifQ.NCfg-cpPixn2NNN9NOT4fj8gNLKF6METGQiBXHcM7rs',
};

export default () => {
  // const { id, firstName, lastName, photo, streamChatToken } = useCurrentUser();
  const { id, firstName, lastName, photo, streamChatToken } = staticUser;
  const [chatClient, setChatClient] = useState();
  const [isConnecting, setIsConnecting] = useState(true);

  const connectUser = async (config) => {
    setIsConnecting(true);

    try {
      if (config.userId) {
        const { userId, userImage, userName, userToken } = config;
        const user = {
          id: userId,
          image: userImage,
          name: userName,
        };

        await StreamChatClient.connectUser(user, userToken);

        setChatClient(StreamChatClient);
      }
    } catch (e) {
      console.warn(e);
    }

    setIsConnecting(false);
  };

  const logout = () => {
    setChatClient(null);
    chatClient?.disconnect();
  };

  useEffect(() => {
    if (streamChatToken) {
      connectUser({
        apiKey: API_KEY,
        userId: id.split(':')[1],
        userImage: photo?.uri,
        userName: `${firstName} ${lastName}`,
        userToken: streamChatToken,
      });
    }
  }, []);

  return {
    chatClient,
    userId: id?.split(':')[1],
    isConnecting,
    logout,
  };
};
