import React from 'react';
import { Platform, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import PropTypes from 'prop-types';
import {
  SideBySideView,
  withTheme,
  ThemeMixin,
  styled,
} from '@apollosproject/ui-kit';
import {
  LikeButtonConnected,
  ShareButtonConnected,
} from '@apollosproject/ui-connected';

const PositioningView = styled(({ theme }) => ({
  justifyContent: 'space-around',
  paddingVertical: theme.sizing.baseUnit / 2,
  paddingHorizontal: theme.sizing.baseUnit,
}))(SideBySideView);

const Container = styled(({ theme, safeAreaMargin }) => ({
  backgroundColor: theme.colors.background.paper,
  position: 'absolute',
  width: '100%',
  bottom: 0,
  paddingBottom: safeAreaMargin,
  ...Platform.select(theme.shadows.default),
}))(View);

const ActionContainer = ({ itemId, theme }) => {
  const { bottom } = useSafeAreaInsets();
  const colors = {
    secondary: theme.colors.primary,
  };

  return (
    <ThemeMixin mixin={{ colors }}>
      <Container safeAreaMargin={bottom}>
        <PositioningView>
          <LikeButtonConnected itemId={itemId} />
          <ShareButtonConnected itemId={itemId} />
        </PositioningView>
      </Container>
    </ThemeMixin>
  );
};

ActionContainer.propTypes = {
  content: PropTypes.shape({}),
  itemId: PropTypes.string,
  theme: PropTypes.shape({
    colors: PropTypes.shape({
      primary: PropTypes.string,
    }),
  }),
};

export default withTheme()(ActionContainer);
