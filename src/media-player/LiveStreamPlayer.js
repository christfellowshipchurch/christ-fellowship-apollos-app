import React, { PureComponent } from 'react';
import {
  Animated,
  Easing,
  View,
  StyleSheet,
  Dimensions,
  PanResponder,
  Platform,
  StatusBar,
  TouchableHighlight,
  TouchableOpacity,
} from 'react-native';
import PropTypes from 'prop-types';
import { Query } from '@apollo/client/react/components';
import { withApollo } from '@apollo/client/react/hoc';
import { get } from 'lodash';

import { SafeAreaView } from 'react-native-safe-area-context';
import {
  styled,
  withTheme,
  H5,
  Icon,
  NavigationService,
  LayoutConsumer,
  BodyText,
} from '@apollosproject/ui-kit';

import { PlayerContext } from '../chat/context';
import LiveStreamChat from './LiveStreamChat';
import MiniControls, { MINI_PLAYER_HEIGHT } from './controls/MiniControls';
import LiveStreamControls from './controls/LiveStreamControls';
import VideoWindow from './controls/VideoWindow';
import MusicControls from './controls/MusicControls';
import { GET_FULL_VISIBILITY_STATE } from './queries';
import { EXIT_FULLSCREEN, GO_FULLSCREEN, JOIN_LIVESTREAM } from './mutations';
import {
  Provider,
  ControlsConsumer,
  PlayheadConsumer,
} from './controls/PlayheadState';
import MediaPlayerSafeLayout from './controls/MediaPlayerSafeLayout';
import GoogleCastController from './controls/GoogleCastController';

const MessagesBannerContainer = styled(({ theme }) => ({
  flex: 1,
  backgroundColor: theme.colors.primary,
}))(SafeAreaView);

const BANNER_HEIGHT = 35;

const MessagesBanner = styled(({ theme }) => ({
  height: BANNER_HEIGHT,
  width: '100%',
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingHorizontal: theme.sizing.baseUnit,
}))(TouchableOpacity);

const MessagesBannerText = styled(({ theme }) => ({
  color: theme.colors.background.paper,
}))(H5);

const MessagesIcon = withTheme(({ theme }) => ({
  name: 'message-bubble',
  size: 18,
  fill: theme.colors.background.paper,
  style: {
    marginRight: theme.sizing.baseUnit / 2,
  },
}))(Icon);

const FlexHorizontal = styled({
  flexDirection: 'row',
  alignItems: 'center',
})(View);

const RightArrow = withTheme(({ theme }) => ({
  name: 'arrow-next',
  size: 18,
  fill: theme.colors.background.paper,
}))(Icon);

const Dot = styled(({ theme }) => ({
  aspectRatio: 1,
  backgroundColor: theme.colors.alert,
  borderColor: theme.colors.primary,
  borderWidth: 0,
  borderRadius: 14,
  marginTop: -5,
  marginRight: 8,
  position: 'absolute',
  right: 0,
  top: 0,
  width: 14,
}))(View);

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
        }
)(View);

const LiveStreamContainer = styled(
  ({ isFullscreen, isPortrait, theme }) =>
    isFullscreen
      ? {
          height: isPortrait ? '33%' : '100%',
          ...Platform.select(theme.shadows.default),
        }
      : StyleSheet.absoluteFill
)(Animated.View);

const FullscreenMediaPlayerSafeLayout = styled(({ isFullscreen, theme }) => ({
  ...StyleSheet.absoluteFillObject,
  margin: isFullscreen ? 0 : theme.sizing.baseUnit,
}))(MediaPlayerSafeLayout);

const TappableArea = withTheme(({ theme }) => ({
  style: {
    backgroundColor: theme.colors.background.paper,
    borderBottomColor: theme.colors.text.tertiary,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  underlayColor: theme.colors.background.screen,
}))(TouchableHighlight);

const TappableView = styled(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'flex-end',
  alignItems: 'center',
  paddingTop: theme.sizing.baseUnit / 2,
  paddingRight: theme.sizing.baseUnit,
  paddingBottom: theme.sizing.baseUnit / 2,
}))(View);

