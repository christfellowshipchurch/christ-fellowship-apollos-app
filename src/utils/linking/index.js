import { Linking } from 'react-native';

// eslint-disable-next-line import/prefer-default-export
export const openLink = ({ uri }) => {
    Linking.canOpenURL(uri).then((supported) => {
        if (supported) {
            Linking.openURL(uri);
        } else {
            console.log(`Don't know how to open URI: ${uri}`);
        }
    });
};
