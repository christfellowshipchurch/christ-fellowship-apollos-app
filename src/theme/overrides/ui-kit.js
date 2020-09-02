import { Platform } from 'react-native';

export default ({ sizing }) => ({
  'ui-kit.Card.Image.Image': {
    resizeMode: 'cover',
    ...Platform.select({
      android: {
        // fixes android borderRadius overflow display issue
        borderTopRightRadius: sizing.baseUnit,
        borderTopLeftRadius: sizing.baseUnit,
      },
    }),
  },
});
