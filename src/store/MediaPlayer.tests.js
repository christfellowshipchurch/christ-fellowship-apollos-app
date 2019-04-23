import { client } from 'ChristFellowship/src/client';
import gql from 'graphql-tag';

import { resolvers, defaults } from '.';

const query = gql`
  query {
    mediaPlayer @client {
      currentTrack {
        mediaSourceUri
        posterSourceUri
        title
        artist
      }
      isPlaying
      isFullscreen
      isVisible
    }
  }
`;

const testTrack = {
  parentId: 'parentId',
  mediaSourceUri: 'mediaSourceUri',
  posterSourceUri: 'posterSourceUri',
  title: 'title',
  artist: 'artist',
};

describe('MediaPlayer Store', () => {
  beforeEach(() => {
    client.writeData({ data: defaults });
  });

  it('plays a track', async () => {
    resolvers.Mutation.mediaPlayerPlayNow({}, testTrack, {
      cache: client.cache,
      client,
    });
    expect(client.query({ query })).resolves.toMatchSnapshot();
  });
  it('updates player state', async () => {
    resolvers.Mutation.mediaPlayerPlayNow({}, testTrack, {
      cache: client.cache,
      client,
    });
    expect(client.query({ query })).resolves.toMatchSnapshot();
    resolvers.Mutation.mediaPlayerUpdateState(
      {},
      { isPlaying: false },
      { cache: client.cache, client }
    );
    expect(client.query({ query })).resolves.toMatchSnapshot();
    resolvers.Mutation.mediaPlayerUpdateState(
      {},
      { isPlaying: true },
      { cache: client.cache, client }
    );
  });
});
