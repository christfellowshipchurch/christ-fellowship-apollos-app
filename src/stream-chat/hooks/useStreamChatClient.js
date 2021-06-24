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
import PropTypes from 'prop-types';
import AsyncStorage from '@react-native-community/async-storage';

import ApollosConfig from '@apollosproject/config';
import { StreamChat } from 'stream-chat';

const API_KEY = ApollosConfig.STREAM_CHAT_API_KEY;

const STREAM_USER_KEY = '@stream-user-key';

const ConnectionStatus = Object.freeze({
  CONNECTED: 'CONNECTED',
  CONNECTING: 'CONNECTING',
  DISCONNECTED: 'DISCONNECTED',
  ERROR: 'ERROR',
});

const UserConfigPropTypes = {
  userId: PropTypes.string.isRequired,
  userToken: PropTypes.string.isRequired,
  userName: PropTypes.string.isRequired,
  userImage: PropTypes.string,
};

export default () => {
  const [chatClient, setChatClient] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState(
    ConnectionStatus.DISCONNECTED
  );

  /**
   * connectUser
   * Connects a user to Stream Chat
   * @param {object} config | Rock Group Id
   */
  const connectUser = async (config) => {
    PropTypes.checkPropTypes(UserConfigPropTypes, config);

    // Bail early if we're already connecting
    if (connectionStatus === ConnectionStatus.CONNECTING) return;

    setConnectionStatus(ConnectionStatus.CONNECTING);

    // note : if we already have a chat client, we want to avoid consecutive connections
    if (chatClient) {
      await chatClient?.disconnect();
    }

    // create an instance of Stream and construct the Stream User object
    const client = StreamChat.getInstance(API_KEY, {
      timeout: 6000,
    });
    const user = {
      id: config.userId,
      image: config.userImage,
      name: config.userName,
    };

    // connect the user to stream
    await client.connectUser(user, config.userToken);

    // store the User Config in async storage for faster connectivity
    // note : we could probably extract this into a separate call, but saving to AsyncStorage is relatively low-cost, so we'll throw it here to insure we always save something locally
    await AsyncStorage.setItem(STREAM_USER_KEY, JSON.stringify(config));

    setChatClient(client);

    setConnectionStatus(ConnectionStatus.CONNECTED);
  };

  /**
   * disconnectUser
   * Disconnects from the Stream chatClient and nullifies the `chatClient`
   */
  const disconnectUser = () => {
    setChatClient(null);
    chatClient?.disconnect();

    setConnectionStatus(ConnectionStatus.DISCONNECTED);

    AsyncStorage.removeItem(STREAM_USER_KEY);
  };

  /**
   * _loadLocalUser
   * Checks for a local user saved inside of AsyncStorage
   */
  const _loadLocalUser = async () => {
    const localUser = await AsyncStorage.getItem(STREAM_USER_KEY);

    if (localUser) {
      connectUser(JSON.parse(localUser));
    }
  };

  // When we first mount, there's a good chance that we already have user data locally accessible, so we'll just immediately make the connection
  useEffect(() => {
    _loadLocalUser();

    return function cleanup() {
      disconnectUser();
    };
  }, []);

  return {
    chatClient,
    connectionStatus,
    disconnectUser,
    connectUser,
  };
};
