/**
 * ChatChannelSingle.js
 *
 * Author: Caleb Panza
 * Created: Mar 30, 2021
 *
 * A view that renders a full screen, single Chat Channel. It is assumed that this component will sit inside of a Navigation Stack and expects to properties formatted as Navigation Params.
 */

import React from 'react';
import PropTypes from 'prop-types';

import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { OverlayProvider as ChatOverlayProvider } from 'stream-chat-react-native';
import NavigationHeader from 'ui/NavigationHeader';
import ChatChannel from './ChatChannel';

const ChatChannelSingle = ({ route }) => {
  const { bottom } = useSafeAreaInsets();

  const itemId = route?.params?.itemId;
  const relatedNode = route?.params?.relatedNode;

  return (
    <ChatOverlayProvider bottomInset={bottom} topInset={0}>
      <SafeAreaView>
        <NavigationHeader />
        <ChatChannel
          relatedNode={relatedNode}
          streamChatChannel={{ id: itemId }}
        />
      </SafeAreaView>
    </ChatOverlayProvider>
  );
};

ChatChannelSingle.propTypes = {
  route: PropTypes.shape({
    params: PropTypes.shape({
      itemId: PropTypes.string,
      relatedNode: {
        id: PropTypes.string,
        title: PropTypes.string,
      },
    }),
  }),
};
ChatChannelSingle.defaultProps = {};

export default ChatChannelSingle;
