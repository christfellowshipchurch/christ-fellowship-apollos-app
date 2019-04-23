import React from 'react';
import renderer from 'react-test-renderer';
import wait from 'waait';

import Providers from 'ChristFellowship/src/Providers';

import getLoginState from '../tabs/connect/getLoginState';
import UserSettings from '.';

describe('UserSettings component', () => {
  it('renders UserSettings when logged in', async () => {
    const mock = {
      request: {
        query: getLoginState,
      },
      result: {
        data: { isLoggedIn: true },
      },
    };
    const navigation = { navigate: jest.fn(), getParam: jest.fn() };
    const tree = renderer.create(
      <Providers mocks={[mock]}>
        <UserSettings navigation={navigation} />
      </Providers>
    );
    await wait(0); // wait for response from graphql
    expect(tree).toMatchSnapshot();
  });
});
