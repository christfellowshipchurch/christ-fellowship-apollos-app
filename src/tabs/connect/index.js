import React from 'react';
import { createStackNavigator } from 'react-navigation';

import AvatarIcon from './AvatarIcon';
import Connect from './Connect';

const ConnectNavigator = createStackNavigator(
    {
        Connect,
    },
    {
        initialRouteName: 'Connect',
        headerMode: 'screen',
        headerLayoutPreset: 'left',
    }
);

ConnectNavigator.navigationOptions = {
    tabBarIcon: ({ focused }) => <AvatarIcon focused={focused} />,
    title: 'Profile',
};

export default ConnectNavigator;
