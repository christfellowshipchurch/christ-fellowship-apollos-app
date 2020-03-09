import React from 'react';
import { renderWithApolloData } from '../../utils/testUtils';

import Providers from '../../Providers';

import GET_USER_PROFILE from './getUserProfile';
import UserAvatarHeaderConnected from './UserAvatarHeaderConnected';

describe('user avatar header connect', () => {
  it('renders user avatar header if logged in', async () => {
    const mock = {
      request: {
        query: GET_USER_PROFILE,
      },
      result: {
        data: {
          currentUser: {
            __typename: 'AuthenticatedUser',
            id: 'AuthenticatedUser:123',
            profile: {
              id: 'Person:123',
              __typename: 'Person',
              gender: 'Male',
              birthDate: '1980-02-10T00:00:00',
              firstName: 'Isaac',
              lastName: 'Hardy',
              campus: {
                __typename: 'Campus',
                id: 'Campus:a0f64573eabf00a607bec911794d50fb',
                name: 'Chicago Campus',
                latitude: 42.09203,
                longitude: -88.13289,
                distanceFromLocation: null,
                street1: '67 Algonquin Rd',
                street2: '',
                city: 'South Barrington',
                state: 'IL',
                postalCode: '60010-6143',
                image: {
                  __typename: 'ImageMediaSource',
                  uri: 'https://picsum.photos/300/300/?random',
                },
              },
              email: 'isaac.hardy@newspring.cc',
              nickName: 'Batman',
              photo: {
                __typename: 'ImageMediaSource',
                uri: 'https://some-uri.com/test.jpg',
              },
            },
          },
        },
      },
    };
    const navigation = { navigate: jest.fn(), getParam: jest.fn() };
    const tree = await renderWithApolloData(
      <Providers mocks={[mock]}>
        <UserAvatarHeaderConnected navigation={navigation} />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
});
