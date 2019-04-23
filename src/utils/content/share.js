import { Platform, Share } from 'react-native';
// import { get } from 'lodash';
// import { track, events } from 'ChristFellowship/src/analytics';
// import getSiteLink from './getSiteLink';

const share = ({ title, url }) => {
  Share.share({
    title,
    message: Platform.OS === 'android' ? `${title}\n${url}` : title,
    url,
  });
};

export default share;
