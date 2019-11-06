import React from 'react';
import renderer from 'react-test-renderer';

import Providers from 'ChristFellowship/src/Providers';

import GET_CONTENT_FEED from '../getContentFeed';

import { ContentFeed } from '../index';

describe('content feed query component', () => {
  it('renders a feedview after successful query', () => {
    const mock = {
      request: {
        query: GET_CONTENT_FEED,
      },
      result: {
        data: {
          node: {
            childContentItemsConnection: {
              edges: [
                {
                  node: {
                    __typename: 'UniversalContentItem',
                    id: 'UniversalContentItem:d57994350b9d213866b24dea3a97433d',
                    coverImage: null,
                    parentChannel: {
                      id: 'ContentChannel:4f68015ba18662a7409d1219a4ce013e',
                      name: 'Editorial',
                      iconName: 'text',
                    },
                    title: 'Mea Animal Aperiam Ornatus Eu',
                  },
                },
                {
                  node: {
                    __typename: 'UniversalContentItem',
                    id: 'UniversalContentItem:b36e55d803443431e96bb4b5068147ec',
                    coverImage: null,
                    parentChannel: {
                      id: 'ContentChannel:4f68015ba18662a7409d1219a4ce013e',
                      name: 'Editorial',
                      iconName: 'text',
                    },
                    title: 'Probo Senserit Id Mea, Ut Sed Malis Postea,',
                  },
                },
              ],
            },
          },
        },
      },
    };

    const navigation = {
      getParam: jest.fn(),
      navigate: jest.fn(),
    };
    const tree = renderer.create(
      <Providers mocks={[mock]}>
        <ContentFeed navigation={navigation} />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
});
