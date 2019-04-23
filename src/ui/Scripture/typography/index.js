import { Text } from 'react-native';

import { styled } from '@apollosproject/ui-kit';

import ScriptureText from './ScriptureText';

const VerseNumber = styled(({ theme }) => ({
  fontSize: theme.helpers.rem(0.6),
  color: theme.colors.text.secondary,
}))(ScriptureText);

const RedLetters = styled(({ theme }) => ({
  color: theme.colors.wordOfChrist,
}))(Text);

const PoeticPause = styled({
  textAlign: 'right',
})(ScriptureText);

const LegalText = styled(({ theme }) => ({
  fontSize: theme.helpers.rem(0.6),
  lineHeight: theme.helpers.verticalRhythm(0.45),
  fontFamily: theme.typography.sans.regular.default,
  color: theme.colors.text.secondary,
}))(ScriptureText);

export { ScriptureText, VerseNumber, RedLetters, PoeticPause, LegalText };
