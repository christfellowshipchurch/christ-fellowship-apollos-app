import React from 'react';
import { Animated, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import GoogleCast from 'react-native-google-cast';
import { Query } from 'react-apollo';
import { PLAY, PAUSE, CAST_CONNECTED, CAST_DISCONNECTED } from './mutations';
import { GET_CAST_INFO } from './queries';
import { ControlsConsumer } from './PlayheadState';

const styles = StyleSheet.create({
  animatedPosterImage: {
    ...StyleSheet.absoluteFillObject,
    resizeMode: 'cover',
  },
});

class Controller extends React.Component {
  static propTypes = {
    client: PropTypes.shape({
      mutate: PropTypes.func,
    }),
    playerPositionAnimation: PropTypes.shape({ stopAnimation: PropTypes.func }),
    media: PropTypes.shape({
      currentTrack: PropTypes.shape({
        mediaSource: PropTypes.shape({ uri: PropTypes.string }),
        posterSources: PropTypes.arrayOf(
          PropTypes.shape({ uri: PropTypes.string })
        ),
        title: PropTypes.string,
        artist: PropTypes.string,
      }),
      isCasting: PropTypes.bool,
    }),
    onLoad: PropTypes.func,
    onProgress: PropTypes.func,
    skipTo: PropTypes.func,
  };

  componentDidMount() {
    // get Google Cast state on mount
    GoogleCast.getCastState().then((state) => {
      if (state === 'Connected') {
        this.props.client.mutate({ mutation: CAST_CONNECTED });
        this.props.onLoad({ duration: 0 });
      }
    });

    // Google Cast Connection established
    GoogleCast.EventEmitter.addListener(GoogleCast.SESSION_STARTED, () => {
      const { playerPositionAnimation, media, client } = this.props;
      playerPositionAnimation.stopAnimation((value) => {
        GoogleCast.castMedia({
          mediaUrl: get(media, 'currentTrack.mediaSource.uri', ''),
          imageUrl: get(media, 'currentTrack.posterSources[0].uri', ''),
          title: get(media, 'currentTrack.title', ''),
          subtitle: get(media, 'currentTrack.artist', ''),
          // TODO, get this information from API
          // studio: 'Apollos Church',
          // streamDuration: 596,
          // contentType: 'video/mp4', // Optional, default is "video/mp4"
          playPosition: value,
        });
      });
      client.mutate({ mutation: CAST_CONNECTED });
      // client.mutate({ mutation: PLAY });
    });

    // Google Cast Disconnected (error provides explanation if ended forcefully)
    GoogleCast.EventEmitter.addListener(GoogleCast.SESSION_ENDED, () => {
      // this.props.client.mutate({ mutation: PAUSE });
      this.props.client.mutate({ mutation: CAST_DISCONNECTED });
    });

    // Google Cast media status update
    GoogleCast.EventEmitter.addListener(
      GoogleCast.MEDIA_STATUS_UPDATED,
      ({ mediaStatus }) => {
        // update seeker head
        // NOTE: only updates on a 10 sec interval
        this.props.onProgress({
          currentTime: mediaStatus.streamPosition,
          playableDuration: mediaStatus.streamDuration,
          seekableDuration: mediaStatus.streamDuration,
        });
        this.props.skipTo(mediaStatus.streamPosition);

        // NOTE: need to investigate if this is happening too often
        // may just need to check if player is already playing before hitting play again
        //
        // I'm sure the library has these as constants but I couldn't find
        // them in the documentation
        if (mediaStatus.playerState === 2)
          this.props.client.mutate({ mutation: PLAY });
        if (mediaStatus.playerState === 3)
          this.props.client.mutate({ mutation: PAUSE });
      }
    );
  }

  render() {
    return this.props.media.isCasting ? (
      <Animated.Image
        key="poster"
        style={[styles.animatedPosterImage]}
        source={get(this.props.media, 'currentTrack.posterSources', [])}
      />
    ) : null;
  }
}

const ControllerWithData = ({ ...props }) => (
  <Query query={GET_CAST_INFO}>
    {({ data: { mediaPlayer = {} } = {} }) => (
      <ControlsConsumer>
        {({ ...controls }) => (
          <Controller {...props} media={mediaPlayer} {...controls} />
        )}
      </ControlsConsumer>
    )}
  </Query>
);

export default ControllerWithData;
