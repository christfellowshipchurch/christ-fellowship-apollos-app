import { Platform } from 'react-native';
import { lightenBy, darkenBy } from 'utils/theme';

export default ({ sizing, colors: themeColors }) => ({
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
  'ui-kit.inputs.Search.styles.TextInputWrapper': {
    borderColor: lightenBy(themeColors.screen, 0.25).hex(),
  },
});
