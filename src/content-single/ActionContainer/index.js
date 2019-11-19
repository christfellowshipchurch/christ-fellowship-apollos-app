import React from 'react';
import { Platform, View } from 'react-native';
import PropTypes from 'prop-types';
import ShareButton from 'ChristFellowship/src/ui/ShareButton';

import { SideBySideView, styled } from '@apollosproject/ui-kit';
import LikeButton from 'ChristFellowship/src/ui/LikeButton';
import { MediaPlayerSpacer } from '@apollosproject/ui-media-player';

const PositioningView = styled(({ theme }) => ({
  justifyContent: 'space-around',
  paddingVertical: theme.sizing.baseUnit / 2,
  paddingHorizontal: theme.sizing.baseUnit,
}))(SideBySideView);

const Container = styled(({ theme }) => ({
  backgroundColor: theme.colors.paper,
  ...Platform.select(theme.shadows.default),
}))(View);

const ActionContainer = ({ itemId }) => itemId !== '' && (
  <Container>
    <MediaPlayerSpacer>
      <PositioningView>
        <LikeButton itemId={itemId} />
        <ShareButton itemId={itemId} />
      </PositioningView>
    </MediaPlayerSpacer>
  </Container>
);

ActionContainer.propTypes = {
  content: PropTypes.shape({}),
  itemId: PropTypes.string,
};

ActionContainer.defaultProps = {
  itemId: '',
};

export default ActionContainer;
