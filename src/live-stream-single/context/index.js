/**
 * LiveStreamContext.js
 *
 * Author: Caleb Panza
 * Created: Apr 01, 2021
 *
 * This is a hacky solution to provide a global context for children of the Media Player to be able to access additional data describing the live stream
 *
 * note : this was originally built in order to pass in a Stream Chat Channel Id down to the Stream Chat Channel component
 */

import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { useStreamChatChannel } from 'hooks';

export const LiveStreamContext = React.createContext({
  chatChannel: {},
  chatChannelLoading: true,
});
export const useLiveStreamContext = () => useContext(LiveStreamContext);

export const LiveStreamContextProvider = ({ liveStreamId, children }) => {
  const { channelId, channelType, loading } = useStreamChatChannel({
    relatedNode: {
      id: liveStreamId,
    },
  });

  return (
    <LiveStreamContext.Provider
      value={{ channelId, channelType, chatChannelLoading: loading }}
    >
      {children}
    </LiveStreamContext.Provider>
  );
};

LiveStreamContextProvider.propTypes = {
  liveStreamId: PropTypes.string,
};
