import React, { PureComponent } from 'react';
import {
  Animated,
  View,
  StyleSheet,
  Dimensions,
  PanResponder,
  Platform,
  StatusBar,
} from 'react-native';
import PropTypes from 'prop-types';
import { Query, withApollo } from 'react-apollo';
import { get } from 'lodash';

import { styled } from '@apollosproject/ui-kit';

import MiniControls, { MINI_PLAYER_HEIGHT } from './MiniControls';
import FullscreenControls from './FullscreenControls';
import VideoWindow from './VideoWindow';
import MusicControls from './MusicControls';
import { GET_FULL_VISIBILITY_STATE } from './queries';
import { EXIT_FULLSCREEN, GO_FULLSCREEN } from './mutations';
import { Provider, ControlsConsumer, PlayheadConsumer } from './PlayheadState';
import MediaPlayerSafeLayout from './MediaPlayerSafeLayout';
import GoogleCastController from './GoogleCastController';

const VideoSizer = styled(
  ({ isFullscreen, isVideo, theme }) =>
    isFullscreen
      ? StyleSheet.absoluteFill
      : {
          height: MINI_PLAYER_HEIGHT,
          borderTopLeftRadius: theme.sizing.baseUnit / 2,
          borderBottomLeftRadius: theme.sizing.baseUnit / 2,
          overflow: 'hidden',
          aspectRatio: isVideo ? 16 / 9 : 1,
        },
  'ui-media.MediaPlayer.FullscreenPlayer.VideoSizer'
)(View);

const FullscreenMediaPlayerSafeLayout = styled(
  ({ isFullscreen, theme }) => ({
    ...StyleSheet.absoluteFillObject,
    margin: isFullscreen ? 0 : theme.sizing.baseUnit,
  }),
  'ui-media.MediaPlayer.FullscreenPlayer.FullscreenMediaPlayerSafeLayout'
)(MediaPlayerSafeLayout);

/**
 * FullscreenPlayer is a animating media player that transitions between
 * a mini state and a full screen state.
 * It is capable of playing any type of media that react-native-video supports.
 * It reads from local graphql state, and so you must use graphql mutations to play tracks.
 */
