import { createStackNavigator } from 'react-navigation';

import ChannelsList from './ChannelsList';
import Channel from './Channel';

const ChatNavigator = createStackNavigator(
  {
    ChannelsList,
    Channel,
  },
  {
    initialRouteName: 'ChannelsList',
    headerLayoutPreset: 'left',
  }
);

export default ChatNavigator;
