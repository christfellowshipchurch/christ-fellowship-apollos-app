import React from 'react';
import renderer from 'react-test-renderer';

import Providers from 'ChristFellowship/src/Providers';

import ScriptureList from './ScriptureList';

const scriptureReferences = ['1 Corinthians 15:57', 'Exodus 17:8-15'];

describe('the ScriptureList component', () => {
  it('renders a scripture List', () => {
    const tree = renderer.create(
      <Providers>
        <ScriptureList onPress={jest.fn()} references={scriptureReferences} />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
});
