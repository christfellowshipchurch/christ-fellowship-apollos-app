import React, { Component } from 'react';
import { Platform, View, Animated, StyleSheet } from 'react-native';
import { Mutation, Query } from 'react-apollo';
import LinearGradient from 'react-native-linear-gradient';

import {
  withTheme,
  styled,
  Touchable,
  H5,
  ButtonIcon,
  FlexedView,
} from '@apollosproject/ui-kit';

import Seeker from './Seeker';

import { GET_CONTROL_STATE } from './queries';

import { GO_FULLSCREEN, DISMISS, PLAY, PAUSE } from './mutations';

const MINI_PLAYER_HEIGHT = 50;

const Shadow = styled(
  ({ theme }) => ({
    borderRadius: theme.sizing.baseBorderRadius / 2,
    ...Platform.select(theme.shadows.default),
  }),
  'ui-media.MediaPlayer.MiniControls.Shadow'
)(View);

const Container = styled(
  ({ theme }) => ({
    height: MINI_PLAYER_HEIGHT,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    overflow: 'hidden',
    borderRadius: theme.sizing.baseBorderRadius / 2,
  }),
  'ui-media.MediaPlayer.MiniControls.Container'
)(View);

// ThumbnailSpacer is used to offset the text in MiniPlayer to make room for the video/music
// thumbnail in a way that is dynamic to the MINI_PLAYER_HEIGHT
const ThumbnailSpacer = styled(
  ({ isVideo }) => ({
    height: MINI_PLAYER_HEIGHT,
    aspectRatio: isVideo ? 16 / 9 : 1,
  }),
  'ui-media.MediaPlayer.MiniControls.ThumbnailSpacer'
)(View);

const DismissBackground = withTheme(
  ({ theme }) => ({
    style: StyleSheet.absoluteFill,
    ...theme.overlays.low({ overlayColor: theme.colors.black }),
  }),
  'ui-media.MediaPlayer.MiniControls.DismissBackground'
)(LinearGradient);

const IconStyles = withTheme(
  ({ theme }) => ({
    fill: theme.colors.darkTertiary,
    size: theme.sizing.baseUnit,
    iconPadding: theme.sizing.baseUnit * 0.75,
  }),
  'ui-media.MediaPlayer.MiniControls.IconStyles'
);

const StyledButtonIcon = IconStyles(ButtonIcon);

const Controls = styled(
  ({ theme }) => ({
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingRight: theme.sizing.baseUnit * 0.75,
    backgroundColor: theme.colors.background.secondary,
  }),
  'ui-media.MediaPlayer.MiniControls.Controls'
)(FlexedView);

const TrackInfo = styled(
  ({ theme }) => ({
    paddingLeft: theme.sizing.baseUnit / 2,
    height: '100%',
    justifyContent: 'center',
    width: '100%',
  }),
  'ui-media.MediaPlayer.MiniControls.TrackInfo'
)(View);

const MiniSeeker = styled(
  {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
  'ui-media.MediaPlayer.MiniControls.MiniSeeker'
)(Seeker);

/**
 * The MiniControls renders basic track info and a play/pause button.
 * Also displays a close button to close the player when the track is paused.
 */
class MiniControls extends Component {
  dismissAnimator = new Animated.Value(0);

  shouldComponentUpdate() {
    return false;
  }

  renderMiniControls = ({
    data: {
      mediaPlayer: {
        currentTrack: { title, isVideo } = {},
        isPlaying = false,
      } = {},
    } = {},
  }) => {
    Animated.spring(this.dismissAnimator, {
      toValue: isPlaying ? 0 : 0.8,
      overshootClamping: true,
      useNativeDriver: true,
    }).start();
    return (
      <Mutation mutation={GO_FULLSCREEN}>
        {(goFullscreen) => (
          <Shadow>
            <Container>
              <Animated.View
                style={[
                  StyleSheet.absoluteFill,
                  { opacity: this.dismissAnimator },
                ]}
              >
                <DismissBackground />
              </Animated.View>
              <ThumbnailSpacer isVideo={isVideo} />
              <Controls>
                <FlexedView>
                  <Touchable onPress={() => goFullscreen()}>
                    <TrackInfo>
                      <H5 numberOfLines={1}>{title}</H5>
                    </TrackInfo>
                  </Touchable>
                </FlexedView>
                {isPlaying ? (
                  <Mutation mutation={PAUSE}>
                    {(pause) => (
                      <StyledButtonIcon
                        name={'pause'}
                        onPress={() => pause()}
                      />
                    )}
                  </Mutation>
                ) : (
                  <Mutation mutation={PLAY}>
                    {(play) => (
                      <StyledButtonIcon name={'play'} onPress={() => play()} />
                    )}
                  </Mutation>
                )}
                <Mutation mutation={DISMISS}>
                  {(dismiss) => (
                    <StyledButtonIcon name="close" onPress={() => dismiss()} />
                  )}
                </Mutation>
              </Controls>
              <MiniSeeker minimal />
            </Container>
          </Shadow>
        )}
      </Mutation>
    );
  };

  render() {
    return <Query query={GET_CONTROL_STATE}>{this.renderMiniControls}</Query>;
  }
}

export { MiniControls as default, MINI_PLAYER_HEIGHT };
