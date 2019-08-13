import React from 'react';
import PropTypes from 'prop-types';

import { ActionCard, BodyText } from '@apollosproject/ui-kit';
import ShareButton from 'ChristFellowship/src/ui/ShareButton';

const TextFeature = ({ body, contentId }) => (
  <ActionCard action={<ShareButton message={body} itemId={contentId} />}>
    <BodyText>{body}</BodyText>
  </ActionCard>
);

TextFeature.propTypes = {
  body: PropTypes.string.isRequired,
  contentId: PropTypes.string.isRequired,
};

export const TEXT_FEATURE_FRAGMENT = `
fragment TextFeatureFragment on TextFeature {
  body
  id
}
`;

export default TextFeature;
