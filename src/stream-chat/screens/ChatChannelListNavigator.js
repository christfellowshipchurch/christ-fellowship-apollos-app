import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { createNativeStackNavigator } from 'react-native-screens/native-stack';

import {
  ChatChannelList,
  ChatChannel,
  NotificationsToggle,
} from '../components';

const { Screen, Navigator } = createNativeStackNavigator();

const ChatChannelListeNavigator = ({ route, navigation, ...props }) => (
  <Navigator
    {...props}
    headerMode="none"
    screenOptions={{
      headerShown: false,
    }}
  >
    <Screen
      name="ChatChannelList"
      component={ChatChannelList}
      initialParams={route.params}
      options={{
        title: 'Messages',
      }}
    />
    <Screen
      name="ChatChannelSingle"
      component={ChatChannel}
      initialParams={route.params}
      options={{
        title: 'Message',
      }}
    />
  </Navigator>
);

ChatChannelListeNavigator.propTypes = {
  route: PropTypes.shape({
    params: PropTypes.shape({}),
  }),
};

export default ChatChannelList;
