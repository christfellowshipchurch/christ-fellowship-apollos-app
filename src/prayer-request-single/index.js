import { createStackNavigator } from 'react-navigation';

import PrayerRequestSingle from './PrayerRequestSingle';

const PrayerRequestSingleNavigator = createStackNavigator(
    {
        PrayerRequestSingle,
    },
    {
        initialRouteName: 'PrayerRequestSingle',
        headerMode: 'float',
        headerTransitionPreset: 'fade-in-place',
        navigationOptions: { header: null },
    }
);

export default PrayerRequestSingleNavigator;
