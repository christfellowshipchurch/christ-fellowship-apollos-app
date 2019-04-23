import React from 'react';
import renderer from 'react-test-renderer';

import { Providers } from '@apollosproject/ui-kit';

import Share from '.';

describe('the Share component', () => {
  it('should render', () => {
    const shareObject = {
      title: 'Shared Object Title',
      url: 'https://github.com/ApollosProject/apollos-prototype',
      message: 'Share this with all your friends and family',
    };
    const tree = renderer.create(
      <Providers>
        <Share content={shareObject} />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
});
