import React from 'react';
import { View } from 'react-native';
import { styled, LayoutConsumer } from '@apollosproject/ui-kit';

const InnerView = styled(
  ({ isFullscreen = false, theme, safeAreaInsets }) => ({
    marginBottom: isFullscreen
      ? 0
      : Math.max(theme.sizing.baseUnit, safeAreaInsets.bottom * 0.75),
  }),
  'ui-media.MediaPlayer.MediaPlayerSafeLayout.InnerView'
)(View);

const MediaPlayerSafeLayout = (props) => (
  <LayoutConsumer>
    {(insets) => <InnerView safeAreaInsets={insets} {...props} />}
  </LayoutConsumer>
);

export default MediaPlayerSafeLayout;
