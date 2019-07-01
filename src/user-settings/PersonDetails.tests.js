import React from 'react';
import renderer from 'react-test-renderer';
import wait from 'waait';

import Providers from 'ChristFellowship/src/Providers';

import GET_USER_PROFILE from '../tabs/connect/getUserProfile';
import PersonalDetails from './PersonalDetails';

describe('PersonalDetails component', () => {
  it('renders PersonalDetails when logged in', async () => {
    const mock = {
      request: {
        query: GET_USER_PROFILE,
      },
      result: {
        data: {
          currentUser: {
            profile: {
              firstName: 'Isaac',
              lastName: 'Hardy',
              nickName: 'Ike',
              email: 'isaac.hardy@newspring.cc',
            },
          },
        },
      },
    };
    const navigation = {
      navigate: jest.fn(),
      getParam: jest.fn(),
      goBack: jest.fn(),
    };
    const tree = renderer.create(
      <Providers mocks={[mock]}>
        <PersonalDetails navigation={navigation} />
      </Providers>
    );
    await wait(0); // wait for response from graphql
    expect(tree).toMatchSnapshot();
  });
});
