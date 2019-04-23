import React from 'react';
import renderer from 'react-test-renderer';
import wait from 'waait';

import Providers from 'ChristFellowship/src/Providers';

import getUserProfile from '../../../../tabs/connect/getUserProfile';
import AskNameConnected from './AskNameConnected';

describe('PersonalDetails component', () => {
  it('renders User Name when logged in', async () => {
    const mock = {
      request: {
        query: getUserProfile,
      },
      result: {
        data: {
          currentUser: {
            profile: {
              firstName: 'Aaron',
              lastName: 'Attendee',
              nickName: 'A-Aron',
            },
          },
        },
      },
    };
    const tree = renderer.create(
      <Providers mocks={[mock]}>
        <AskNameConnected />
      </Providers>
    );
    await wait(0); // wait for response from graphql
    expect(tree).toMatchSnapshot();
  });
});
