import { createStackNavigator } from 'react-navigation';

import PrivacyPolicy from './PrivacyPolicy';

const PrivacyPplicyNavigator = createStackNavigator(
    {
        PrivacyPolicy,
    },
    {
        initialRouteName: 'PrivacyPolicy',
        headerMode: 'float',
        headerTransitionPreset: 'fade-in-place',
        navigationOptions: { header: null },
    }
);

export default PrivacyPplicyNavigator;
