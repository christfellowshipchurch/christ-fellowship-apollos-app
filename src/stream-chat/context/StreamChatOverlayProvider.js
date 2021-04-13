/**
 * StreamChatOverlayProvider.js
 *
 * Author: Caleb Panza
 * Created: Apr 13, 2021
 *
 * Local wrapper for Stream's Overlay Provider to help with clarity in code references
 */

import React from 'react';
import PropTypes from 'prop-types';

import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { OverlayProvider } from 'stream-chat-react-native';

const StreamChatOverlayProvider = (props) => {
  const safeAreaInsets = useSafeAreaInsets();

  return (
    <OverlayProvider
      bottomInset={safeAreaInsets.bottom}
      topInset={safeAreaInsets.top}
      {...props}
    />
  );
};

StreamChatOverlayProvider.propTypes = {};
StreamChatOverlayProvider.defaultProps = {};

export default StreamChatOverlayProvider;
