import React from 'react';
import renderer from 'react-test-renderer';

import Providers from 'ChristFellowship/src/Providers';

import Home from '../Home';
import GET_FEED_FEATURES from '../getFeedFeatures';

describe('User Home Feed Query', () => {
  it('should return correct query results', () => {
    const mock = {
      request: {
        query: GET_FEED_FEATURES,
      },
      result: {
        data: {
          userFeedFeatures: [
            {
              id: 'ActionListFeature:20bbfca821fc1fd2b67dffc95914351b',
              title: 'GLOBAL ITEM',
              subtitle: null,
              actions: [
                {
                  id: 'ActionListAction:3193db264c981ad7ac695388441b1e1a',
                  title: 'First',
                  subtitle: 'Global Items List',
                  action: 'READ_GLOBAL_CONTENT',
                  image: null,
                  relatedNode: {
                    id: 'UniversalContentItem:20bbfca821fc1fd2b67dffc95914351b',
                    __typename: 'UniversalContentItem',
                  },
                  __typename: 'ActionListAction',
                },
              ],
              __typename: 'ActionListFeature',
            },
            {
              id: 'ActionListFeature:f45ce4abdb02752a5b8939c013beaec1',
              title: 'Featured Events',
              subtitle: null,
              actions: [
                {
                  id: 'ActionListAction:737c0fb68169e8184e5bb61934e585ff',
                  title: 'Holy Land Tour',
                  subtitle: null,
                  action: 'READ_EVENT',
                  image: null,
                  relatedNode: {
                    id: 'EventContentItem:051a779ce5c61710dc6c43845e2b190c',
                    __typename: 'EventContentItem',
                  },
                  __typename: 'ActionListAction',
                },
                {
                  id: 'ActionListAction:b6def191d482d95b31abe0922eedce7b',
                  title: 'Baptism Weekend',
                  subtitle: null,
                  action: 'READ_EVENT',
                  image: null,
                  relatedNode: {
                    id: 'EventContentItem:569c5cbfe8d109f8d7db5f9dd9fa6ee6',
                    __typename: 'EventContentItem',
                  },
                  __typename: 'ActionListAction',
                },
                {
                  id: 'ActionListAction:71a356599232429727470b8465e0b973',
                  title: 'Infuse',
                  subtitle: null,
                  action: 'READ_EVENT',
                  image: null,
                  relatedNode: {
                    id: 'EventContentItem:6a985259f56ef58ef774e704563bb4ff',
                    __typename: 'EventContentItem',
                  },
                  __typename: 'ActionListAction',
                },
                {
                  id: 'ActionListAction:21fa7a11225b0ca60169979d97b22277',
                  title: 'Vision Weekend',
                  subtitle: null,
                  action: 'READ_EVENT',
                  image: null,
                  relatedNode: {
                    id: 'EventContentItem:7599c1977d3e517b75adeebc411d51ed',
                    __typename: 'EventContentItem',
                  },
                  __typename: 'ActionListAction',
                },
              ],
              __typename: 'ActionListFeature',
            },
            {
              id: 'ActionListFeature:f9c92dab46d8df88b9c2456ec89dbb50',
              title: 'Latest Content',
              subtitle: null,
              actions: [
                {
                  id: 'ActionListAction:ffea60261dd94b9ccab49131224bd6b5',
                  title: 'Most Recent',
                  subtitle: 'Home Feed Curated Articles',
                  action: 'VIEW_CHILDREN',
                  image: null,
                  relatedNode: {
                    id: 'UniversalContentItem:f9c92dab46d8df88b9c2456ec89dbb50',
                    __typename: 'UniversalContentItem',
                  },
                  __typename: 'ActionListAction',
                },
              ],
              __typename: 'ActionListFeature',
            },
            {
              id: 'ActionListFeature:4f953bf39d9b67e375a6ad2031d55239',
              title: 'FOR YOU',
              subtitle: null,
              actions: [
                {
                  id: 'ActionListAction:e7a176712feeede348826bac2ffac208',
                  title: 'Articles for Men',
                  subtitle: 'Content Categories',
                  action: 'VIEW_CHILDREN',
                  image: null,
                  relatedNode: {
                    id: 'UniversalContentItem:84d44edf85771122574437bf9de16723',
                    __typename: 'UniversalContentItem',
                  },
                  __typename: 'ActionListAction',
                },
                {
                  id: 'ActionListAction:9d6485fd4c843995ee38d8bea38f59d4',
                  title: 'Articles on Leadership',
                  subtitle: 'Content Categories',
                  action: 'VIEW_CHILDREN',
                  image: null,
                  relatedNode: {
                    id: 'UniversalContentItem:e2a02c4bf96acf51dc7e6a400a2cedba',
                    __typename: 'UniversalContentItem',
                  },
                  __typename: 'ActionListAction',
                },
                {
                  id: 'ActionListAction:9d30a5370c934acfe9073ec7004b6d06',
                  title: 'Guest Speakers',
                  subtitle: 'Content Categories',
                  action: 'VIEW_CHILDREN',
                  image: null,
                  relatedNode: {
                    id: 'UniversalContentItem:c37184a10463e8c8f572a0b6343ac902',
                    __typename: 'UniversalContentItem',
                  },
                  __typename: 'ActionListAction',
                },
              ],
              __typename: 'ActionListFeature',
            },
            {
              id: 'ActionListFeature:f86c398506ad7a7f68a0a5b138e69cb2',
              title: 'GLOBAL ITEM',
              subtitle: null,
              actions: [
                {
                  id: 'ActionListAction:e4168b1a97b0ee0e12ea03fab0d824a7',
                  title: 'Second',
                  subtitle: 'Global Items List',
                  action: 'READ_GLOBAL_CONTENT',
                  image: null,
                  relatedNode: {
                    id: 'UniversalContentItem:f86c398506ad7a7f68a0a5b138e69cb2',
                    __typename: 'UniversalContentItem',
                  },
                  __typename: 'ActionListAction',
                },
              ],
              __typename: 'ActionListFeature',
            },
          ],
        },
      },
    };

    const navigation = {
      getParam: jest.fn(),
      setParams: jest.fn(),
      navigate: jest.fn(),
    };
    const tree = renderer.create(
      <Providers mocks={[mock]} addTypename={false}>
        <Home navigation={navigation} />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
});
