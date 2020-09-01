import React, { PureComponent } from 'react';
import { Animated } from 'react-native';
import PropTypes from 'prop-types';

import { H6, styled } from '@apollosproject/ui-kit';

const TimeText = styled(
  {
    width: 50,
    textAlign: 'center',
    alignItems: 'center',
  },
  'ui-media.MediaPlayer.Seeker.Timestamp.TimeText'
)(H6);

/**
 * Displays a MM:SS formatted timestamp from either a number or Animate.Value in seconds
 */
class Timestamp extends PureComponent {
  static propTypes = {
    time: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.instanceOf(Animated.Value),
    ]),
    offset: PropTypes.instanceOf(Animated.Value),
  };

  state = {
    time: 0,
    offset: 0,
  };

  constructor(props) {
    super(props);
    if (typeof props.time === 'number') {
      this.state.time = props.time;
    } else {
      this.listen(props);
    }
  }

  componentWillUpdate(newProps) {
    if (
      newProps.time !== this.props.time ||
      newProps.offset !== this.props.offset
    ) {
      this.listen(newProps);
    }
  }

  listen = ({ time = 0, offset = 0 }) => {
    if (this.listener) this.props.time.removeListener(this.listener);
    if (this.offsetListener) {
      this.props.offset.removeListener(this.offsetListener);
    }

    if (!time.addListener) {
      this.setState({ time });
    } else {
      this.listener = time.addListener(({ value }) =>
        this.setState({ time: value })
      );
    }

    if (!offset.addListener) {
      this.setState({ offset });
    } else if (offset) {
      this.offsetListener = offset.addListener(({ value }) =>
        this.setState({ offset: value })
      );
    }
  };

  timestamp = (time) => {
    // Hours, minutes and seconds
    const hrs = Math.floor(time / 3600);
    const mins = Math.floor((time % 3600) / 60);
    const secs = time % 60;

    let timestamp = '';

    if (hrs > 0) {
      timestamp += `${hrs}:${mins < 10 ? '0' : ''}`;
    }

    timestamp += `${mins}:${secs < 10 ? '0' : ''}`;
    timestamp += `${Math.round(secs)}`;
    return timestamp;
  };

  render() {
    return (
      <TimeText>{this.timestamp(this.state.time + this.state.offset)}</TimeText>
    );
  }
}

export default Timestamp;
