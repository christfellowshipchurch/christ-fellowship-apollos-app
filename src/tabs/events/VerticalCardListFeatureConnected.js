import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';

import { CardFeed } from 'ui/CardFeeds';
import ActionRow from 'ui/ActionRow';

const VerticalCardListFeature = ({
  cards: initialCards,
  isLoading,
  listKey,
  onPressItem,
  title,
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
      title={title}
      content={cards}
      removeClippedSubviews={false}
      onPressItem={onPressItem}
      isLoading={isLoading}
      listKey={listKey}
      seeMore={false}
      CardComponent={ActionRow}
    />
  );
};

VerticalCardListFeature.propTypes = {
  cards: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  isLoading: PropTypes.bool,
  listKey: PropTypes.string,
  loadingStateObject: PropTypes.shape({}),
  onPressItem: PropTypes.func,
  title: PropTypes.string,
};

export default VerticalCardListFeature;
