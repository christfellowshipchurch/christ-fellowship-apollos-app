/**
 * StreamChatClientContext.js
 *
 * Author: Caleb Panza
 * Created: Apr 01, 2021
 *
 * Provides a global context for the connection between user and Stream.IO
 *
 */

import React, { useContext } from 'react';
import PropTypes from 'prop-types';

import { useStreamChatClient } from 'hooks';

const StreamChatClientContextContext = React.createContext([]);

// Context Hook
export const useStreamChat = () => useContext(StreamChatClientContextContext);

// Provider
export const StreamChatClientContextProvider = ({ children }) => {
  const { chatClient, isConnecting } = useStreamChatClient();

  return (
    <StreamChatClientContextContext.Provider
      value={{ chatClient, isConnecting }}
    >
      {children}
    </StreamChatClientContextContext.Provider>
  );
};

StreamChatClientContextProvider.propTypes = {
  children: PropTypes.node,
};
