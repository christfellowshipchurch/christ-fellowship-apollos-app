import { createStackNavigator } from 'react-navigation';

import MyPrayerRequestsFeed from './MyPrayerRequestsFeed';

const MyPrayerRequestsFeedNavigator = createStackNavigator(
    {
        MyPrayerRequestsFeed,
    },
    {
        initialRouteName: 'MyPrayerRequestsFeed',
        headerLayoutPreset: 'left',
    }
);

export default MyPrayerRequestsFeedNavigator;
