import React from 'react';
import renderer from 'react-test-renderer';
import wait from 'waait';

import Providers from '../../../Providers';

import GET_LIKED_CONTENT from '../getLikedContent';
import RecentlyLikedTileFeedConnected from './RecentlyLikedTileFeedConnected';

describe('RecentlyLikedTileFeedConnected', () => {
  it('renders a RecentlyLikedTileFeedConnected', async () => {
    const mock = {
      request: {
        query: GET_LIKED_CONTENT,
      },
      result: {
        data: {
          likedContent: [
            {
              id: 'UniversalContentItem:296373ecb53580855cadffa0375ebe18',
              __typename: 'UniversalContentItem',
              title: 'Guys Night!',
              coverImage: {
                sources: [
                  {
                    uri:
                      'https://apollosrock.newspring.cc/GetImage.ashx?guid=58c037fa-cc7f-4d72-9571-a0cc0558e346',
                  },
                ],
              },
              sharing: {
                title: 'Guys Night!',
                message: '',
                url: 'https://apollosrock.newspring.cc/',
              },
            },
            {
              id: 'UniversalContentItem:39193b5ad28717ebfeab4d226664d8e7',
              __typename: 'UniversalContentItem',
              title: 'This August at NewSpring',
              coverImage: {
                sources: [
                  {
                    uri:
                      'https://apollosrock.newspring.cc/GetImage.ashx?guid=f54b0db0-95f5-44ad-b8f2-8bcd1b23cfdb',
                  },
                ],
              },
              sharing: {
                title: 'This August at NewSpring',
                message: '',
                url: 'https://apollosrock.newspring.cc/',
              },
            },
            {
              id: 'UniversalContentItem:ae8ec75906ba7437c49ad2534b5024db',
              __typename: 'UniversalContentItem',
              title: 'A Place to Worship Free of Fear',
              coverImage: {
                sources: [
                  {
                    uri:
                      'https://apollosrock.newspring.cc/GetImage.ashx?guid=a65bc45d-f961-4b7e-a899-63eb1f9b8da9',
                  },
                ],
              },
              sharing: {
                title: 'A Place to Worship Free of Fear',
                message: '',
                url: 'https://apollosrock.newspring.cc/',
              },
            },
          ],
        },
      },
    };
    const navigation = { navigate: jest.fn(), getParam: jest.fn() };
    const tree = renderer.create(
      <Providers mocks={[mock]}>
        <RecentlyLikedTileFeedConnected navigation={navigation} />
      </Providers>
    );
    await wait(0); // wait for response from graphql
    expect(tree).toMatchSnapshot();
  });

  it('renders nothing if no liked content', async () => {
    const mock = {
      request: {
        query: GET_LIKED_CONTENT,
      },
      result: {
        data: {
          likedContent: [],
        },
      },
    };
    const navigation = { navigate: jest.fn(), getParam: jest.fn() };
    const tree = renderer.create(
      <Providers mocks={[mock]}>
        <RecentlyLikedTileFeedConnected navigation={navigation} />
      </Providers>
    );
    await wait(0); // wait for response from graphql
    expect(tree).toMatchSnapshot();
  });
});
