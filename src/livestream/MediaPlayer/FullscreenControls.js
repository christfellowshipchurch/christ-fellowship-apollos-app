import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {
  BackHandler,
  StyleSheet,
  Animated,
  TouchableWithoutFeedback,
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
  FlexedView,
  withTheme,
  withThemeMixin,
  styled,
  H4,
  H6,
  ButtonIcon,
} from '@apollosproject/ui-kit';

import { GET_CONTROL_STATE } from './queries';
import {
  PLAY,
  PAUSE,
  EXIT_FULLSCREEN,
  SHOW_VIDEO,
  HIDE_VIDEO,
  MUTE,
  UNMUTE,
} from './mutations';
import { ControlsConsumer } from './PlayheadState';
import Seeker from './Seeker';
import AirPlayButton from './AirPlayButton';
import GoogleCastButton from './GoogleCastButton';

const Background = withTheme(
  ({ theme }) => ({
    style: StyleSheet.absoluteFill,
    colors: [
      theme.colors.darkPrimary,
      theme.colors.transparent,
      theme.colors.darkPrimary,
    ],
    locations: [0, 0.4, 0.95],
  }),
  'ui-media.MediaPlayer.FullscreenControls.Background'
)(LinearGradient);

const UpperControls = styled(
  {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  'ui-media.MediaPlayer.FullscreenControls.UpperControls'
)(View);

const LowerControls = styled(
  {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  'ui-media.MediaPlayer.FullscreenControls.LowerControls'
)(PaddedView);

const CastButtons = styled(
  {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  'ui-media.MediaPlayer.FullscreenControls.CastButtons'
)(PaddedView);

const PlayControls = styled(
  ({ theme }) => ({
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingBottom: theme.sizing.baseUnit * 1.5,
  }),
  'ui-media.MediaPlayer.FullscreenControls.PlayControls'
)(PaddedView);

const PlayHead = styled(
  { paddingVertical: 0 },
  'ui-media.MediaPlayer.FullscreenControls.PlayHead'
)(PaddedView);

const Titles = styled(
  {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 0,
  },
  'ui-media.MediaPlayer.FullscreenControls.Titles'
)(PaddedView);

const Title = styled(
  { textAlign: 'center' },
  'ui-media.MediaPlayer.FullscreenControls.Title'
)(H4);

const Artist = styled(
  { textAlign: 'center' },
  'ui-media.MediaPlayer.FullscreenControls.Artist'
)(H6);

const IconSm = withTheme(
  ({ theme }) => ({
    size: theme.sizing.baseUnit * 1.25,
    iconPadding: theme.sizing.baseUnit * 1.25,
  }),
  'ui-media.MediaPlayer.FullscreenControls.IconSm'
)(ButtonIcon);

const IconMd = withTheme(
  ({ theme }) => ({
    size: theme.sizing.baseUnit * 1.875,
    iconPadding: theme.sizing.baseUnit * 0.9375,
  }),
  'ui-media.MediaPlayer.FullscreenControls.IconMd'
)(ButtonIcon);

const IconLg = withTheme(
  ({ theme }) => ({
    size: theme.sizing.baseUnit * 3.125,
    iconPadding: theme.sizing.baseUnit * 0.3125,
  }),
  'ui-media.MediaPlayer.FullscreenControls.IconLg'
)(ButtonIcon);

/**
 * FullscreenControls displays fading player controls
 */
class FullscreenControls extends PureComponent {
  static propTypes = {
    client: PropTypes.shape({
      mutate: PropTypes.func,
    }),
    showAudioToggleControl: PropTypes.bool,
    showVideoToggleControl: PropTypes.bool,
    airPlayEnabled: PropTypes.bool,
    googleCastEnabled: PropTypes.bool,
    isCasting: PropTypes.bool,
  };

  static defaultProps = {
    showAudioToggleControl: true,
    showVideoToggleControl: true,
    airPlayEnabled: true,
    googleCastEnabled: true,
    isCasting: false,
  };

  state = {};

  fader = new Animated.Value(1);

  controlsVisible = true;

  wasFullscreen = false;

  open = Animated.spring(this.fader, {
    toValue: 1,
    useNativeDriver: true,
  });

  close = Animated.spring(this.fader, {
    toValue: 0,
    useNativeDriver: true,
  });

  constructor(...args) {
    super(...args);
    this.fader.addListener(({ value }) => {
      this.controlsVisible = value > 0.05;
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
      (!this.animatingClosed && this.controlsVisible)
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
    <PlayControls>
      {this.props.showAudioToggleControl && !this.props.isCasting ? (
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
      {this.props.showVideoToggleControl && !this.props.isCasting ? (
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
            forceInset={{ top: 'always', bottom: 'always' }}
          >
            <UpperControls>
              <IconSm name="arrow-down" onPress={this.handleClose} />
              <Titles>
                <Title>{get(mediaPlayer, 'currentTrack.title')}</Title>
                <Artist>{get(mediaPlayer, 'currentTrack.artist')}</Artist>
              </Titles>
              <IconSm name="empty" disabled />
            </UpperControls>
            <TouchableWithoutFeedback onPress={this.handleControlVisibility}>
              <FlexedView />
            </TouchableWithoutFeedback>
            <LowerControls horizontal={false}>
              <CastButtons>
                {Platform.OS === 'ios' &&
                this.props.airPlayEnabled &&
                !this.props.isCasting ? (
                  <AirPlayButton />
                ) : null}
                {this.props.googleCastEnabled ? <GoogleCastButton /> : null}
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
)(FullscreenControls);
