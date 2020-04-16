import { Linking } from 'react-native';
import NavigationService from '../../NavigationService';

// eslint-disable-next-line import/prefer-default-export
export const openLink = ({ uri, openInApp, title }) => {
    if (openInApp) {
        NavigationService.navigate('InlineWebView', {
            title,
            uri,
        });
    } else {
        Linking.canOpenURL(uri).then((supported) => {
            if (supported) {
                Linking.openURL(uri);
            } else {
                console.log(`Don't know how to open URI: ${uri}`);
            }
        });
    }
};
