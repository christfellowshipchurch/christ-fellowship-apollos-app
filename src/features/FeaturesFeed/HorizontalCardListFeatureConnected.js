import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';

import { HorizontalCardListFeatureConnected as CoreHorizontalCardListFeatureConnected } from '@apollosproject/ui-connected';
import { CardFeed } from 'ui/CardFeeds';
import { HorizontalHighlightCard, HorizontalDefaultCard } from 'ui/Cards';

const SmallHighlightCard = (props) => (
  <HorizontalHighlightCard {...props} size="small" />
);
const MediumHighlightCard = (props) => (
  <HorizontalHighlightCard {...props} size="medium" />
);

const HorizontalCardListFeature = ({
  featureId,
  isLoading,
  title,
  cards,
  onPressItem,
  primaryAction,
  cardType,
}) => {
  const seeMore =
    get(primaryAction, 'title', '') !== '' &&
    get(primaryAction, 'action', '') !== '' &&
    get(primaryAction, 'relatedNode.id', '') !== '';

  const onPressHeader = () => {
    onPressItem(primaryAction);
  };

  let CardComponent = HorizontalDefaultCard;

  if (cardType === 'HIGHLIGHT') CardComponent = HorizontalHighlightCard;
  if (cardType === 'HIGHLIGHT_MEDIUM') CardComponent = MediumHighlightCard;
  if (cardType === 'HIGHLIGHT_SMALL') CardComponent = SmallHighlightCard;

  return (
    <CardFeed
      title={title}
      content={cards}
      removeClippedSubviews={false}
      isLoading={isLoading}
      key={featureId}
      seeMore={seeMore}
      seeMoreText={get(primaryAction, 'title', '')}
      onPressItem={onPressItem}
      onPressHeader={onPressHeader}
      card={CardComponent}
      loadingStateObject={{
        id: 'fake_id',
        title: '',
        coverImage: [],
        avatars: [],
      }}
      horizontal
    />
  );
};

HorizontalCardListFeature.propTypes = {
  featureId: PropTypes.string.isRequired,
  isLoading: PropTypes.bool,
  title: PropTypes.string,
  primaryAction: PropTypes.shape({
    action: PropTypes.string,
  }),
  onPressItem: PropTypes.func,
  cards: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
    })
  ),
};

HorizontalCardListFeature.propTypes = {
  cardType: 'DEFAULT',
};

const HorizontalCardListFeatureConnected = (props) => (
  <CoreHorizontalCardListFeatureConnected
    {...props}
    Component={HorizontalCardListFeature}
  />
);

export default HorizontalCardListFeatureConnected;
