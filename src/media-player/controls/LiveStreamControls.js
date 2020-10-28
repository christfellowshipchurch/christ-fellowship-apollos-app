import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {
  BackHandler,
  StyleSheet,
  Animated,
  TouchableOpacity,
  View,
  Platform,
} from 'react-native';
import { Query, withApollo } from 'react-apollo';
import LinearGradient from 'react-native-linear-gradient';
import GoogleCast from 'react-native-google-cast';
import { SafeAreaView } from 'react-navigation';
import { get } from 'lodash';
import { compose } from 'recompose';

import {
  PaddedView,
  withTheme,
  withThemeMixin,
  styled,
  H4,
  H6,
  ButtonIcon,
} from '@apollosproject/ui-kit';

import { GET_CONTROL_STATE } from '../queries';
import {
  PLAY,
  PAUSE,
  EXIT_FULLSCREEN,
  SHOW_VIDEO,
  HIDE_VIDEO,
  MUTE,
  UNMUTE,
} from '../mutations';
import { WithFeatureFlag } from '../../hooks';
import { ControlsConsumer } from './PlayheadState';
import Seeker from './Seeker';
import AirPlayButton from './AirPlayButton';
import GoogleCastButton from './GoogleCastButton';

const Background = withTheme(({ theme }) => ({
  style: StyleSheet.absoluteFill,
  colors: [
    theme.colors.darkPrimary,
    theme.colors.transparent,
    theme.colors.darkPrimary,
  ],
  locations: [0, 0.4, 0.95],
}))(LinearGradient);

const TappableArea = styled({
  flex: 1,
  justifyContent: 'space-between',
})(TouchableOpacity);

const UpperControls = styled({
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
})(View);

const LowerControls = styled({
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
})(View);

const CastButtons = styled({
  flexDirection: 'row',
  justifyContent: 'space-around',
  alignItems: 'center',
  paddingVertical: 0,
})(PaddedView);

const PlayControls = styled(() => ({
  flexDirection: 'row',
  justifyContent: 'space-around',
  alignItems: 'center',
  paddingVertical: 0,
}))(PaddedView);

const PlayHead = styled({ paddingVertical: 0 })(PaddedView);

const Titles = styled({
  flex: 1,
  alignItems: 'center',
  paddingVertical: 0,
})(PaddedView);

const Title = styled({ textAlign: 'center' })(H4);

const Artist = styled({ textAlign: 'center' })(H6);

const IconSm = withTheme(({ theme }) => ({
  size: theme.sizing.baseUnit * 1.25,
  iconPadding: theme.sizing.baseUnit * 1.25,
}))(ButtonIcon);

const IconMd = withTheme(({ theme }) => ({
  size: theme.sizing.baseUnit * 1.875,
  iconPadding: theme.sizing.baseUnit * 0.9375,
}))(ButtonIcon);

const IconLg = withTheme(({ theme }) => ({
  size: theme.sizing.baseUnit * 3.125,
  iconPadding: theme.sizing.baseUnit * 0.3125,
}))(ButtonIcon);

/**
 * LiveStreamControls displays fading player controls
 */
class LiveStreamControls extends PureComponent {
  fader = new Animated.Value(1);

  wasFullscreen = false;

  open = Animated.spring(this.fader, {
    toValue: 1,
    useNativeDriver: true,
  });

  close = Animated.spring(this.fader, {
    toValue: 0,
    useNativeDriver: true,
  });

  static propTypes = {
    client: PropTypes.shape({
      mutate: PropTypes.func,
    }),
    isCasting: PropTypes.bool,
    onShowChat: PropTypes.func,
    isPortrait: PropTypes.bool,
  };

  static defaultProps = {
    isCasting: false,
  };

  state = {
    controlsVisible: true,
  };

  constructor(...args) {
    super(...args);
    this.fader.addListener(({ value }) => {
      this.setState({ controlsVisible: value > 0.05 });
    });
  }

