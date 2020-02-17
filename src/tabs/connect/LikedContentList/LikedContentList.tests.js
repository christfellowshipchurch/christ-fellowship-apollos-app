import React from 'react';
import renderer from 'react-test-renderer';
import wait from 'waait';

import Providers from '../../../Providers';

import GET_LIKED_CONTENT from '../getLikedContent';
import LikedContentList from '.';

describe('LikedContentList component', () => {
  it('renders LikedContentList', async () => {
    const mock = {
      request: {
        query: GET_LIKED_CONTENT,
      },
      result: {
        data: {
          likedContent: [
            {
              __typename: 'UniversalContentItem',
              id: 'UniversalContentItem:4148aeb9482181025e9cad42826e676a',
              title: 'Making Prayer a Spiritual Habit',
              coverImage: {
                sources: [
                  {
                    uri:
                      'https://apollosrock.newspring.cc/GetImage.ashx?guid=55be1fd5-d8eb-43a6-aa70-f8e27bb63d31',
                  },
                ],
              },
              sharing: {
                title: 'Making Prayer a Spiritual Habit',
                message: '',
                url: 'https://apollosrock.newspring.cc/',
              },
            },
            {
              __typename: 'UniversalContentItem',
              id: 'UniversalContentItem:9dbdc4e565dcaa3c9b17eb5ae42de96e',
              title: 'Vacations and Your Budget',
              coverImage: {
                sources: [
                  {
                    uri:
                      'https://apollosrock.newspring.cc/GetImage.ashx?guid=993efb47-47ec-4dec-a3d3-47bcacfbd58e',
                  },
                ],
              },
              sharing: {
                title: 'Vacations and Your Budget',
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
        <LikedContentList navigation={navigation} />
      </Providers>
    );
    await wait(0); // wait for response from graphql
    expect(tree).toMatchSnapshot();
  });
});
