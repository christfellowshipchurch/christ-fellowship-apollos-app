import { Platform, Share } from 'react-native';

const share = ({ title, url, message }) => {
  Share.share({
    title,
    message:
      Platform.OS === 'android'
        ? [message, url].filter((s) => !!s).join('\n')
        : message,
    url,
  });
};

export default share;
