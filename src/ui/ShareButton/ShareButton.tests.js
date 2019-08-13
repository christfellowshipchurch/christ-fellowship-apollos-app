import React from 'react';
import Providers from 'ChristFellowship/src/Providers';
import { renderWithApolloData } from 'ChristFellowship/src/utils/testUtils';
import getShareContent from './getShareContent';
import ShareButton from '.';

const shareMock = {
  request: {
    query: getShareContent,
    variables: { itemId: '1' },
  },
  result: {
    data: {
      node: {
        id: '1',
        __typename: 'ContentSeriesContentItem',
        sharing: {
          url: 'https://ChristFellowship.newspring.cc',
          message: 'Test Message',
          title: 'Test Title ',
          __typename: 'SharableContentItem',
        },
      },
    },
  },
};

const mocks = [shareMock];

describe('the ShareButton', () => {
  it('renders a share button', async () => {
    const tree = await renderWithApolloData(
      <Providers mocks={mocks}>
        <ShareButton itemId={'1'} />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('renders a share button with custom url, message, and title', async () => {
    const tree = await renderWithApolloData(
      <Providers mocks={mocks}>
        <ShareButton
          itemId={'1'}
          url={'https://apollosrock.com'}
          message="Some great message"
          title="Some great title"
        />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
});
