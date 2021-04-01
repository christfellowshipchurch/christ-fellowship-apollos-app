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

const API_KEY = ApollosConfig.STREAM_CHAT_API_KEY;

export default () => {
  const { id, firstName, lastName, photo, streamChatToken } = useCurrentUser();
  const [chatClient, setChatClient] = useState();
  const [isConnecting, setIsConnecting] = useState(true);

  const loginUser = async ({
    apiKey,
    userId,
    userImage,
    userName,
    userToken,
  }) => {
    const client = StreamChat.getInstance(apiKey, {
      timeout: 6000,
    });
    const user = {
      id: userId,
      image: userImage,
      name: userName,
    };

    await client.connectUser(user, userToken);

    setChatClient(client);
  };

  const connectUser = async (config) => {
    setIsConnecting(true);

    try {
      if (config.userId) {
        await loginUser(config);
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

  useEffect(
    () => {
      if (streamChatToken) {
        connectUser({
          apiKey: API_KEY,
          userId: id.split(':')[1],
          userImage: photo?.uri,
          userName: `${firstName} ${lastName}`,
          userToken: streamChatToken,
        });
      }
    },
    [streamChatToken]
  );

  return {
    chatClient,
    isConnecting,
    logout,
  };
};
