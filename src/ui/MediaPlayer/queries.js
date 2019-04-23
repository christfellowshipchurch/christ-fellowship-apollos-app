import gql from 'graphql-tag';

const getMediaPlayerVisibility = gql`
  query mediaPlayerVisibility {
    mediaPlayer @client {
      isVisible
    }
  }
`;

const getMediaPlayerIsPlaying = gql`
  query mediaPlayerVisibility {
    mediaPlayer @client {
      isPlaying
    }
  }
`;

const getFullVisibilityState = gql`
  query fullVisibilityState {
    mediaPlayer @client {
      currentTrack {
        isVideo
      }
      isVisible
      isFullscreen
    }
  }
`;

const getControlState = gql`
  query {
    mediaPlayer @client {
      isFullscreen
      isPlaying
      currentTrack {
        id
        title
        artist
        isVideo
      }
      showVideo
      muted
    }
  }
`;

const getVideoState = gql`
  query mediaPlayer {
    mediaPlayer @client {
      currentTrack {
        mediaSource {
          uri
        }
        posterSources {
          uri
        }
        id
        isVideo
      }
      currentTime
      isPlaying
      showVideo
      muted
    }
  }
`;

const getMusicControlState = gql`
  query musicControlState {
    mediaPlayer @client {
      currentTrack {
        posterSources {
          uri
        }
        title
        artist
      }
      currentTime
      isPlaying
    }
  }
`;

const getElapsedTime = gql`
  query {
    mediaPlayer @client {
      progress {
        currentTime
      }
    }
  }
`;

const getProgress = gql`
  query {
    mediaPlayer @client {
      progress {
        currentTime
        duration
      }
    }
  }
`;

const getTotalTime = gql`
  query {
    mediaPlayer @client {
      progress {
        duration
      }
    }
  }
`;

export {
  getMediaPlayerIsPlaying,
  getMediaPlayerVisibility,
  getMusicControlState,
  getFullVisibilityState,
  getControlState,
  getVideoState,
  getElapsedTime,
  getProgress,
  getTotalTime,
};