class FullscreenPlayer extends PureComponent {
  static propTypes = {
    client: PropTypes.shape({ mutate: PropTypes.func }),
    VideoWindowComponent: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.func,
    ]),
    airPlayEnabled: PropTypes.bool,
    googleCastEnabled: PropTypes.bool,
    showAudioToggleControl: PropTypes.bool,
    showVideoToggleControl: PropTypes.bool,
  };

  static defaultProps = {
    airPlayEnabled: true,
    googleCastEnabled: true,
  };

  // Tracks the fullscreen animation
  fullscreen = new Animated.Value(0);

  // Tracks the measured height of the minicontrols. Used in other derived styles
  miniControlHeight = new Animated.Value(MINI_PLAYER_HEIGHT);

  // Tracks the measured height of the fullscreen cover. Used in other derived styles
  coverHeight = new Animated.Value(Dimensions.get('window').height);

  // Tracks the amount you drag the window
  dragOffset = new Animated.Value(0);

  fullScreenWithOffset = Animated.add(this.fullscreen, this.dragOffset);

  // Self-invoking function because we end up with just one massic derived animated value that can be stored
  coverTranslateY = (() => {
    const translateYWhenCollapsed = Animated.subtract(
      this.coverHeight,
      this.miniControlHeight
    );

    const translateYSlope = Animated.multiply(
      translateYWhenCollapsed,
      Animated.multiply(this.fullScreenWithOffset, -1)
    );

    const translateY = Animated.add(translateYSlope, translateYWhenCollapsed);
    return translateY;
  })();

  miniControlsTranslateY = (() => {
    const translateYWhenExpanded = Animated.subtract(
      this.coverHeight,
      this.miniControlHeight
    );
    const translateYSlope = Animated.multiply(
      translateYWhenExpanded,
      Animated.multiply(this.fullScreenWithOffset, -1)
    );
    return translateYSlope;
  })();

  coverStyle = [
    StyleSheet.absoluteFill,
    {
      transform: [{ translateY: this.coverTranslateY }],
    },
  ];

  miniControlsAnimation = {
    opacity: this.fullScreenWithOffset.interpolate({
      inputRange: [0, 0.1],
      outputRange: [1, 0],
    }),
  };

  fullscreenControlsAnimation = [
    StyleSheet.absoluteFill,
    {
      opacity: this.fullScreenWithOffset.interpolate({
        inputRange: [0, 0.1],
        outputRange: [0, 1],
      }),
    },
  ];

  panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (event, { dx, dy }) =>
      Math.abs(dy) > Math.abs(dx) && Math.abs(dy) > 10, // set pan responder only when we move enough in the Y-axis

    onPanResponderMove: (event, { dy }) => {
      // Calculate the amount you've offsetted the cover
      const dragOffset = Math.min(0, -dy / Dimensions.get('window').height);
      this.dragOffset.setValue(dragOffset);
    },

    onPanResponderRelease: (event, { dy, vy }) => {
      const { height } = Dimensions.get('window');
      const gestureVelocity = vy;
      const gestureDistance = Math.abs(dy);

      // Determine whether to continue the animation and exit fullscreen,
      // or stay full screen and reset back up
      let mutation = GO_FULLSCREEN;
      if (Math.abs(gestureVelocity > 0.5)) {
        if (gestureVelocity > 0) {
          mutation = EXIT_FULLSCREEN;
        }
      } else if (gestureDistance >= height / 2) {
        mutation = EXIT_FULLSCREEN;
      }

      const dragOffset = Math.min(0, -dy / Dimensions.get('window').height);

      if (mutation === GO_FULLSCREEN) {
        Animated.spring(this.dragOffset, {
          toValue: 0,
          useNativeDriver: true,
        }).start();
      } else {
        this.dragOffset.setValue(0);
        this.fullscreen.setValue(dragOffset);
      }

      this.props.client.mutate({ mutation });
    },
  });

  handleCoverLayout = Animated.event([
    { nativeEvent: { layout: { height: this.coverHeight } } },
  ]);

  handleMiniControlLayout = Animated.event([
    { nativeEvent: { layout: { height: this.miniControlHeight } } },
  ]);

  renderCover = ({ data: { mediaPlayer = {} } = {} }) => {
    const { isFullscreen = false, isCasting = false } = mediaPlayer;

    Animated.spring(this.fullscreen, {
      toValue: isFullscreen ? 1 : 0,
      useNativeDriver: true,
      bounciness: 4,
    }).start();

    const coverFlow = [
      <Animated.View
        key="cover"
        onLayout={this.handleCoverLayout}
        style={StyleSheet.absoluteFill}
        {...(Platform.OS !== 'android' && isFullscreen
          ? this.panResponder.panHandlers
          : {})}
      >
        {this.props.googleCastEnabled ? (
          <PlayheadConsumer>
            {({ currentTime }) => (
              <GoogleCastController
                client={this.props.client}
                playerPositionAnimation={currentTime}
              />
            )}
          </PlayheadConsumer>
        ) : null}
        {!isCasting ? (
          <VideoSizer
            isFullscreen={isFullscreen}
            isVideo={get(mediaPlayer, 'currentTrack.isVideo')}
          >
            <ControlsConsumer>
              {(controlHandlers) => (
                <VideoWindow
                  VideoComponent={this.props.VideoWindowComponent}
                  {...controlHandlers}
                />
              )}
            </ControlsConsumer>
          </VideoSizer>
        ) : null}
        <Animated.View style={this.fullscreenControlsAnimation}>
          <FullscreenControls
            showAudioToggleControl={this.props.showAudioToggleControl}
            showVideoToggleControl={this.props.showVideoToggleControl}
            airPlayEnabled={this.props.airPlayEnabled}
            googleCastEnabled={this.props.googleCastEnabled}
            isCasting={isCasting}
          />
        </Animated.View>
      </Animated.View>,
      <MusicControls key="music-controls" />,
    ];

    if (!isFullscreen) {
      coverFlow.push(
        <Animated.View
          key="mini-controls"
          style={this.miniControlsAnimation}
          onLayout={this.handleMiniControlLayout}
        >
          <MiniControls />
        </Animated.View>
      );
    }

    return (
      <Animated.View style={this.coverStyle}>
        <FullscreenMediaPlayerSafeLayout isFullscreen={isFullscreen}>
          {isFullscreen ? <StatusBar hidden /> : null}
          {coverFlow}
        </FullscreenMediaPlayerSafeLayout>
      </Animated.View>
    );
  };

  render() {
    return (
      <Provider>
        <Query query={GET_FULL_VISIBILITY_STATE}>{this.renderCover}</Query>
      </Provider>
    );
  }
}

const FullscreenPlayerWithData = withApollo(FullscreenPlayer);

export { FullscreenPlayerWithData as default };
