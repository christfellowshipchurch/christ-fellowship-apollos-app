import React, { createContext, Component } from 'react';
import { Animated } from 'react-native';
import { Query, withApollo } from 'react-apollo';
import PropTypes from 'prop-types';

import { getMediaPlayerIsPlaying } from './queries';
import { updatePlayhead } from './mutations';

const defaultState = {
  duration: 1,
  currentTime: new Animated.Value(0),
  playableDuration: new Animated.Value(1),
  seekableDuration: new Animated.Value(1),
  isLoading: true,
};

const controlState = () => {};

const PlayheadContext = createContext(defaultState);

const PlayheadControls = createContext(controlState);

class ProviderWithoutApollo extends Component {
  static propTypes = {
    client: PropTypes.shape({
      mutate: PropTypes.func,
    }),
  };

  state = defaultState;

  get controlState() {
    return {
      onLoad: this.handleOnLoad,
      onLoadStart: this.handleOnLoadStart,
      // onBuffer: this.handleOnBuffer,
      onProgress: this.handleOnProgress,
      skip: this.skip,
      isLoading: this.state.isLoading,
      // isBuffering: this.state.isBuffering,
    };
  }

  handleOnLoad = ({ duration }) => {
    this.setState({ duration, isLoading: false });
    this.state.currentTime.setValue(0);
    this.state.playableDuration.setValue(0);
    this.state.seekableDuration.setValue(0);
  };

  handleOnLoadStart = () => {
    this.setState({ isLoading: true });
  };

  // handleOnBuffer = ({ isBuffering }) => {
  //   this.setState({ isBuffering }); // bool value https://github.com/react-native-community/react-native-video/blob/2c391f580702f9579a0ebd01c6e97415feda928b/ios/Video/RCTVideo.m#L636-L643
  // };

  handleOnProgress = ({ currentTime, playableDuration, seekableDuration }) => {
    if (!this.seekingTo || Math.abs(this.seekingTo - currentTime) < 1) {
      // when seeking, only update `currentTime` after the seek has finished
      this.seekingTo = null;
      this.lastCurrentTime = currentTime;
      this.state.currentTime.setValue(currentTime);
    }
    this.state.playableDuration.setValue(playableDuration);
    this.state.seekableDuration.setValue(seekableDuration);
  };

  handlePause = () => {
    this.props.client.mutate({
      mutation: updatePlayhead,
      variables: {
        currentTime: this.lastCurrentTime,
      },
    });
  };

  skip = async (secondsToSkip) => {
    if (this.lastCurrentTime === undefined) return;
    const currentTime = Math.min(
      Math.max(this.lastCurrentTime + secondsToSkip, 0),
      this.state.duration
    );

    await this.props.client.mutate({
      mutation: updatePlayhead,
      variables: {
        currentTime,
      },
    });

    this.seekingTo = currentTime;
    this.state.currentTime.setValue(currentTime); // immediately set the playhead value so progress bar doesn't jump around
  };

  renderProviders = ({
    data: { mediaPlayer: { isPlaying = false } = {} } = {},
  }) => {
    if (!isPlaying && this.wasPlaying) {
      this.handlePause();
    }
    this.wasPlaying = isPlaying;

    return (
      <PlayheadControls.Provider value={this.controlState}>
        <PlayheadContext.Provider value={this.state} {...this.props} />
      </PlayheadControls.Provider>
    );
  };

  render() {
    return (
      <Query query={getMediaPlayerIsPlaying}>{this.renderProviders}</Query>
    );
  }
}

const Provider = withApollo(ProviderWithoutApollo);

const { Consumer: PlayheadConsumer } = PlayheadContext;
const { Consumer: ControlsConsumer } = PlayheadControls;

export { Provider, PlayheadConsumer, ControlsConsumer };