  componentDidMount() {
    this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (this.wasFullscreen) {
        this.handleClose();
        return true;
      }
      return false;
    });
  }

  componentWillUnmount() {
    this.backHandler.remove();
    if (this.closeTimeout) clearTimeout(this.closeTimeout);
  }

  handleOnScrubbing = ({ isScrubbing }) => {
    this.setState({ isScrubbing });
  };

  handleClose = () => {
    this.props.client.mutate({ mutation: EXIT_FULLSCREEN });
  };

  handlePlay = () => {
    this.props.client.mutate({ mutation: PLAY });
    if (this.props.isCasting) GoogleCast.play();
  };

  handlePause = () => {
    this.props.client.mutate({ mutation: PAUSE });
    if (this.props.isCasting) GoogleCast.pause();
  };

  handleShowVideo = () => {
    this.props.client.mutate({ mutation: SHOW_VIDEO });
  };

  handleHideVideo = () => {
    this.props.client.mutate({ mutation: HIDE_VIDEO });
  };

  handleMute = () => {
    this.props.client.mutate({ mutation: MUTE });
  };

  handleUnMute = () => {
    this.props.client.mutate({ mutation: UNMUTE });
  };

  handleControlVisibility = () => {
    if (this.closeTimeout) clearTimeout(this.closeTimeout);
    this.open.stop();
    this.close.stop();

    if (
      !this.state.isScrubbing &&
      this.isVideo &&
      this.isPlaying &&
      this.wasFullscreen &&
      (!this.animatingClosed && this.state.controlsVisible)
    ) {
      this.animatingClosed = true;
      this.close.start(() => {
        this.animatingClosed = false;
      });
    } else {
      this.open.start(() => {
        if (this.isVideo && this.isPlaying) this.queueClose();
      });
    }
  };

  queueClose = () => {
    this.closeTimeout = setTimeout(this.handleControlVisibility, 5000);
  };

  renderPlayerControls = ({ isLoading, skip }) => (
    <PlayControls pointerEvents={this.state.controlsVisible ? 'auto' : 'none'}>
      {!this.props.isCasting ? (
        <IconSm
          onPress={this.isMuted ? this.handleUnMute : this.handleMute}
          name={this.isMuted ? 'mute' : 'volume'}
          disabled={isLoading}
        />
      ) : (
        <IconSm name="empty" />
      )}
      {!this.props.isCasting ? (
        <IconMd
          onPress={() => skip(-30)}
          name={'skip-back-thirty'}
          disabled={isLoading}
        />
      ) : (
        <IconSm name="empty" />
      )}
      {// TODO can be enabled once this bug is fixed
      // https://github.com/react-native-google-cast/react-native-google-cast/issues/151
      !this.props.isCasting ? (
        <IconLg
          onPress={this.isPlaying ? this.handlePause : this.handlePlay}
          name={this.isPlaying ? 'pause' : 'play'}
          disabled={isLoading}
        />
      ) : (
        <IconSm name="empty" />
      )}
      {!this.props.isCasting ? (
        <IconMd
          onPress={() => skip(30)}
          name={'skip-forward-thirty'}
          disabled={isLoading}
        />
      ) : (
        <IconSm name="empty" />
      )}
      {!this.props.isCasting ? (
        <IconSm
          onPress={this.isVideo ? this.handleHideVideo : this.handleShowVideo}
          name={this.isVideo ? 'video' : 'video-off'}
          disabled={isLoading}
        />
      ) : (
        <IconSm name="empty" />
      )}
    </PlayControls>
  );

  renderFullscreenControls = ({ data: { mediaPlayer = {} } = {} }) => {
    this.isVideo = get(mediaPlayer, 'showVideo');
    this.isPlaying = mediaPlayer.isPlaying;
    this.isMuted = mediaPlayer.muted;

    if (
      (mediaPlayer.isFullscreen && !this.wasFullscreen) ||
      !this.isVideo ||
      (!this.isPlaying || (this.isPlaying && !this.wasPlaying))
    )
      this.handleControlVisibility();

    this.wasFullscreen = mediaPlayer.isFullscreen;
    this.wasPlaying = mediaPlayer.isPlaying;

    return (
      <Animated.View style={[StyleSheet.absoluteFill, { opacity: this.fader }]}>
        <Background>
          <SafeAreaView
            style={StyleSheet.absoluteFill}
            forceInset={{ top: 'always' }}
          >
            <TappableArea onPress={this.handleControlVisibility}>
              <UpperControls
                pointerEvents={this.state.controlsVisible ? 'auto' : 'none'}
              >
                <IconSm name="arrow-down" onPress={this.handleClose} />
                <Titles>
                  <Title>{get(mediaPlayer, 'currentTrack.title')}</Title>
                  <Artist>{get(mediaPlayer, 'currentTrack.artist')}</Artist>
                </Titles>
                <WithFeatureFlag flag={'LIVE_STREAM_CHAT'}>
                  {(enabled) =>
                    !this.props.isPortrait && enabled ? (
                      <IconSm
                        name={'chat-conversation'}
                        onPress={this.props.onShowChat}
                      />
                    ) : (
                      <IconSm name="empty" disabled />
                    )
                  }
                </WithFeatureFlag>
              </UpperControls>
              <LowerControls>
                <CastButtons>
                  {Platform.OS === 'ios' && !this.props.isCasting ? (
                    <AirPlayButton />
                  ) : null}
                  <GoogleCastButton />
                </CastButtons>
                <PlayHead>
                  {// TODO can be enabled once this bug is fixed
                  // https://github.com/react-native-google-cast/react-native-google-cast/issues/151
                  !this.props.isCasting ? (
                    <Seeker
                      onScrubbing={this.handleOnScrubbing}
                      isCasting={this.props.isCasting}
                    />
                  ) : null}
                </PlayHead>
                <ControlsConsumer>{this.renderPlayerControls}</ControlsConsumer>
              </LowerControls>
            </TappableArea>
          </SafeAreaView>
        </Background>
      </Animated.View>
    );
  };

  render() {
    return (
      <Query query={GET_CONTROL_STATE}>{this.renderFullscreenControls}</Query>
    );
  }
}

export default compose(
  withApollo,
  withThemeMixin({ type: 'dark' })
)(LiveStreamControls);
