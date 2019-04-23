import React from 'react';
import renderer from 'react-test-renderer';
import wait from 'waait';

import Providers from 'ChristFellowship/src/Providers';

import getUserProfile from '../getUserProfile';
import UserAvatarHeaderConnected from './UserAvatarHeaderConnected';

describe('user avatar header connect', () => {
  it('renders user avatar header if logged in', async () => {
    const mock = {
      request: {
        query: getUserProfile,
      },
      result: {
        data: {
          currentUser: {
            id: 'AuthenticatedUser:057b0758543270d1cb21784cac4d3f5c',
            profile: {
              firstName: 'Isaac',
              lastName: 'Hardy',
              location: 'Anderson, SC',
              email: 'isaac.hardy@newspring.cc',
              nickName: 'Ike',
              photo: {
                uri:
                  'https://apollosrock.newspring.cc:443/GetImage.ashx?guid=60fd5f35-3167-4c26-9a30-d44937287b87',
              },
            },
          },
        },
      },
    };
    const navigation = { navigate: jest.fn(), getParam: jest.fn() };
    const tree = renderer.create(
      <Providers mocks={[mock]}>
        <UserAvatarHeaderConnected navigation={navigation} />
      </Providers>
    );
    await wait(0); // wait for response from graphql
    expect(tree).toMatchSnapshot();
  });
});
