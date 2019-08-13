import React from 'react';
import renderer from 'react-test-renderer';

import Providers from 'ChristFellowship/src/Providers';
import UserAvatarHeader from './UserAvatarHeader';

describe('user avatar header', () => {
  it('renders user avatar header if logged in', () => {
    const props = {
      theme: {
        colors: {
          text: {
            tertiary: 'red',
          },
        },
      },
      firstName: 'Isaac',
      lastName: 'Hardy',
      location: 'Anderson, SC',
      photo: {
        uri: 'google.com',
      },
      refetch: jest.fn(),
      navigation: jest.fn(),
      disabled: true,
      isLoading: false,
    };

    const tree = renderer.create(
      <Providers>
        <UserAvatarHeader {...props} />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });

  it('renders placeholder when loading', () => {
    const props = {
      theme: {
        colors: {
          text: {
            tertiary: 'red',
          },
        },
      },
      firstName: 'Isaac',
      lastName: 'Hardy',
      location: 'Anderson, SC',
      photo: {
        uri: 'google.com',
      },
      refetch: jest.fn(),
      navigation: jest.fn(),
      disabled: true,
      isLoading: true,
    };

    const tree = renderer.create(
      <Providers>
        <UserAvatarHeader {...props} />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
});
