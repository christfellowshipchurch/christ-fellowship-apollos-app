import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Query, withApollo } from 'react-apollo';
import { get } from 'lodash';
import Video from 'react-native-video';
import { Animated, View, StyleSheet } from 'react-native';

import { styled, ActivityIndicator } from '@apollosproject/ui-kit';

import { getVideoState } from './queries';
import { pause as pauseMutation, pauseAndRestart } from './mutations';

const styles = StyleSheet.create({
  animatedPosterImage: {
    ...StyleSheet.absoluteFillObject,
    resizeMode: 'cover',
  },
});

const Background = styled(({ theme }) => ({
  ...StyleSheet.absoluteFillObject,
  backgroundColor: theme.colors.black,
}))(View);

/**
 * The VideoWindow displays the actual react-native-video component.
 * It's responsible for loading the video, and updating progress + duration in state.
 */
class VideoWindow extends PureComponent {
  static propTypes = {
    client: PropTypes.shape({
      mutate: PropTypes.func,
    }),
    onProgress: PropTypes.func,
    onLoad: PropTypes.func,
    onLoadStart: PropTypes.func,
    // onBuffer: PropTypes.func,
  };

  loadingOverlay = new Animated.Value(1);

  loadingStyle = [StyleSheet.absoluteFill, { opacity: this.loadingOverlay }];

  handleOnEnd = async () => {
    this.props.client.mutate({ mutation: pauseAndRestart });
  };

  handlePause = () => {
    this.props.client.mutate({ mutation: pauseMutation });
  };

  handleOnProgress = (progress) => {
    if (this.props.onProgress) this.props.onProgress(progress);
  };

  handleOnError = () => {
    this.handlePause();
  };

  handleOnLoad = ({ duration }) => {
    this.showLoadingIndicator(false);

    if (this.props.onLoad) this.props.onLoad({ duration });
  };

  handleOnLoadStart = () => {
    if (this.props.onLoadStart) this.props.onLoadStart();
    this.showLoadingIndicator(true);
  };

  handleOnBuffer = ({ isBuffering }) => {
    // if (this.props.onBuffer) this.props.onBuffer({ isBuffering });
    this.showLoadingIndicator(!isBuffering);
  };

  setVideoRef = (element) => {
    this.video = element;
  };

  showLoadingIndicator(isLoading) {
    if (isLoading) {
      Animated.spring(this.loadingOverlay, {
        toValue: 1,
        useNativeDriver: true,
      });
    } else {
      Animated.spring(this.loadingOverlay, {
        toValue: 0,
        useNativeDriver: true,
      }).start();
    }
  }

  renderVideo = ({ data: { mediaPlayer = {} } = {} }) => {
    if (!get(mediaPlayer, 'currentTrack.mediaSource')) return null;

    const { currentTime } = mediaPlayer;
    if (currentTime && currentTime !== this.lastCurrentTime && this.video) {
      this.video.seek(currentTime);
    }

    this.lastCurrentTime = currentTime;

    return [
      <Video
        ref={this.setVideoRef}
        source={mediaPlayer.currentTrack.mediaSource}
        paused={!mediaPlayer.isPlaying}
        audioOnly={!mediaPlayer.showVideo}
        ignoreSilentSwitch={'ignore'}
        allowsExternalPlayback
        playInBackground
        playWhenInactive
        onAudioBecomingNoisy={this.handlePause}
        onEnd={this.handleOnEnd}
        onError={this.handleOnError}
        resizeMode={'contain'}
        onLoadStart={this.handleOnLoadStart}
        onLoad={this.handleOnLoad}
        // onBuffer={this.handleOnBuffer}
        onProgress={this.handleOnProgress}
        style={StyleSheet.absoluteFill}
        volume={mediaPlayer.muted ? 0 : 1}
        repeat
        key="video"
      />,
      // there's currently a bug on android where react-native-video's poster doesn't ever go away
      // So we use our own image copmonent...which is nicer cuz we can show a nice fading animation too!
      <Animated.Image
        key="poster"
        style={[
          styles.animatedPosterImage,
          mediaPlayer.showVideo ? this.loadingStyle : {},
        ]}
        source={mediaPlayer.currentTrack.posterSources}
      />,
    ];
  };

  render() {
    return (
      <Background>
        <Query query={getVideoState}>{this.renderVideo}</Query>
        <Animated.View style={this.loadingStyle}>
          <ActivityIndicator size={'large'} />
        </Animated.View>
      </Background>
    );
  }
}

export default withApollo(VideoWindow);
