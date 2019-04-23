import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Animated, Platform } from 'react-native';
import MusicControl from 'react-native-music-control';
import { withApollo, Query } from 'react-apollo';
import { throttle, get } from 'lodash';

import { PlayheadConsumer, ControlsConsumer } from './PlayheadState';
import { getMusicControlState } from './queries';
import { play, pause, updatePlayhead } from './mutations';

class MusicControls extends Component {
  static propTypes = {
    currentTrack: PropTypes.shape({}),
    currentTime: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    currentTimeAnimated: PropTypes.instanceOf(Animated.Value),
    isPlaying: PropTypes.bool,
    duration: PropTypes.number,
    skip: PropTypes.func,
    client: PropTypes.shape({ mutate: PropTypes.func }),
  };

  constructor(...args) {
    super(...args);
    // iOS is the only platform that displays currentTime and Android is notorious bad at handling
    // the JS thread.
    if (Platform.OS === 'ios') this.currentTimeSubscription();
  }

  componentDidUpdate(oldProps) {
    if (this.props.duration > 1 && oldProps.duration !== this.props.duration) {
      this.configureMusicControl();
    }
    if (this.props.currentTimeAnimated !== oldProps.currentTimeAnimated) {
      if (this.listener) {
        oldProps.currentTimeAnimated.removeListener(this.listener);
      }
      if (Platform.OS === 'ios') this.currentTimeSubscription();
    }

    if (
      oldProps.currentTime !== this.props.currentTime ||
      oldProps.isPlaying !== this.props.isPlaying
    ) {
      this.updatePlayback();
    }
  }

  componentWillUnmount() {
    MusicControl.enableBackgroundMode(false);
    MusicControl.stopControl();
    if (this.listener)
      this.props.currentTimeAnimated.removeListener(this.listener);
  }

  currentTimeSubscription = () => {
    this.listener = this.props.currentTimeAnimated.addListener(
      throttle(({ value }) => {
        MusicControl.updatePlayback({
          state: this.props.isPlaying
            ? MusicControl.STATE_PLAYING
            : MusicControl.STATE_PAUSED,
          elapsedTime: value,
        });
      }, 1000)
    );
  };

  configureMusicControl = () => {
    // Initialize MusicControl settings
    MusicControl.enableBackgroundMode(true);

    // Play
    MusicControl.enableControl('play', true);
    MusicControl.on('play', this.handleOnPlay);

    // Pause/Stop
    MusicControl.enableControl('pause', true);
    MusicControl.enableControl('stop', false);
    MusicControl.on('pause', this.handleOnPause);
    MusicControl.on('stop', this.handleOnPause);

    // Skip
    MusicControl.enableControl('previousTrack', false);
    MusicControl.enableControl('nextTrack', false);

    // Seeking
    if (this.props.skip) {
      MusicControl.enableControl('skipForward', true);
      MusicControl.enableControl('skipBackward', true);
      MusicControl.on('skipForward', this.handleOnFastForward);
      MusicControl.on('skipBackward', this.handleOnRewind);
    }

    // Scrubber
    MusicControl.enableControl('seek', true); // Android
    MusicControl.enableControl('changePlaybackPosition', true); // iOS
    MusicControl.on('seek', this.handleOnSeek);
    MusicControl.on('changePlaybackPosition', this.handleOnSeek);

    // Remote (headphones) play/pause
    MusicControl.enableControl('togglePlayPause', true);
    MusicControl.on('togglePlayPause', () =>
      this.props.isPlaying ? this.handleOnPause() : this.handleOnPlay()
    );

    // Remote (headphones) fast forward/rewind (iOS only) (disabled)
    MusicControl.enableControl('seekForward', false);
    MusicControl.enableControl('seekBackward', false);

    // Swipe to dismiss native control (Android only)
    MusicControl.enableControl('closeNotification', true, { when: 'paused' });

    // Configure the visuals
    const { currentTrack = {} } = this.props;
    MusicControl.setNowPlaying({
      title: currentTrack.title,
      artist: currentTrack.artist,
      artwork: get(currentTrack, 'posterSources[0].uri'),
      elapsedTime: this.props.currentTime,
      duration: this.props.duration,
    });
  };

  updatePlayback = () => {
    MusicControl.updatePlayback({
      state: this.props.isPlaying
        ? MusicControl.STATE_PLAYING
        : MusicControl.STATE_PAUSED,
      elapsedTime: this.props.currentTime,
    });
  };

  handleOnPlay = () => this.props.client.mutate({ mutation: play });

  handleOnPause = () => this.props.client.mutate({ mutation: pause });

  handleOnFastForward = () => this.props.skip(15);

  handleOnRewind = () => this.props.skip(-15);

  handleOnSeek = (seekTo) =>
    this.props.client.mutate({
      mutation: updatePlayhead,
      variables: {
        currentTime: seekTo,
      },
    });

  render() {
    return null;
  }
}

const MusicControlsState = (props) => (
  <Query query={getMusicControlState}>
    {({ data: { mediaPlayer = {} } = {} }) => (
      <PlayheadConsumer>
        {({ duration, currentTime }) => (
          <ControlsConsumer>
            {({ skip }) => (
              <MusicControls
                {...props}
                currentTimeAnimated={currentTime}
                duration={duration}
                skip={skip}
                {...mediaPlayer}
              />
            )}
          </ControlsConsumer>
        )}
      </PlayheadConsumer>
    )}
  </Query>
);

export default withApollo(MusicControlsState);
