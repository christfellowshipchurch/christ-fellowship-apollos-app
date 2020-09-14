import React from 'react';
import { View } from 'react-native';
import { H4 } from '@apollosproject/ui-kit';
import { createStackNavigator } from 'react-navigation';

import { navigationOptions } from '../navigation';

const ChannelsList = ({ navigation }) => {
  React.useEffect(() => {
    const userId = navigation.getParam('userId');
    if (userId) {
      navigation.navigate('Channel', navigation.state.params);
    }
  }, []);

  return (
    <View
      style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
    >
      <H4>{'Channels List'}</H4>
    </View>
  );
};

ChannelsList.navigationOptions = ({ navigation, ...props }) =>
  navigationOptions({
    navigation,
    ...props,
    title: 'Channels List',
    headerLeft: null,
  });

const ChannelsListNavigator = createStackNavigator(
  {
    ChannelsList,
  },
  {
    initialRouteName: 'ChannelsList',
    headerLayoutPreset: 'left',
  }
);

export default ChannelsListNavigator;
