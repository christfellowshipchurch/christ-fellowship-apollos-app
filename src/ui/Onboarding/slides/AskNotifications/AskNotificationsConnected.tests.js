import React from 'react';
import renderer from 'react-test-renderer';
import Providers from 'ChristFellowship/src/Providers';
import { getNotificationsEnabled } from 'ChristFellowship/src/notifications';
import { renderWithApolloData } from 'ChristFellowship/src/utils/testUtils';

import AskNotificationsConnected from './AskNotificationsConnected';

describe('The Onboarding AskNotificationsConnected component', () => {
  it('should render with a user not having granted push notifications permissions', async () => {
    const mocks = [
      {
        request: {
          query: getNotificationsEnabled,
        },
        result: {
          data: { notificationsEnabled: false },
        },
      },
    ];

    const component = (
      <Providers mocks={mocks} addTypename={false}>
        <AskNotificationsConnected onPressPrimary={jest.fn()} />
      </Providers>
    );

    const tree = await renderWithApolloData(component);
    expect(tree).toMatchSnapshot();
  });
  it('should render with a user having granted push notifications permissions', async () => {
    const component = (
      <Providers
        resolvers={{ Query: { notificationsEnabled: Promise.resolve(true) } }}
        addTypename={false}
      >
        <AskNotificationsConnected onPressPrimary={jest.fn()} />
      </Providers>
    );

    const tree = await renderWithApolloData(component);
    expect(tree).toMatchSnapshot();
  });

  it('should render with no data in the cache', () => {
    const tree = renderer.create(
      <Providers>
        <AskNotificationsConnected />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
});
