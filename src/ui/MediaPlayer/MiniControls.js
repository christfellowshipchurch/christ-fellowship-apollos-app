import React, { Component } from 'react';
import { Platform, View, Animated, StyleSheet } from 'react-native';
import { Mutation, Query } from 'react-apollo';

import {
  withTheme,
  Icon,
  styled,
  Touchable,
  H5,
  H6,
  ButtonIcon,
} from '@apollosproject/ui-kit';

import Seeker from './Seeker';

import { getControlState } from './queries';

import {
  goFullscreen as goFullscreenMutation,
  dismiss as dismissMutation,
  play as playMutation,
  pause as pauseMutation,
} from './mutations';

const MINI_PLAYER_HEIGHT = 50;

const DismissBackground = styled(({ theme }) => ({
  ...StyleSheet.absoluteFillObject,
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: theme.colors.white,
}))(View);

const TrackInfoTouchable = styled({
  flex: 1,
})(Touchable);

const TrackInfoTouchableBackground = styled(({ theme }) => ({
  backgroundColor: theme.colors.white,
  flex: 1,
}))(View);

const TrackInfo = styled(({ theme }) => ({
  paddingHorizontal: theme.sizing.baseUnit / 2,
  height: '100%',
  justifyContent: 'center',
  width: '100%',
}))(View);

const TrackName = styled(({ theme }) => ({
  height: theme.sizing.baseUnit,
  overflow: 'hidden',
}))(H5);

const TrackArtist = styled(({ theme }) => ({
  height: theme.sizing.baseUnit,
  marginTop: theme.helpers.rem(-0.15625),
  color: theme.colors.text.tertiary,
  // overflow: 'hidden',
}))(H6);

const Container = styled(({ theme }) => ({
  height: MINI_PLAYER_HEIGHT,
  flexDirection: 'row',
  justifyContent: 'flex-start',
  overflow: 'hidden',
  borderRadius: theme.sizing.baseUnit / 2,
}))(View);

const Shadow = styled(({ theme }) => ({
  borderRadius: theme.sizing.baseUnit / 2,
  ...Platform.select(theme.shadows.default),
}))(View);

// ThumbnailSpacer is used to offset the text in MiniPlayer to make room for the video/music
// thumbnail in a way that is dynamic to the MINI_PLAYER_HEIGHT
const ThumbnailSpacer = styled(({ isVideo }) => ({
  height: MINI_PLAYER_HEIGHT,
  aspectRatio: isVideo ? 16 / 9 : 1,
}))(View);

const Controls = styled(({ theme }) => ({
  position: 'absolute',
  right: 0,
  bottom: 0,
  top: -1,
  paddingHorizontal: theme.sizing.baseUnit / 2,
  flexDirection: 'row',
  justifyContent: 'flex-end',
  alignItems: 'center',
}))(View);

const MiniSeeker = styled({
  position: 'absolute',
  left: 0,
  right: 0,
  bottom: 0,
})(Seeker);

const IconStyles = withTheme(({ theme }) => ({
  fill: theme.colors.darkTertiary,
  size: theme.sizing.baseUnit * 1.25,
}));

const StyledIcon = IconStyles(Icon);
const StyledButtonIcon = IconStyles(ButtonIcon);

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
        currentTrack: { title, artist, isVideo } = {},
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
      <Mutation mutation={goFullscreenMutation}>
        {(goFullscreen) => (
          <Shadow>
            <Container>
              <Mutation mutation={dismissMutation}>
                {(dismiss) => (
                  <Touchable
                    onPress={() => (isPlaying ? goFullscreen() : dismiss())}
                  >
                    <ThumbnailSpacer isVideo={isVideo}>
                      <Animated.View
                        style={[
                          StyleSheet.absoluteFill,
                          { opacity: this.dismissAnimator },
                        ]}
                      >
                        <DismissBackground>
                          <StyledIcon name="close" />
                        </DismissBackground>
                      </Animated.View>
                    </ThumbnailSpacer>
                  </Touchable>
                )}
              </Mutation>
              <TrackInfoTouchableBackground>
                <TrackInfoTouchable onPress={() => goFullscreen()}>
                  <TrackInfo>
                    <TrackName>{title}</TrackName>
                    <TrackArtist>{artist}</TrackArtist>
                  </TrackInfo>
                </TrackInfoTouchable>
              </TrackInfoTouchableBackground>
              <Controls>
                {isPlaying ? (
                  <Mutation mutation={pauseMutation}>
                    {(pause) => (
                      <StyledButtonIcon
                        name={'pause'}
                        onPress={() => pause()}
                      />
                    )}
                  </Mutation>
                ) : (
                  <Mutation mutation={playMutation}>
                    {(play) => (
                      <StyledButtonIcon name={'play'} onPress={() => play()} />
                    )}
                  </Mutation>
                )}
              </Controls>
              <MiniSeeker minimal />
            </Container>
          </Shadow>
        )}
      </Mutation>
    );
  };

  render() {
    return <Query query={getControlState}>{this.renderMiniControls}</Query>;
  }
}

export { MiniControls as default, MINI_PLAYER_HEIGHT };
