/**
 * Close Button
 *
 * When testing with the new media player and manually changing the orientation, there was a bug that showed up where rotating would hide the React Navigation header, making it impossible for a user to close the Live Stream Modal.
 *
 * To counter this, we'll create a small component that manually places the close button at the top right of the screen and hides when in full screen mode
 */
import React from 'react';
import {
  usePlayerControls,
  PictureMode,
} from '@apollosproject/ui-media-player';

import { View } from 'react-native';
import { styled, ModalCloseButton } from '@apollosproject/ui-kit';

const ModalCloseButtonSpacing = styled(({ theme }) => ({
  position: 'absolute',
  top: theme.sizing.baseUnit * 2,
  right: theme.sizing.baseUnit,
  zIndex: 100,
}))(View);

const CloseButton = () => {
  const { pictureMode } = usePlayerControls();
  const isFullScreen = pictureMode === PictureMode.Fullscreen;

  if (isFullScreen) return null;

  return (
    <ModalCloseButtonSpacing>
      <ModalCloseButton />
    </ModalCloseButtonSpacing>
  );
};

export default CloseButton;
