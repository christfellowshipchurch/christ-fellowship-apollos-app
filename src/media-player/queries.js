import gql from 'graphql-tag';

const GET_MEDIA_PLAYER_VISIBILITY = gql`
  query mediaPlayerVisibility {
    mediaPlayer @client {
      isVisible
    }
  }
`;

const GET_MEDIA_PLAYER_IS_PLAYING = gql`
  query mediaPlayerVisibility {
    mediaPlayer @client {
      isPlaying
    }
  }
`;

const GET_FULL_VISIBILITY_STATE = gql`
  query fullVisibilityState {
    mediaPlayer @client {
      currentTrack {
        isVideo
      }
      isVisible
      isFullscreen
      isCasting
    }
  }
`;

const GET_CONTROL_STATE = gql`
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

const GET_VIDEO_STATE = gql`
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

const GET_MUSIC_CONTROL_STATE = gql`
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

const GET_ELAPSED_TIME = gql`
  query {
    mediaPlayer @client {
      progress {
        currentTime
      }
    }
  }
`;

const GET_PROGRESS = gql`
  query {
    mediaPlayer @client {
      progress {
        currentTime
        duration
      }
    }
  }
`;

const GET_TOTAL_TIME = gql`
  query {
    mediaPlayer @client {
      progress {
        duration
      }
    }
  }
`;

const GET_CAST_INFO = gql`
  query {
    mediaPlayer @client {
      currentTrack {
        mediaSource {
          uri
        }
        posterSources {
          uri
        }
        title
        artist
      }
      isCasting
    }
  }
`;

export {
  GET_MEDIA_PLAYER_IS_PLAYING,
  GET_MEDIA_PLAYER_VISIBILITY,
  GET_MUSIC_CONTROL_STATE,
  GET_FULL_VISIBILITY_STATE,
  GET_CONTROL_STATE,
  GET_VIDEO_STATE,
  GET_ELAPSED_TIME,
  GET_PROGRESS,
  GET_TOTAL_TIME,
  GET_CAST_INFO,
};
