import { Linking } from 'react-native';
import { CustomTabs } from 'react-native-custom-tabs';

const Browser = {
  openURL: async (url, options = {}) => {
    try {
      await CustomTabs.openURL(url, options);
    } catch (e) {
      if (!Linking.canOpenURL()) throw new Error('URL not supported');
      Linking.openURL(url);
    }
  },
};

export default Browser;
