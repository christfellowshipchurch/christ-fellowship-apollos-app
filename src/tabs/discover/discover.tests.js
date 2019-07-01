import React from 'react';
import renderer from 'react-test-renderer';
import { createStackNavigator } from 'react-navigation';

import Providers from 'ChristFellowship/src/Providers';

import Discover from './Discover';
import GET_CONTENT_CHANNELS from './getContentChannels';

describe('Test the Discover Component Query', () => {
  it('Should retrieve the Content Channel Feeds', () => {
    const mock = {
      request: {
        query: GET_CONTENT_CHANNELS,
      },
      result: {
        data: {
          contentChannels: [
            {
              id: 'ContentChannel:4f68015ba18662a7409d1219a4ce013e',
              name: 'Editorial',
              childContentItemsConnection: {
                edges: [
                  {
                    node: {
                      id:
                        'UniversalContentItem:d57994350b9d213866b24dea3a97433d',
                      title: 'Mea Animal Aperiam Ornatus Eu',
                      coverImage: null,
                    },
                  },
                  {
                    node: {
                      id:
                        'UniversalContentItem:b36e55d803443431e96bb4b5068147ec',
                      title: 'Probo Senserit Id Mea, Ut Sed Malis Postea,',
                      coverImage: null,
                    },
                  },
                  {
                    node: {
                      id:
                        'UniversalContentItem:57c465ee3cd69524d729569b338607de',
                      title: 'Ea Harum Albucius Mel',
                      coverImage: null,
                    },
                  },
                ],
              },
            },
            {
              id: 'ContentChannel:a0f64573eabf00a607bec911794d50fb',
              name: 'Sermon Series',
              childContentItemsConnection: {
                edges: [
                  {
                    node: {
                      id:
                        'UniversalContentItem:1c627c20911791321f819125a65c3c9d',
                      title: 'Money Wise',
                      coverImage: {
                        sources: [
                          {
                            uri:
                              'https://apollosrock.newspring.cc/GetImage.ashx?guid=33e4c568-a456-4250-a8dc-6a4ceb548455',
                          },
                        ],
                      },
                    },
                  },
                  {
                    node: {
                      id:
                        'UniversalContentItem:66a4d75b02b447556e4e3806430a9946',
                      title: 'Momentum',
                      coverImage: {
                        sources: [
                          {
                            uri:
                              'https://apollosrock.newspring.cc/GetImage.ashx?guid=F3F2E438-2AE8-4EF4-980B-709463691296',
                          },
                        ],
                      },
                    },
                  },
                  {
                    node: {
                      id:
                        'UniversalContentItem:22c861a5d54d09634018f7eb132c452e',
                      title: 'Miracles in Luke',
                      coverImage: {
                        sources: [
                          {
                            uri:
                              'https://apollosrock.newspring.cc/GetImage.ashx?guid=EDFDBD47-BBE8-4BE9-8D3F-CC0059BD4CCC',
                          },
                        ],
                      },
                    },
                  },
                ],
              },
            },
            {
              id: 'ContentChannel:7fba1b1ee253e0fd5f0795b4b8b1175e',
              name: 'Devotion Series',
              childContentItemsConnection: {
                edges: [
                  {
                    node: {
                      id:
                        'UniversalContentItem:678b4a38968fc6004dd8b23e586c923e',
                      title: 'Psalms: A 28-Day Devotional',
                      coverImage: {
                        sources: [
                          {
                            uri:
                              'https://apollosrock.newspring.cc/GetImage.ashx?guid=ed857076-2623-4fdc-8476-50b3a60e0b68',
                          },
                        ],
                      },
                    },
                  },
                  {
                    node: {
                      id:
                        'UniversalContentItem:0f361c619b7e5dd511da181069498250',
                      title: '2 Samuel: A 5-Week Devotional',
                      coverImage: {
                        sources: [
                          {
                            uri:
                              'https://apollosrock.newspring.cc/GetImage.ashx?guid=aa68b674-9cf4-4f8a-8702-9564a4a9fa7b',
                          },
                        ],
                      },
                    },
                  },
                  {
                    node: {
                      id:
                        'UniversalContentItem:bc1002007d482c412962ad6b1f24901a',
                      title: '#MomLife: An 8-Day Devotional',
                      coverImage: {
                        sources: [
                          {
                            uri:
                              'https://apollosrock.newspring.cc/GetImage.ashx?guid=65dfddf1-c146-4599-bdb7-a8f53bf8fed2',
                          },
                        ],
                      },
                    },
                  },
                ],
              },
            },
          ],
        },
      },
    };

    const DiscoverWithNavigation = createStackNavigator({ Discover });
    const tree = renderer.create(
      <Providers mocks={[mock]}>
        <DiscoverWithNavigation />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
});
