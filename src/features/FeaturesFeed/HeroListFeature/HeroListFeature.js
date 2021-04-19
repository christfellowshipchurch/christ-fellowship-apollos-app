import React from 'react';
import PropTypes from 'prop-types';
import ApollosConfig from '@apollosproject/config';
import { dropRight, last, take } from 'lodash';
import { withProps } from 'recompose';

import {
  TouchableScale,
  withMediaQuery,
  styled,
  ImageSourceType,
  withTheme,
} from '@apollosproject/ui-kit';

import { CardMapper, HighlightCard, RowCard, ColumnCard } from 'ui/Cards';
import { CardFeed } from 'ui/CardFeeds';

const { FEATURE_FEEDS } = ApollosConfig;

const { heroListLength } = FEATURE_FEEDS;

/**
 * Maps the content into the correct buckets.
 * Returns: hero, body, footer, numColumns
 */
const mapContentDefault = (content) => {
  /**
   * For small displays, we want to use an elongated row card for the last item when we have a single item at the end of our content.
   */
  const useFooterItem = content.length % 2 !== 0;
  const footer = useFooterItem ? last(content) : null;

  /**
   * We always want to drop the first item, but if we are using a footer row, we also want to drop the last item from our collection.
   */
  const body = useFooterItem ? dropRight(content) : content;

  return { footer, body, numColumns: 2 };
};

/**
 * Maps the content into the correct buckets for large displays.
 * Returns: hero, body, footer, numColumns
 */
const mapContentMd = (content) => {
  /** If we are using a hero card, let's remove that card from our collection.
   */
  let body = content;
  if (body.length === 2) {
    body = body.map((item) => ({ ...item, Component: HighlightCard }));
  }

  /**
   * For large displays, we don't want a footer item, we only want a fynamic number of columns. We return null for everything
   */
  const footer = null;

  return { footer, body, numColumns: body.length === 2 ? 2 : 3 };
};

const FlexedTouchable = styled(() => ({
  flex: 1,
}))(TouchableScale);

const CapCard = ({ id, onPress, isLoading, ...props }) => (
  <FlexedTouchable onPress={isLoading ? () => null : onPress}>
    <CardMapper {...props} nodeId={id} isLoading={isLoading} />
  </FlexedTouchable>
);

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

const HeroListFeature = ({
  actions,
  error,
  isLoading,
  forceRatio,
  onPressItem,
  heroCard,
  primaryAction,
  mapContent,
  ...additionalProps
}) => {
  const loading = isLoading && !heroCard && !actions.length;

  /**
   * note : We want to send the CardFeed all but the first data item so we can display that first item as a larger card.
   */
  const mappedActions = actions.map((action) => ({
    ...action,
    coverImage: action?.image?.sources,
    summary: action?.subtitle,
  }));
  const { body, footer, numColumns } = mapContent(
    take(mappedActions, heroListLength)
  );
  const seeMore =
    !!primaryAction?.title &&
    !!primaryAction?.action &&
    !!primaryAction?.relatedNode?.id;

  return (
    <StyledCardFeed
      content={body}
      loadingStateDataLength={2}
      isLoading={loading}
      error={error}
      onPressItem={onPressItem}
      CardComponent={ColumnCard}
      ListHeaderComponent={
        (heroCard || loading) && (
          <CapCard
            onPress={() => onPressItem(heroCard)}
            {...heroCard}
            coverImage={heroCard?.coverImage?.sources}
            forceRatio={forceRatio}
            isLoading={loading}
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
            isLoading={loading}
            Component={RowCard}
          />
        )
      }
      seeMore={seeMore}
      seeMoreText={primaryAction?.title}
      onPressHeader={() => onPressItem(primaryAction)}
      numColumns={numColumns}
      {...additionalProps}
    />
  );
};

HeroListFeature.propTypes = {
  actions: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      summary: PropTypes.string,
    })
  ),
  isLoading: PropTypes.bool,
  error: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  numColumns: PropTypes.number,
  withHeroCard: PropTypes.bool,
  onPressItem: PropTypes.func,
  forceRatio: PropTypes.bool,
  heroCard: PropTypes.shape({
    action: PropTypes.string,
    title: PropTypes.string,
    hasAction: PropTypes.bool,
    actionIcon: PropTypes.string,
    labelText: PropTypes.string,
    summary: PropTypes.string,
    coverImage: ImageSourceType,
  }),
  primaryAction: PropTypes.shape({
    title: PropTypes.string,
    action: PropTypes.string,
    relatedNode: PropTypes.shape({
      id: PropTypes.string,
    }),
  }),
  mapContent: PropTypes.func,
};

HeroListFeature.defaultProps = {
  isLoading: false,
  actions: [],
  mapContent: () => null,
};

HeroListFeature.displayName = 'HeroListFeature';

const HeroListFeatureWithNumColumns = withMediaQuery(
  ({ md }) => ({ maxWidth: md }),
  withProps({ forceRatio: null, mapContent: mapContentDefault }),
  withProps({ forceRatio: 2.333, mapContent: mapContentMd })
)(HeroListFeature);

export default HeroListFeatureWithNumColumns;
