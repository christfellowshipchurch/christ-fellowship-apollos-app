import React, { PureComponent } from 'react';
import { PanResponder, Animated, View, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import GoogleCast from 'react-native-google-cast';

import { styled, withTheme } from '@apollosproject/ui-kit';

import { PlayheadConsumer, ControlsConsumer } from '../PlayheadState';
import Timestamp from './Timestamp';

const Container = styled(
  {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  'ui-media.MediaPlayer.Seeker.Container'
)(View);

const TrackContainer = styled(
  ({ minimal, knobSize }) => ({
    height: knobSize / 2,
    flexGrow: 1,
    justifyContent: 'center',
    paddingTop: minimal ? 20 : knobSize / 2,
    paddingBottom: minimal ? 0 : knobSize / 2,
  }),
  'ui-media.MediaPlayer.Seeker.TrackContainer'
)(View);

const Track = styled(
  ({ theme, minimal, knobSize }) => ({
    height: knobSize / 2,
    overflow: 'hidden',
    borderRadius: minimal ? 0 : knobSize / 2,
    backgroundColor: minimal
      ? theme.colors.transparent
      : theme.colors.darkSecondary,
  }),
  'ui-media.MediaPlayer.Seeker.Track'
)(View);

const ProgressBar = styled(
  ({ theme }) => ({
    height: theme.sizing.baseUnit,
    backgroundColor: theme.colors.secondary,
  }),
  'ui-media.MediaPlayer.Seeker.ProgressBar'
)(View);

const Knob = styled(
  ({ theme, knobSize }) => ({
    height: knobSize,
    width: knobSize,
    position: 'absolute',
    right: 0,
    elevation: 2,
    borderRadius: knobSize,
    backgroundColor: theme.colors.text.primary,
  }),
  'ui-media.MediaPlayer.Seeker.Knob'
)(View);

/**
 * Animated Seeker component.
 * Depends on `PlayheadState`, so you don't pass it any props directly,
 * but must be rendered within a `<MediaPlayer/>` component
 */
class Seeker extends PureComponent {
  static propTypes = {
    minimal: PropTypes.bool, // The only prop you need to pass - switches to a minimal version (line instead of bar)
    currentTime: PropTypes.any, // eslint-disable-line
    duration: PropTypes.any, // eslint-disable-line
    style: PropTypes.any, // eslint-disable-line
    onScrubbing: PropTypes.func,
    skip: PropTypes.func,
    knobSize: PropTypes.number, // defaults to theme.sizing.baseBorderRadius * 0.75 (12px, see line 210)
    isCasting: PropTypes.bool,
  };

  isSeeking = false;

  timeAtSeekingStart = 0;

  state = {
    width: 0, // the width of the seeker bar
  };

  offsetDriver = new Animated.Value(0); // Used to track pixel offset when seeking

  offsetTimeDriver = new Animated.Value(0); // Used to track time offset when seeking

  panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderGrant: () => {
      // Using `stopAnimation` only to get the currentTime value
      this.props.currentTime.stopAnimation((value) => {
        this.isSeeking = true;
        this.timeAtSeekingStart = value;
      });
    },
    onPanResponderMove: (e, { dx }) => {
      // Calculate the pixel offset and apply it to the offsetDriver
      let offset = dx;
      const progressAtStart = this.timeAtSeekingStart / this.props.duration;
      const positionAtStart = progressAtStart * this.state.width;
      offset = Math.min(this.state.width - positionAtStart, offset);
      offset = Math.max(-positionAtStart, offset);
      this.offsetDriver.setValue(offset);

      // Calculate the time offset and apply it to the offsetTimeDriver
      const moveAmount = offset / this.state.width;
      const moveAmountInTime = moveAmount * this.props.duration;
      this.offsetTimeDriver.setValue(moveAmountInTime);

      if (this.props.onScrubbing) this.props.onScrubbing({ isScrubbing: true });
    },
    onPanResponderRelease: async (e, { dx }) => {
      // Calculate the amount in time we've moved, and skip that duration
      const moveAmount = dx / this.state.width;
      const moveAmountInTime = moveAmount * this.props.duration;
      await this.props.skip(moveAmountInTime);

      if (this.props.isCasting)
        GoogleCast.seek(this.timeAtSeekingStart + moveAmountInTime);

      // Reset state
      this.offsetDriver.setValue(0);
      this.offsetTimeDriver.setValue(0);
      this.isSeeking = false;
      this.timeAtSeekingStart = 0;

      if (this.props.onScrubbing)
        this.props.onScrubbing({ isScrubbing: false });
    },
  });

  // Calculate the real offset position of the colored track bar
  // To be able to useNativeDriver, the trackbar is always the full-width, and we animate its X position
  get trackBarOffset() {
    const progress = Animated.divide(
      this.isSeeking ? this.timeAtSeekingStart : this.props.currentTime,
      this.props.duration
    );

    const progressInvert = Animated.subtract(1, progress);
    const widthInvert = Animated.multiply(-1, this.state.width);
    const position = Animated.multiply(progressInvert, widthInvert);
    return Animated.add(position, this.offsetDriver);
  }

  // the "knob" is on top of the trackbar, the piece of UI you can grab and move around
  get knobStyles() {
    return [
      StyleSheet.absoluteFill,
      {
        transform: [{ translateX: this.trackBarOffset }],
      },
    ];
  }

  handleOnLayout = ({
    nativeEvent: {
      layout: { width },
    },
  }) =>
    this.setState({
      /*
       * Adjust offset width to adjust for knobSize so Knob always appears on the track. Knob is
       * hidden when in a minimal state (miniplayer) we only make this adjustment when necessary.
       */
      width: this.props.minimal ? width : width - this.props.knobSize,
    });

  renderProgress = () => (
    <Animated.View
      style={[
        StyleSheet.absoluteFill,
        {
          transform: [{ translateX: this.trackBarOffset }],
        },
      ]}
    >
      <ProgressBar />
    </Animated.View>
  );

  render() {
    return (
      <Container style={this.props.style}>
        {!this.props.minimal ? (
          <Timestamp
            time={this.props.currentTime}
            offset={this.offsetTimeDriver}
          />
        ) : null}
        <TrackContainer
          minimal={this.props.minimal}
          knobSize={this.props.knobSize}
        >
          <Track
            onLayout={this.handleOnLayout}
            minimal={this.props.minimal}
            knobSize={this.props.knobSize}
          >
            {this.renderProgress()}
          </Track>
          <Animated.View style={this.knobStyles}>
            {!this.props.minimal ? (
              <Knob
                knobSize={this.props.knobSize}
                {...this.panResponder.panHandlers}
              />
            ) : null}
          </Animated.View>
        </TrackContainer>
        {!this.props.minimal ? <Timestamp time={this.props.duration} /> : null}
      </Container>
    );
  }
}

const SeekerWithState = withTheme(
  ({
    theme: {
      sizing: { baseBorderRadius },
    },
  }) => ({
    knobSize: Math.floor(baseBorderRadius * 0.75),
  }),
  'ui-media.MediaPlayer.Seeker.SeekerWithState'
)((props) => (
  <ControlsConsumer>
    {(controls) => (
      <PlayheadConsumer>
        {(playhead) => <Seeker {...props} {...playhead} {...controls} />}
      </PlayheadConsumer>
    )}
  </ControlsConsumer>
));

export default SeekerWithState;
