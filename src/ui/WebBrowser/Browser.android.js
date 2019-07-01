import { Linking } from 'react-native';

const Browser = {
  openURL: async (url) => {
    if (!Linking.canOpenURL(url)) throw new Error('URL not supported');
    Linking.openURL(url);
  },
};

export default Browser;
