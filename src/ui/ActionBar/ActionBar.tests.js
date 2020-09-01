/* eslint-disable react-native/no-inline-styles */
import React from 'react';

import renderer from 'react-test-renderer';

import { Providers } from '@apollosproject/ui-kit';
import ActionBar, { ActionBarItem } from '.';

describe('the ActionBar component', () => {
  it('should render children', () => {
    const tree = renderer.create(
      <Providers>
        <ActionBar>
          <ActionBarItem onPress={() => {}} label="Settings" icon="settings" />
          <ActionBarItem onPress={() => {}} label="Groups" icon="groups" />
          <ActionBarItem onPress={() => {}} label="Like" icon="like" />
          <ActionBarItem onPress={() => {}} />
        </ActionBar>
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
});
