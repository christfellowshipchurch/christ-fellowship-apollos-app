import React from 'react';
import PropTypes from 'prop-types';
import ApollosConfig from '@apollosproject/config';
import { drop, dropRight, head, last, take, get } from 'lodash';
import { withProps } from 'recompose';

import {
  TouchableScale,
  withMediaQuery,
  withTheme,
  styled,
} from '@apollosproject/ui-kit';

import {
  CardMapper,
  HighlightCard,
  RowCard,
  ColumnCard,
} from '../../../ui/Cards';
import { CardFeed } from '../../../ui/CardFeeds';

const { FEATURE_FEEDS } = ApollosConfig;
const { verticalCardListLength } = FEATURE_FEEDS;

/**
 * Maps the content into the correct buckets.
 * Returns: hero, body, footer, numColumns
 */
const mapContentDefault = (content) => {
  /**
   * We want to send the CardFeed all but the first data item so we can display that first item as a larger card.
   */
  const hero = head(content);

  /**
   * For small displays, we want to use an elongated row card for the last item when we have a single item at the end of our content.
   */
  const useFooterItem = content.length % 2 === 0;
  const footer = useFooterItem ? last(content) : null;

  /**
   * We always want to drop the first item, but if we are using a footer row, we also want to drop the last item from our collection.
   */
  const body = useFooterItem ? dropRight(drop(content)) : drop(content);

  return { hero, footer, body, numColumns: 2 };
};

/**
 * Maps the content into the correct buckets for large displays.
 * Returns: hero, body, footer, numColumns
 */
const mapContentMd = (content) => {
  /**
   * We only want to use a hero card if there is only 1 item or if there are more than 2. Having 1 item means that single item will be the hero, having 2 should display both cards side-by-side, having more than 2 should display the hero card and then the rest of the content underneath
   */
  const useHero = content.length > 2 || content.length === 1;
  const hero = useHero ? head(content) : null;

  /** If we are using a hero card, let's remove that card from our collection.
   */
  let body = useHero ? drop(content) : content;
  if (body.length === 2) {
    body = body.map((item) => ({ ...item, Component: HighlightCard }));
  }

  /**
   * For large displays, we don't want a footer item, we only want a fynamic number of columns. We return null for everything
   */
  const footer = null;

  return { hero, footer, body, numColumns: body.length === 2 ? 2 : 3 };
};

const StyledCardFeed = withTheme(({ theme }) => ({
  ListHeaderComponentStyle: {
    marginHorizontal: theme.sizing.baseUnit * -0.5,
  },
  ListFooterComponentStyle: {
    marginHorizontal: theme.sizing.baseUnit * -0.5,
  },
  style: {
    paddingHorizontal: theme.sizing.baseUnit * 0.5,
  },
}))(CardFeed);

const FlexedTouchable = styled(() => ({
  flex: 1,
}))(TouchableScale);

const CapCard = ({ id, onPress, isLoading, ...props }) => (
  <FlexedTouchable onPress={isLoading ? () => null : onPress}>
    <CardMapper {...props} nodeId={id} isLoading={isLoading} />
  </FlexedTouchable>
);

CapCard.propTypes = {
  id: PropTypes.string,
  onPress: PropTypes.func,
  isLoading: PropTypes.bool,
};

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
  const { hero, body, footer, numColumns } = mapContent(
    take(cards, verticalCardListLength)
  );

  const showHero = (!error && hero) || isLoading;

  return (
    <StyledCardFeed
      onPressItem={(item) => onPressItem(item)}
      CardComponent={ColumnCard}
      numColumns={numColumns}
      content={body}
      isLoading={isLoading && !cards.length}
      error={error}
      ListHeaderComponent={
        showHero && (
          <CapCard
            onPress={() => onPressItem(hero)}
            {...hero}
            forceRatio={forceRatio}
            isLoading={isLoading && !cards.length}
            Component={HighlightCard}
          />
        )
      }
      ListFooterComponent={
        !error &&
        footer && (
          <CapCard
            onPress={() => onPressItem(footer)}
            {...footer}
            forceRatio={forceRatio}
            isLoading={isLoading && !cards.length}
            Component={RowCard}
          />
        )
      }
      seeMore={false}
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

const VerticalCardListFeatureWithNumColumns = withMediaQuery(
  ({ md }) => ({ maxWidth: md }),
  withProps({ forceRatio: null, mapContent: mapContentDefault }),
  withProps({ forceRatio: 2.333, mapContent: mapContentMd })
)(VerticalCardListFeature);

export default VerticalCardListFeatureWithNumColumns;
