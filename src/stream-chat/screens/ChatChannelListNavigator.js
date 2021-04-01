import React from 'react';
import PropTypes from 'prop-types';
import { createNativeStackNavigator } from 'react-native-screens/native-stack';

import { ChatChannelList } from '../components';
import ChatChannelSingle from './ChatChannelSingle';

const { Screen, Navigator } = createNativeStackNavigator();

const ChatChannelListeNavigator = ({ route, navigation, ...props }) => (
  <Navigator {...props}>
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
      component={ChatChannelSingle}
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

export default ChatChannelListeNavigator;
