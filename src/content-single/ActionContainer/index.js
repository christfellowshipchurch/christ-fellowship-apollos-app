import React from 'react';
import { Platform, View } from 'react-native';
import PropTypes from 'prop-types';
import {
  SideBySideView,
  styled,
  withTheme,
  ThemeMixin,
} from '@apollosproject/ui-kit';
import { MediaPlayerSpacer } from '@apollosproject/ui-media-player';
import {
  LikeButtonConnected,
  ShareButtonConnected,
} from '@apollosproject/ui-connected';

const PositioningView = styled(({ theme }) => ({
  justifyContent: 'space-around',
  paddingVertical: theme.sizing.baseUnit / 2,
  paddingHorizontal: theme.sizing.baseUnit,
}))(SideBySideView);

const Container = styled(({ theme }) => ({
  backgroundColor: theme.colors.paper,
  ...Platform.select(theme.shadows.default),
}))(View);

const StyledShareButtonConnected = styled(({ theme }) => ({
  color: theme.colors.primary,
}))(ShareButtonConnected);

const ActionContainer = withTheme()(({ itemId, theme }) => (
  <ThemeMixin mixin={{ colors: { secondary: theme.colors.primary } }}>
    <Container>
      <MediaPlayerSpacer>
        <PositioningView>
          {/* <LikeButtonConnected itemId={itemId} /> */}
          <StyledShareButtonConnected itemId={itemId} />
        </PositioningView>
      </MediaPlayerSpacer>
    </Container>
  </ThemeMixin>
));

ActionContainer.propTypes = {
  content: PropTypes.shape({}),
  itemId: PropTypes.string,
};

export default ActionContainer;
