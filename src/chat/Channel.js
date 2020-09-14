import React from 'react';
import { View } from 'react-native';
import { H4 } from '@apollosproject/ui-kit';

import { navigationOptions } from '../navigation';

const Channel = ({ navigation }) => {
  const userId = navigation.getParam('userId');
  return (
    <View
      style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
    >
      <H4>{`Chat with: ${userId}`}</H4>
    </View>
  );
};

Channel.navigationOptions = ({ navigation, ...props }) =>
  navigationOptions({
    navigation,
    ...props,
    title: 'Chat',
    headerLeft: null,
  });

export default Channel;
