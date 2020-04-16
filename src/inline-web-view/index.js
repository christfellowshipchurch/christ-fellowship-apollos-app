import { createStackNavigator } from 'react-navigation';

import InlineWebView from './InlineWebView';

const InlineWebViewNavigator = createStackNavigator(
    {
        InlineWebView,
    },
    {
        initialRouteName: 'InlineWebView',
        headerMode: 'float',
        headerTransitionPreset: 'fade-in-place',
        navigationOptions: { header: null },
    }
);

export default InlineWebViewNavigator;