const CloseChatIcon = withTheme(({ theme }) => ({
  name: 'arrow-next',
  fill: theme.colors.text.lightPrimary,
  size: theme.helpers.rem(1),
}))(Icon);

/**
 * LiveStreamPlayer is a animating media player that transitions between
 * a mini state and a full screen state.
 * It is capable of playing any type of media that react-native-video supports.
 * It reads from local graphql state, and so you must use graphql mutations to play tracks.
 */
class LiveStreamPlayer extends PureComponent {
  // eslint-disable-next-line react/sort-comp
  static propTypes = {
    client: PropTypes.shape({ mutate: PropTypes.func }),
    channelId: PropTypes.string,
    channelType: PropTypes.string,
    event: PropTypes.shape({
      parentId: PropTypes.string,
      name: PropTypes.string,
      startsAt: PropTypes.string,
      endsAt: PropTypes.string,
    }),
    isLoading: PropTypes.bool,
  };

  state = {
    portrait: Dimensions.get('window').height > Dimensions.get('window').width,
    channels: [],
    showChat: false,
  };

  // Tracks the messages banner height
  bannerHeight = new Animated.Value(0);

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

  componentDidMount() {
    Dimensions.addEventListener('change', this.handleOrientationChanged);
    this.props.client.mutate({
      mutation: JOIN_LIVESTREAM,
      variables: { nodeId: this.props.event.parentId },
    });
  }

  componentDidUpdate(_, oldState) {
    if (this.state.channels.length && !oldState.channels.length) {
      Animated.timing(this.bannerHeight, {
        toValue: 1,
        duration: 250,
        ease: Easing.inOut(Easing.ease),
        // useNativeDriver: true,
      }).start();
    }
  }

  componentWillUnmount() {
    Dimensions.removeEventListener('change', this.handleOrientationChanged);
  }

  chatAnimation = ({ showChat }) => {
    if (showChat)
      return {
        ...StyleSheet.absoluteFill,
        left: '50%',
        right: '0%',
        zIndex: 2,
        elevation: 50,
      };
    return {
      display: 'none',
    };
  };

  handleOrientationChanged = ({ screen: { width, height } }) => {
    this.setState({ portrait: height > width });
  };

  handleChannelsUpdated = ({ channels }) => {
    this.setState({ channels });
  };

  handleShowChat = () => {
    this.setState((prevState) => ({
      showChat: !prevState.showChat,
    }));
  };

  handleDirectMessage = ({ user }) => {
    this.props.client.mutate({ mutation: EXIT_FULLSCREEN });
    const { id, name } = user;

    setTimeout(() => {
      NavigationService.navigate('ChatChannel', {
        userId: id,
        channelType: 'messaging',
        name,
        nested: true,
      });
    }, 250);
  };

