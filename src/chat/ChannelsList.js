import React from 'react';
import { View } from 'react-native';
import { H4 } from '@apollosproject/ui-kit';

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

export default ChannelsList;
