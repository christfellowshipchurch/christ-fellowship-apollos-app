import { Text } from 'react-native';
import PropTypes from 'prop-types';
import { compose, pure, setDisplayName } from 'recompose';

import { styled, withPlaceholder, Placeholder } from '@apollosproject/ui-kit';

const { Typography } = Placeholder;

const styles = styled(({ theme, bold, italic }) => {
  let fontStack = theme.typography.serif.regular.default;

  if (bold && italic) {
    fontStack = theme.typography.serif.bold.italic;
  } else if (bold) {
    fontStack = theme.typography.serif.bold.default;
  } else if (italic) {
    fontStack = theme.typography.serif.regular.italic;
  }

  return {
    fontSize: theme.helpers.rem(1),
    lineHeight: theme.helpers.verticalRhythm(1, 1.625),
    fontFamily: fontStack,
    color: theme.colors.text.primary,
  };
}, 'ScriptureText');

const ScriptureText = compose(
  setDisplayName('ScriptureText'),
  styles,
  withPlaceholder(Typography),
  pure
)(Text);

ScriptureText.propTypes = {
  bold: PropTypes.bool,
  italic: PropTypes.bool,
  isLoading: PropTypes.bool, // display loading placeholder
  ...Text.propTypes,
};

ScriptureText.defaultProps = {
  bold: false,
  italic: false,
};

export default ScriptureText;
