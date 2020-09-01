import { createStackNavigator } from 'react-navigation';

import ContentFeed from './ContentFeed';

export const ContentFeedNavigator = createStackNavigator(
    {
        ContentFeed,
    },
    {
        initialRouteName: 'ContentFeed',
        headerLayoutPreset: 'left',
    }
);

export default ContentFeedNavigator;
