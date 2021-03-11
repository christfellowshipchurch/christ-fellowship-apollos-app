import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';

import ActionRow from 'ui/ActionRow';
import { CardFeed } from '../../../ui/CardFeeds';

const VerticalCardListFeature = ({
  cards: initialCards,
  error,
  isLoading,
  forceRatio,
  mapContent,
  onPressItem,
  ...additionalProps
}) => {
  const cards = initialCards.map(({ actionIcon, ...card }) => ({
    ...card,
    ...(actionIcon != null ? { actionIcon: card.actionIcon } : {}), // temp hack because ContentCard doesn't handle null action icon well
    coverImage: get(card, 'coverImage.sources', undefined),
    __typename: card.relatedNode.__typename,
    id: card.relatedNode.id,
  }));

  return (
    <CardFeed
      onPressItem={(item) => onPressItem(item)}
      CardComponent={ActionRow}
      content={cards}
      isLoading={isLoading}
      error={error}
      seeMore={false}
      removeClippedSubviews={false}
      {...additionalProps}
    />
  );
};

VerticalCardListFeature.propTypes = {
  isLoading: PropTypes.bool,
  error: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  forceRatio: PropTypes.number,
  mapContent: PropTypes.func,
  onPressItem: PropTypes.func,

  cards: PropTypes.arrayOf(PropTypes.shape({})),
  listKey: PropTypes.string,
  loadingStateObject: PropTypes.shape({}),
  title: PropTypes.string,
};

VerticalCardListFeature.defaultProps = {
  isLoading: false,
  cards: [],
};

VerticalCardListFeature.displayName = 'VerticalCardListFeature';

export default VerticalCardListFeature;
