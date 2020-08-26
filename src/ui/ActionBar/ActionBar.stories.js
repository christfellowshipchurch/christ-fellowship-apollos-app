/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { storiesOf } from '@apollosproject/ui-storybook';
import { SafeAreaView } from 'react-navigation';

import ActionBar, { ActionBarItem } from '.';

storiesOf('ui-kit/ActionBar', module)
  .addDecorator((story) => <SafeAreaView>{story()}</SafeAreaView>)
  .add('Default', () => (
    <ActionBar>
      <ActionBarItem onPress={() => {}} label="Settings" icon="settings" />
      <ActionBarItem onPress={() => {}} label="Groups" icon="groups" />
      <ActionBarItem onPress={() => {}} label="Like" icon="like" />
    </ActionBar>
  ));
