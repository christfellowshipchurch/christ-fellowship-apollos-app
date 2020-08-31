import gql from 'graphql-tag';

const PLAY_VIDEO = gql`
  mutation playVideo(
    $mediaSource: String!
    $posterSources: String
    $title: String
    $artist: String
    $isVideo: Boolean
  ) {
    mediaPlayerPlayNow(
      mediaSource: $mediaSource
      posterSources: $posterSources
      title: $title
      artist: $artist
      isVideo: $isVideo
    ) @client
  }
`;

const GO_FULLSCREEN = gql`
  mutation {
    mediaPlayerUpdateState(isFullscreen: true) @client
  }
`;

const PLAY = gql`
  mutation {
    mediaPlayerUpdateState(isPlaying: true) @client
  }
`;

const PAUSE = gql`
  mutation {
    mediaPlayerUpdateState(isPlaying: false) @client
  }
`;

const DISMISS = gql`
  mutation {
    mediaPlayerUpdateState(isPlaying: false, isVisible: false) @client
  }
`;

const PAUSE_AND_RESTART = gql`
  mutation pause {
    mediaPlayerUpdateState(isPlaying: false) @client
    mediaPlayerSetPlayhead(currentTime: 0) @client
  }
`;

const EXIT_FULLSCREEN = gql`
  mutation {
    mediaPlayerUpdateState(isFullscreen: false) @client
  }
`;

const MUTE = gql`
  mutation {
    mediaPlayerUpdateState(muted: true) @client
  }
`;

const UNMUTE = gql`
  mutation {
    mediaPlayerUpdateState(muted: false) @client
  }
`;

const SHOW_VIDEO = gql`
  mutation {
    mediaPlayerUpdateState(showVideo: true) @client
  }
`;

const HIDE_VIDEO = gql`
  mutation {
    mediaPlayerUpdateState(showVideo: false) @client
  }
`;

const CAST_CONNECTED = gql`
  mutation {
    mediaPlayerUpdateState(isCasting: true) @client
  }
`;

const CAST_DISCONNECTED = gql`
  mutation {
    mediaPlayerUpdateState(isCasting: false) @client
  }
`;

const UPDATE_PLAYHEAD = gql`
  mutation mediaPlayerSetPlayhead($currentTime: Float) {
    mediaPlayerSetPlayhead(currentTime: $currentTime) @client
  }
`;

export {
  PAUSE_AND_RESTART,
  PLAY_VIDEO,
  GO_FULLSCREEN,
  PLAY,
  PAUSE,
  DISMISS,
  EXIT_FULLSCREEN,
  UPDATE_PLAYHEAD,
  MUTE,
  UNMUTE,
  SHOW_VIDEO,
  HIDE_VIDEO,
  CAST_CONNECTED,
  CAST_DISCONNECTED,
};
