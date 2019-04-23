import React from 'react';
import { SafeAreaView } from 'react-native';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import { get } from 'lodash';

import { styled } from '@apollosproject/ui-kit';
import { MINI_PLAYER_HEIGHT } from 'ChristFellowship/src/ui/MediaPlayer';

import MediaPlayerSafeLayout from './MediaPlayerSafeLayout';

const mediaPlayerIsVisibleQuery = gql`
  query {
    mediaPlayer @client {
      isVisible
    }
  }
`;

const MediaPlayerSafeLayoutWithSpacing = styled({
  paddingBottom: MINI_PLAYER_HEIGHT,
})(MediaPlayerSafeLayout);

const MediaPlayerSpacer = (props) => (
  <Query query={mediaPlayerIsVisibleQuery}>
    {({ data = {} }) =>
      get(data, 'mediaPlayer.isVisible') ? (
        <MediaPlayerSafeLayoutWithSpacing {...props} />
      ) : (
        <SafeAreaView {...props} />
      )
    }
  </Query>
);

export default MediaPlayerSpacer;
