import { Platform } from 'react-native';

export default ({ colors: themeColors }) => ({
  'ui-connected.LikeButtonConnected.LikeButton.LikeIcon': {
    fill: themeColors.alert,
  },
  'ui-connected.SearchInputHeader.HeaderBorder': {
    ...Platform.select({
      ios: {
        shadowColor: 'transparent',
        shadowOpacity: 0,
        shadowRadius: 0,
        shadowOffset: {
          width: 0,
          height: 0,
        },
      },
      android: {
        elevation: 0,
      },
    }),
  },
});
