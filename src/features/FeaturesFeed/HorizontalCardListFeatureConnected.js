import React from 'react';
import PropTypes from 'prop-types';
import { get, includes } from 'lodash';

import { HorizontalCardListFeatureConnected as CoreHorizontalCardListFeatureConnected } from '@apollosproject/ui-connected';
import { withTheme } from '@apollosproject/ui-kit';
import { CardFeed } from 'ui/CardFeeds';
import { HorizontalHighlightCard, HorizontalDefaultCard } from 'ui/Cards';

const SmallHighlightCard = (props) => (
  <HorizontalHighlightCard {...props} size="small" />
);
const MediumHighlightCard = (props) => (
  <HorizontalHighlightCard {...props} size="medium" />
);

const HorizontalCardListFeature = withTheme()(
  ({
    featureId,
    isLoading,
    title,
    cards,
    onPressItem,
    primaryAction,
    cardType,
    theme,
  }) => {
    const seeMore =
      get(primaryAction, 'title', '') !== '' &&
      get(primaryAction, 'action', '') !== '' &&
      get(primaryAction, 'relatedNode.id', '') !== '';

    const onPressHeader = () => {
      onPressItem(primaryAction);
    };

    let CardComponent = HorizontalDefaultCard;
    const snapToInterval =
      includes(cardType, 'MEDIUM') || includes(cardType, 'SMALL')
        ? 150 + theme.sizing.baseUnit
        : 240 + theme.sizing.baseUnit;

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
        CardComponent={CardComponent}
        loadingStateObject={{
          id: 'fake_id',
          title: '',
          coverImage: [],
          avatars: [],
        }}
        horizontal
        snapToInterval={snapToInterval}
      />
    );
  }
);

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
