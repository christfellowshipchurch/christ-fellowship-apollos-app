import React from 'react';
import { withProps } from 'recompose';
import { Platform } from 'react-native';

import { Paragraph, H4 } from '@apollosproject/ui-kit';
import HTMLView, {
  defaultRenderer,
  wrapTextChildren,
} from '@apollosproject/ui-htmlview';

import {
  ScriptureText,
  VerseNumber,
  RedLetters,
  PoeticPause,
} from './typography';

const renderer = (node, { children, ...other }) => {
  // the defaultRenderer support several basic elements out of the box,
  // this function only needs to handle the cases that are unique to scripture.
  const className = (node && node.attribs && node.attribs.class) || '';

  /* Verse numbers
   * https://github.com/americanbible/api-bible-assets/blob/master/scss/eb-scripture-style/modules/_chapters-verses.scss#L33
   */
  if (className.includes('v')) {
    /* TODO: a single space before and importantly a non-breaking space (`\u00A0`) after wraps the number to
     * temporarily space verse numbers when they are not at the beginning of a sentence or
     * paragraph. It affects all instences (albeit less noticably in some cases) so a more procise
     * fix in the future is prefered.
     */
    return (
      <VerseNumber>
        {' '}
        {children}
        {`\u00A0`}
      </VerseNumber>
    );
  }

  /* Speaker identification and descriptive titles ("Hebrew subtitle")
   * https://github.com/americanbible/api-bible-assets/blob/master/scss/eb-scripture-style/modules/_titles-headings.scss#L109-L126
   */
  if (className.includes('sp') || className.includes('d')) {
    return <H4 padded>{children}</H4>;
  }

  /* Indented poetic line These are sometimes seen as a quote of the OT in the NT as well.
   * This uses spaces as a less ideal fix because we are bound by the limits of rendering HTML.
   * https://github.com/americanbible/api-bible-assets/blob/master/scss/eb-scripture-style/modules/_poetry.scss#L2
   */
  if (className.includes('q1')) {
    return (
      <ScriptureText>
        {'     '}
        {children}
      </ScriptureText>
    );
  }

  /* Double indented poetic lines. These are sometimes seen as a quote of the OT in the NT as well.
   * This uses spaces as a less ideal fix because we are bound by the limits of rendering HTML.
   * https://github.com/americanbible/api-bible-assets/blob/master/scss/eb-scripture-style/modules/_poetry.scss#L7
   */
  if (className.includes('q2')) {
    return (
      <ScriptureText>
        {'          '}
        {children}
      </ScriptureText>
    );
  }

  /* Triple indented poetic lines. These are sometimes seen as a quote of the OT in the NT as well.
   * This uses spaces as a less ideal fix because we are bound by the limits of rendering HTML.
   * https://github.com/americanbible/api-bible-assets/blob/master/scss/eb-scripture-style/modules/_poetry.scss#L8
   */
  if (className.includes('q3')) {
    return (
      <ScriptureText>
        {'               '}
        {children}
      </ScriptureText>
    );
  }

  /* Quadruple indented poetic lines. These are sometimes seen as a quote of the OT in the NT as well.
   * This uses spaces as a less ideal fix because we are bound by the limits of rendering HTML.
   * https://github.com/americanbible/api-bible-assets/blob/master/scss/eb-scripture-style/modules/_poetry.scss#L9
   */
  if (className.includes('q4')) {
    return (
      <ScriptureText>
        {'                    '}
        {children}
      </ScriptureText>
    );
  }

  if (className.includes('wj')) {
    return <RedLetters>{children}</RedLetters>;
  }

  /* Poetic pause ("Selah"). Highly conditional rendering due to Android not supporting nested text
   * alignment (https://github.com/facebook/react-native/issues/18790) and needing to keep it
   * somewhat attractive. TODO: revisit conditional code when issue is resolved or if we refactor
   * the parser
   *
   * https://github.com/americanbible/api-bible-assets/blob/master/scss/eb-scripture-style/modules/_poetry.scss#L22
   */
  if (className.includes('qs')) {
    return (
      <PoeticPause>
        {Platform.OS === 'ios' ? `\n` : null}
        {children}
        {Platform.OS === 'ios' ? `\n` : `\n\n`}
      </PoeticPause>
    );
  }

  if (node.name === 'p') {
    return (
      <Paragraph>
        <ScriptureText>
          {wrapTextChildren(children, ScriptureText)}
        </ScriptureText>
      </Paragraph>
    );
  }

  return defaultRenderer(node, { children, ...other });
};

const ScriptureHTMLView = withProps({
  renderer,
})(HTMLView);

export default ScriptureHTMLView;
