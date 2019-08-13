import React from 'react';
import PropTypes from 'prop-types';

import { ActionCard } from '@apollosproject/ui-kit';
import { ScriptureItem } from '@apollosproject/ui-scripture';
import ShareButton from 'ChristFellowship/src/ui/ShareButton';

const createSharingText = ({ html, reference }) =>
  `${html.replace(/<[^>]*>?/gm, '')} ${reference}`;

const ScriptureFeature = ({ scriptures, isLoading, contentId }) => (
  <ActionCard
    icon={'text'}
    action={
      <ShareButton
        message={scriptures.map(createSharingText).join('\n\n')}
        itemId={contentId}
      />
    }
  >
    {scriptures.map(({ copyright, reference, html, id }) => (
      <ScriptureItem
        key={id}
        reference={reference}
        html={html}
        isLoading={isLoading}
        copyright={copyright}
      />
    ))}
  </ActionCard>
);

ScriptureFeature.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  scriptures: PropTypes.arrayOf(
    PropTypes.shape({
      html: PropTypes.string.isRequired,
      reference: PropTypes.string.isRequired,
      id: PropTypes.string.isRequired,
      copyright: PropTypes.string,
    })
  ),
  contentId: PropTypes.string.isRequired,
};

export const SCRIPTURE_FEATURE_FRAGMENT = `
fragment ScriptureFeatureFragment on ScriptureFeature {
  scriptures {
    id
    html
    reference
    copyright
  }
}
`;

export default ScriptureFeature;
