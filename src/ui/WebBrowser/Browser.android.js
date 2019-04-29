import { Linking } from 'react-native';

const Browser = {
  openURL: async (url, options = {}) => {
    if (!Linking.canOpenURL()) throw new Error('URL not supported');
    Linking.openURL(url);
  },
};

export default Browser;