  renderMessagesBanner = ({ isFullscreen }) => {
    if (!isFullscreen) return null;
    if (!this.state.portrait) return null;

    return (
      <LayoutConsumer>
        {({ top: notch }) => (
          <Animated.View
            style={{
              height: this.bannerHeight.interpolate({
                inputRange: [0, 1],
                outputRange: [0, notch + BANNER_HEIGHT],
              }),
              transform: [
                {
                  translateY: this.bannerHeight.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-notch - BANNER_HEIGHT, 0],
                  }),
                },
              ],
            }}
          >
            <MessagesBannerContainer
              key="banner"
              {...(Platform.OS !== 'android' && isFullscreen
                ? this.panResponder.panHandlers
                : {})}
            >
              <MessagesBanner
                activeOpacity={0.5}
                onPress={() => {
                  this.props.client.mutate({ mutation: EXIT_FULLSCREEN });
                  setTimeout(() => {
                    NavigationService.navigate('ChatChannelsList', {
                      nested: true,
                    });
                  }, 250);
                }}
              >
                <React.Fragment>
                  <FlexHorizontal>
                    <MessagesIcon />
                    <MessagesBannerText>
                      {`You’re involved in ${
                        this.state.channels.length
                      } conversation${
                        this.state.channels.length === 1 ? '' : 's'
                      }.`}
                    </MessagesBannerText>
                  </FlexHorizontal>
                  <FlexHorizontal>
                    <MessagesBannerText>{'VIEW'}</MessagesBannerText>
                    <RightArrow />
                    {this.state.channels.find(
                      (c) => !c.disconnected && !!c.countUnread()
                    ) ? (
                      <Dot />
                    ) : null}
                  </FlexHorizontal>
                </React.Fragment>
              </MessagesBanner>
            </MessagesBannerContainer>
          </Animated.View>
        )}
      </LayoutConsumer>
    );
  };

  renderLiveStream = ({ mediaPlayer }) => {
    const { isFullscreen = false, isCasting = false } = mediaPlayer;
    return (
      <LiveStreamContainer
        key="cover"
        onLayout={this.handleCoverLayout}
        isFullscreen={isFullscreen}
        isPortrait={this.state.portrait}
        {...(Platform.OS !== 'android' && isFullscreen
          ? this.panResponder.panHandlers
          : {})}
      >
        <PlayheadConsumer>
          {({ currentTime }) => (
            <GoogleCastController
              client={this.props.client}
              playerPositionAnimation={currentTime}
            />
          )}
        </PlayheadConsumer>
        {!isCasting ? (
          <VideoSizer
            isFullscreen={isFullscreen}
            isVideo={get(mediaPlayer, 'currentTrack.isVideo')}
          >
            <ControlsConsumer>
              {(controlHandlers) => <VideoWindow {...controlHandlers} />}
            </ControlsConsumer>
          </VideoSizer>
        ) : null}
        <Animated.View style={this.fullscreenControlsAnimation}>
          <LiveStreamControls
            isCasting={isCasting}
            isPortrait={this.state.portrait}
            onShowChat={this.handleShowChat}
          />
        </Animated.View>
      </LiveStreamContainer>
    );
  };

  renderChat = ({ isFullscreen }) => {
    if (!this.props.channelId || !this.props.channelType) {
      return null;
    }

    const playerContext = {
      onChannelsUpdated: this.handleChannelsUpdated,
      onDirectMessage: this.handleDirectMessage,
    };

    return (
      <PlayerContext.Provider key={'chat'} value={playerContext}>
        {this.state.portrait &&
          isFullscreen && (
            <LiveStreamChat
              isPortrait={this.state.portrait}
              channelId={this.props.channelId}
              channelType={this.props.channelType}
              event={this.props.event}
            />
          )}
        {!this.state.portrait &&
          isFullscreen && (
            <Animated.View
              style={this.chatAnimation({
                isFullscreen,
                isPortrait: this.state.portrait,
                showChat: this.state.showChat,
              })}
            >
              <TappableArea onPress={this.handleShowChat}>
                <TappableView>
                  <BodyText>Hide Chat</BodyText>
                  <CloseChatIcon name={'arrow-next'} size={18} />
                </TappableView>
              </TappableArea>
              <LiveStreamChat
                isPortrait={this.state.portrait}
                channelId={this.props.channelId}
                channelType={this.props.channelType}
                event={this.props.event}
              />
            </Animated.View>
          )}
      </PlayerContext.Provider>
    );
  };

  renderCover = ({ data: { mediaPlayer = {} } = {} }) => {
    const { isFullscreen = false } = mediaPlayer;
    Animated.spring(this.fullscreen, {
      toValue: isFullscreen ? 1 : 0,
      useNativeDriver: true,
      bounciness: 4,
    }).start();

    const coverFlow = [
      this.renderMessagesBanner({ isFullscreen }),
      this.renderLiveStream({ mediaPlayer }),
      this.renderChat({ isFullscreen }),
      <MusicControls key={'music-controls'} />,
    ];

    if (!isFullscreen) {
      coverFlow.push(
        <Animated.View
          key="mini-controls"
          style={this.miniControlsAnimation}
          onLayout={this.handleMiniControlLayout}
        >
          <MiniControls nodeId={this.props.event.parentId} isLiveStream />
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

const LiveStreamPlayerWithData = withApollo(LiveStreamPlayer);

export { LiveStreamPlayerWithData as default };
